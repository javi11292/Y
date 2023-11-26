<script lang="ts">
	import Icon from "$lib/commons/components/icon";

	type Props = { children: () => any; icon: string; onclick?: (event: Event) => void };

	let { icon, onclick, children } = $props<Props>();
</script>

<button class="button" onclickcapture={onclick}>
	<span class="icon">
		<Icon {icon} />
	</span>

	<div class="value">
		{@render children()}
	</div>
</button>

<style lang="scss">
	@use "$lib/commons/theme";
	@use "$lib/commons/hover";

	.icon {
		@extend %root;

		transition: none;
		border-radius: 50%;
		overflow: hidden;
		padding: 0.5rem;
		margin-left: -0.5rem;
		font-size: 1.25rem;

		@media screen and (max-width: 640px) {
			padding: 0.25rem;
		}
	}

	.value {
		color: theme.$colorNeutral;
		font-size: 0.9em;
	}

	.button {
		transition: all;
		transition-duration: 200ms;
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding-right: 0.5rem;
		cursor: pointer;

		@media (hover: hover) {
			&:hover {
				color: theme.$colorPrimary;

				.value {
					color: theme.$colorPrimary;
				}

				.icon::before {
					opacity: 0.1;
				}
			}
		}

		&:active {
			color: theme.$colorPrimary;

			.value {
				color: theme.$colorPrimary;
			}

			.icon {
				scale: 95%;
			}

			.icon::before {
				opacity: 0.2;
			}
		}
	}
</style>
