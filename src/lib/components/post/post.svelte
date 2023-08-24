<script lang="ts">
	import { invalidate } from "$app/navigation";
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";
	import { showError } from "$lib/utils/message";
	import { fade, fly } from "svelte/transition";

	const MAX_LENGTH = 280;

	let open = false;
	let loading = false;
	let content = "";

	$: {
		if (!open) {
			content = "";
		}
	}

	$: amount = Math.max(1 - content.length / MAX_LENGTH, 0);

	const focus = (node: HTMLElement) => {
		node.focus();
	};

	const handleClick = async () => {
		loading = true;

		try {
			await post("/api/post", { content });
			await invalidate("/api/post");
		} catch (error) {
			showError(error);
		}

		loading = false;
		open = false;
	};
</script>

<div class="button">
	<Button icon="add" variant="contained" on:click={() => (open = true)} />
</div>

{#if open}
	<div class="post" transition:fly={{ y: "100%" }}>
		<div class="actions">
			<Button icon="arrowRight" mirror on:click={() => (open = false)} />
			<Button
				on:click={handleClick}
				variant="contained"
				disableUpperCase
				size="sm"
				rounded
				disabled={!content}
				{loading}
			>
				Enviar
			</Button>
		</div>

		<div
			contenteditable
			class="editable"
			bind:textContent={content}
			use:focus
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
		overflow-y: scroll;

		&:empty:before {
			content: attr(placeholder);
			display: block;
			color: theme.$colorNeutral;
		}
	}
</style>
