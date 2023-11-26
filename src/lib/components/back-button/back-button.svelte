<script lang="ts">
	import Button from "$lib/commons/components/button";

	const handleClick = () => {
		history.back();
	};
</script>

<div class="button">
	<Button icon="arrow-right" mirror onclick={handleClick} />
	<slot />
</div>

<style lang="scss">
	.button {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
