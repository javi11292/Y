<script lang="ts">
	import { post } from "$lib/commons/utils/fetch";
	import Form from "$lib/components/form";

	const fields = [
		{ name: "username", label: "Usuario" },
		{ name: "password", label: "Contraseña", type: "password" },
	];

	const handleSubmit = async (values: Record<string, string>) => {
		await post("/api/login", { username: values.username, password: values.password });
	};
</script>

<Form title="Login" {fields} onSubmit={handleSubmit} />
