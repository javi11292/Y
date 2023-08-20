<script lang="ts">
	import { post } from "$lib/commons/utils/fetch";
	import Form from "$lib/components/form";

	const fields = [
		{ name: "username", label: "Usuario" },
		{ name: "password", label: "Contraseña", type: "password" },
		{ name: "confirmPassword", label: "Repite la contraseña", type: "password" },
	];

	const handleSubmit = async (values: Record<string, string>) => {
		if (values.password !== values.confirmPassword) {
			throw { message: "Las contraseñas no coinciden" };
		}

		await post("/api/register", { username: values.username, password: values.password });
	};
</script>

<Form title="Registro" {fields} onSubmit={handleSubmit} />
