<script lang="ts">
	import Button from "$lib/commons/components/button";
	import { addError } from "$lib/commons/components/snackbar";
	import { post } from "$lib/commons/utils/fetch";
	import { MAX_LENGTH } from "$lib/constants";
	import type { Post } from "$lib/database";
	import { posts } from "$lib/stores";
	import type { FormEventHandler } from "svelte/elements";
	import { fade, fly } from "svelte/transition";
	import Replacer from "../replacer";
	import { content } from "./store.svelte";

	let open = $state(false);
	let loading = $state(false);
	let amount = $derived(Math.max(1 - content.value.length / MAX_LENGTH, 0));

	let input: HTMLDivElement;
	let cursor = 0;
	let focusEnabled = false;

	const handlePopState = () => {
		if (open) {
			history.pushState(null, "", document.URL);
			closeModal();
		}
	};

	const send = async () => {
		loading = true;

		try {
			const response = await post<Post>("/api/post/add", { content: content.value });

			$posts.elements[response.id] = response;
			$posts.all.unshift(response.id);
			$posts = { ...$posts };
			content.value = "";
		} catch (error) {
			if (error instanceof Error) {
				addError(error.message);
			}
		}

		loading = false;
		closeModal();
	};

	const openModal = () => {
		document.documentElement.style.setProperty("--overflow", "hidden");
		history.replaceState(null, "", document.URL);
		history.pushState(null, "", document.URL);
		open = true;
	};

	const closeModal = () => {
		document.documentElement.style.setProperty("--overflow", "auto");
		open = false;
		focusEnabled = false;
	};

	const findNode = (
		node: Node,
		offset: number,
		result: { offset: number; node: Node | null } = {
			offset: 0,
			node: null,
		},
	) => {
		if (node.nodeType === Node.TEXT_NODE) {
			const { length } = node as Text;

			result.offset += length;

			if (result.offset >= offset) {
				result.node = node;
				result.offset = length + offset - result.offset;
			}

			return result;
		}

		for (let child of node.childNodes) {
			findNode(child, offset, result);
			if (result.node) return result;
		}

		return result;
	};

	const findOffset = (node: Node, anchor: Node, result = { offset: 0, found: false }) => {
		if (node === anchor) {
			result.found = true;
			return result.offset;
		}

		if (node.nodeType === Node.TEXT_NODE) {
			result.offset += (node as Text).length;
			return result.offset;
		}

		for (let child of node.childNodes) {
			findOffset(child, anchor, result);
			if (result.found) return result.offset;
		}

		return result.offset;
	};

	const oninput: FormEventHandler<HTMLDivElement> = (event) => {
		content.value = event.currentTarget.textContent || "";
		const selection = document.getSelection() as Selection;

		const offset = findOffset(input, selection.anchorNode as Node);
		cursor = offset + selection.anchorOffset;
	};

	const focus = (element: HTMLElement) => {
		if (!focusEnabled) {
			return;
		}

		element.focus();

		const { node, offset } = findNode(element, cursor);
		const selection = document.getSelection() as Selection;

		selection.setPosition(node, offset);
	};

	$effect(() => {
		addEventListener("popstate", handlePopState);

		return () => {
			removeEventListener("popstate", handlePopState);
		};
	});
</script>

<div class="container">
	<div class="button">
		<div>
			<Button size="lg" icon="add" variant="contained" onclick={openModal} />
		</div>
	</div>

	{#if open}
		<div
			class="post"
			transition:fly={{ y: "100%" }}
			on:introend={() => {
				input.focus();
				focusEnabled = true;
			}}
			on:outroend={() => history.back()}
		>
			<div class="actions">
				<Button icon="arrow-right" mirror onclick={closeModal} />
				<Button
					onclick={send}
					variant="contained"
					disableUpperCase
					size="sm"
					disabled={!content.value || content.value.length > MAX_LENGTH}
					{loading}
				>
					Enviar
				</Button>
			</div>

			{#key content.value}
				<div
					use:focus
					contenteditable
					class="editable"
					bind:this={input}
					{oninput}
					placeholder="¿Que está pasando?"
				>
					<Replacer content={content.value} />
				</div>
			{/key}

			<hr />

			<div class="counter">
				{#if MAX_LENGTH - content.value.length <= 10}
					<span transition:fade>{MAX_LENGTH - content.value.length}</span>
				{/if}
				<svg
					class="icon"
					viewBox="22 22 44 44"
					style={`--pi: ${Math.PI.toString()}; --amount: ${amount}`}
				>
					<circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6" />
					<circle
						class="circle"
						class:error={amount === 0}
						cx="44"
						cy="44"
						r="20.2"
						fill="none"
						stroke-width="3.6"
					/>
				</svg>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "$lib/commons/theme";

	hr {
		border-color: theme.$colorNeutral;
	}

	.container {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.counter {
		margin-left: auto;
		display: grid;
		grid-template-areas: "content";
		align-items: center;
		text-align: center;
		font-size: 0.8rem;
		width: 2rem;
		height: 2rem;

		span {
			grid-area: content;
			margin: 0.3rem;
			overflow: hidden;
		}
	}

	.icon {
		grid-area: content;
		stroke: theme.$colorNeutral;
		rotate: -90deg;
	}

	.circle {
		transition: all 200ms;
		stroke-dasharray: calc(40.4 * var(--pi));
		stroke-dashoffset: calc(40.4 * var(--pi) * var(--amount));
		stroke: theme.$colorPrimary;

		&.error {
			stroke: theme.$colorError;
		}
	}

	.post {
		position: absolute;
		top: 0;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		background: black;
		padding: 1rem;
		pointer-events: all;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: start;
	}

	:global(.actions) {
		:nth-child(1) {
			margin: -0.5rem;
		}
	}

	.button {
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		bottom: 0;
		padding: 1rem;
		pointer-events: none;

		> div {
			display: flex;
			justify-content: end;

			> :global(*) {
				pointer-events: auto;
			}
		}
	}

	.editable {
		outline: none;
		margin-top: 0.5rem;
		max-height: 50vh;
		overflow-y: auto;
		cursor: text;

		&:empty:before {
			content: attr(placeholder);
			display: block;
			color: theme.$colorNeutral;
		}
	}
</style>
