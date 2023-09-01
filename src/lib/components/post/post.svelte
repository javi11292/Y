<script lang="ts">
	import { afterNavigate, goto, invalidate } from "$app/navigation";
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";
	import { portal } from "$lib/commons/utils/portal";
	import Back from "$lib/components/back";
	import { MAX_LENGTH } from "$lib/constants";
	import { scroll } from "$lib/stores";
	import { showError } from "$lib/utils/message";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	let open = false;
	let loading = false;
	let content = "";
	let input: HTMLDivElement;

	const handleClose = () => {
		open = location.hash === "#post";
		if (!open) {
			content = "";
			$scroll = true;
		} else {
			$scroll = false;
		}
	};

	onMount(() => {
		window.addEventListener("popstate", handleClose);

		return () => {
			window.removeEventListener("popstate", handleClose);
		};
	});

	afterNavigate(handleClose);

	$: amount = Math.max(1 - content.length / MAX_LENGTH, 0);

	const handleClick = async () => {
		loading = true;

		try {
			await post("/api/post/add", { content });
			await invalidate("posts");
		} catch (error) {
			showError(error);
		}

		loading = false;
		history.back();
	};

	const openModal = () => goto("#post", { noScroll: true });

	let portalTarget: null | Element = null;

	onMount(() => {
		const layout = document.querySelectorAll(".layout");
		portalTarget = layout[layout.length - 1];
	});
</script>

<div use:portal={portalTarget} hidden class="button">
	<div>
		<Button size="lg" icon="add" variant="contained" on:click={openModal} />
	</div>
</div>

{#if open}
	<div
		use:portal={portalTarget}
		hidden
		class="post"
		transition:fly={{ y: "100%" }}
		on:introend={() => input.focus()}
	>
		<div class="actions">
			<Back />
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
{/if}

<style lang="scss">
	@use "$lib/commons/theme";

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
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(50% - var(--scrollbarWidth, 0px) / 2);
		width: 100%;
		background: black;
		padding: 0.5rem;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: start;
	}

	.button {
		box-sizing: border-box;
		position: absolute;
		left: calc(50% - var(--scrollbarWidth, 0px) / 2);
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
