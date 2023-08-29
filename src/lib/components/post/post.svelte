<script lang="ts">
	import { afterNavigate, goto, invalidate } from "$app/navigation";
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";
	import { portal } from "$lib/commons/utils/portal";
	import { MAX_LENGTH } from "$lib/constants";
	import { showError } from "$lib/utils/message";
	import { onMount } from "svelte";
	import { fade, fly } from "svelte/transition";

	let open = false;
	let loading = false;
	let content = "";
	let input: HTMLDivElement;

	onMount(() => {
		const handlePopState = () => {
			open = location.hash === "?post";
		};

		window.addEventListener("popstate", handlePopState);

		return () => window.removeEventListener("popstate", handlePopState);
	});

	afterNavigate(() => {
		open = location.search === "?post";
	});

	$: {
		if (!open) {
			content = "";
		}
	}

	$: amount = Math.max(1 - content.length / MAX_LENGTH, 0);

	const handleClick = async () => {
		loading = true;

		try {
			await post("/api/post", { content });
			await invalidate("posts");
		} catch (error) {
			showError(error);
		}

		loading = false;
		close();
	};

	const close = () => history.back();
</script>

<div use:portal hidden class="button">
	<Button
		size="lg"
		icon="add"
		variant="contained"
		on:click={() => goto("?post", { noScroll: true })}
	/>
</div>

{#if open}
	<div
		use:portal
		hidden
		class="post"
		transition:fly={{ y: "100%" }}
		on:introend={() => input.focus()}
	>
		<div class="actions">
			<Button icon="arrowRight" mirror on:click={close} />
			<Button
				on:click={handleClick}
				variant="contained"
				disableUpperCase
				size="sm"
				rounded
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
		position: fixed;
		inset: 0;
		background: black;
		padding: 0.5rem;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		align-items: start;
	}

	.button {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
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
