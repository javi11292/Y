<script lang="ts">
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";
	import Form from "$lib/components/form";

	const fields = [
		{ name: "username", label: "Usuario" },
		{ name: "password", label: "Contraseña", type: "password" },
		{ name: "confirmPassword", label: "Repite la contraseña", type: "password" },
	];

	let values = {};
</script>

<div class="container">
	<Form title="Registro" bind:values {fields}>
		<div class="button">
			<Button on:click={() => post("/api/register", values)}>Continuar</Button>
		</div>
	</Form>
</div>

<style lang="scss">
	.container {
		display: flex;
		justify-content: center;

		> :global(div) {
			flex: 1;
		}
	}

	.button {
		display: contents;
		text-align: center;
	}
</style>
