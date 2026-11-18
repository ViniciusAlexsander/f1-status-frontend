export const SITE_NAME = "F1 Status";

export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://f1status.app"
).replace(/\/$/, "");

export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? "";

export const UNOFFICIAL_DISCLAIMER =
  "O F1 Status é um projeto independente. Não somos afiliados, endossados ou licenciados pela Formula 1, Formula One Licensing B.V., Formula One Management, Liberty Media nem por qualquer equipe ou patrocinador.";
