<script lang="ts">
	import Button from "$lib/commons/components/button";
	import { post } from "$lib/commons/utils/fetch";
	import Form from "$lib/components/form";
	import { showError } from "$lib/utils/message";

	const fields = [
		{ name: "username", label: "Usuario" },
		{ name: "password", label: "Contraseña", type: "password" },
		{ name: "confirmPassword", label: "Repite la contraseña", type: "password" },
	];

	let values = { username: "", password: "", confirmPassword: "" };
	let loading = false;

	const validate = () => {
		if (values.password !== values.confirmPassword) {
			throw { error: "Las contraseñas no coinciden" };
		}
	};

	const handleClick = async () => {
		loading = true;

		try {
			validate();
			await post("/api/register", { username: values.username, password: values.password });
		} catch (error) {
			showError(error);
		}

		loading = false;
	};
</script>

<div class="container">
	<Form title="Registro" bind:values {fields}>
		<div class="button">
			<Button {loading} on:click={handleClick}>Continuar</Button>
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
