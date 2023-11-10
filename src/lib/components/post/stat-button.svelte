<script lang="ts">
	import Icon from "$lib/commons/components/icon";

	export let icon: string;
</script>

<button class="button" on:click>
	<span class="icon">
		<Icon {icon} />
	</span>

	<div class="value">
		<slot />
	</div>
</button>

<style lang="scss">
	@use "src/lib/commons/theme";
	@use "src/lib/commons/classes";

	.value {
		transition: all;
		transition-duration: 200ms;
	}

	.icon {
		@extend %root;
		border-radius: 50%;
		overflow: hidden;
		padding: 0.5rem;
		margin-left: -0.5rem;
		font-size: 1.5rem;
	}

	.button {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding-right: 0.5rem;
		cursor: pointer;

		@media (hover: hover) {
			&:hover {
				color: theme.$colorPrimary;

				.icon {
					@include classes.hover;
				}
			}
		}

		&:active {
			color: theme.$colorPrimary;

			.icon {
				@include classes.active;

				scale: 95%;
			}
		}
	}
</style>
