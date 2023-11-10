<script lang="ts">
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";
	import { MAX_LENGTH } from "$lib/constants";
	import type { Post } from "$lib/database";
	import { posts } from "$lib/stores";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	let open = false;
	let loading = false;
	let content = "";
	let input: HTMLDivElement;

	$: amount = Math.max(1 - content.length / MAX_LENGTH, 0);

	const handlePopState = () => {
		open = location.hash === "#post";

		if (!open) {
			content = "";
		}
	};

	const handleClick = async () => {
		loading = true;

		try {
			const response = await post<Post>("/api/post/add", { content });

			$posts.elements[response.id] = response;
			$posts.all.unshift(response.id);
			$posts = { ...$posts };
		} catch (error) {
			console.log(error);
		}

		loading = false;
		closeModal();
	};

	const openModal = () => {
		location.hash = "post";
	};

	const closeModal = () => {
		location.hash = "";
		history.replaceState(null, "", location.pathname);
	};

	onMount(() => {
		handlePopState();
		addEventListener("popstate", handlePopState);

		return () => {
			removeEventListener("popstate", handlePopState);
		};
	});
</script>

<div class="container">
	<div class="button">
		<div>
			<Button size="lg" icon="add" variant="contained" on:click={openModal} />
		</div>
	</div>
</div>

{#if open}
	<div class="container">
		<div class="post" transition:fly={{ y: "100%" }} on:introend={() => input.focus()}>
			<div class="actions">
				<Button icon="arrow-right" mirror on:click={closeModal} />
				<Button
					on:click={handleClick}
					variant="contained"
					disableUpperCase
					size="sm"
					disabled={!content || content.length > MAX_LENGTH}
					{loading}
				>
					Enviar
				</Button>
			</div>

			<div
				contenteditable
				class="editable"
				bind:this={input}
				bind:textContent={content}
				placeholder="¿Que está pasando?"
			/>

			<hr />

			<div class="counter">
				{#if MAX_LENGTH - content.length <= 10}
					<span transition:fade>{MAX_LENGTH - content.length}</span>
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
	</div>
{/if}

<style lang="scss">
	@use "src/lib/commons/theme";

	.container {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100dvh;
		pointer-events: none;
		overflow: hidden;
		z-index: 1;

		> * {
			pointer-events: all;
		}
	}

	hr {
		border-color: theme.$colorNeutral;
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
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		background: black;
		padding: 1rem;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: start;

		> :global(:nth-child(1)) {
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
