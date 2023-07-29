<script lang="ts">
	import Form from "../../lib/components/form";

	const fields = [
		{ name: "username", label: "Usuario" },
		{ name: "password", label: "Contraseña", type: "password" },
		{ name: "confirmPassword", label: "Repite la contraseña", type: "password" },
	];
</script>

<Form title="Registro" {fields} />
