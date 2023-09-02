<script lang="ts">
	import LoadingIcon from "$lib/commons/components/loading-icon";
	import { fade } from "svelte/transition";
</script>

<div in:fade class="loading">
	<LoadingIcon />
</div>

<style lang="scss">
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
</style>
