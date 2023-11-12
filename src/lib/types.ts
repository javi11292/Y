import type { AstroGlobal } from "astro";

export type LoggedAstroGlobal = AstroGlobal & { locals: AstroGlobal["locals"] & { user: User } };
