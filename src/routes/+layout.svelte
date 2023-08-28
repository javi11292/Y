<script lang="ts">
	import Snackbar from "$lib/commons/components/snackbar";
	import "$lib/commons/utils/layout";
</script>

<main class="layout">
	<slot />
</main>

<Snackbar />

<style lang="scss">
	.layout {
		position: relative;
		left: 50%;
		translate: -50%;
		max-width: 640px;
	}
</style>
