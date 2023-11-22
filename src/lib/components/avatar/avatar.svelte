<script lang="ts">
	interface Props {
		initial: string;
	}

	let { initial } = $props<Props>();
</script>

<div class="container">
	<div class="avatar">
		<svg viewBox="0 0 30 30">
			<g text-anchor="middle">
				<text y="6">{initial.toUpperCase()}</text>
			</g>
		</svg>
	</div>
</div>

<style lang="scss">
	@use "$lib/commons/theme";

	.container {
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 50%;
	}

	.avatar {
		background: theme.$colorNeutralLight;
	}

	text {
		font-size: 18px;
		translate: 50% 50%;
	}
</style>
