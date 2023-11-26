<script lang="ts">
	import Button from "$lib/commons/components/button";

	const handleClick = () => {
		history.back();
	};
</script>

<Button icon="arrow-right" mirror onclick={handleClick} />
