<header class="header">
	<slot />
</header>

<style lang="scss">
	.header {
		padding: 1rem;
		position: sticky;
		top: 0;
		z-index: 1;
		background: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(12px);
	}
</style>
