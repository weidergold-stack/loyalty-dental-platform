const TRANSLATIONS: Record<string, string> = {
  "Invalid login credentials": "Correo electrónico o contraseña incorrectos.",
  "Email not confirmed": "Debes confirmar tu correo electrónico antes de iniciar sesión.",
  "User already registered": "Ya existe una cuenta con este correo electrónico.",
  "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
  "Unable to validate email address: invalid format": "El formato del correo electrónico no es válido.",
  "User not found": "No encontramos una cuenta con ese correo electrónico.",
  "New password should be different from the old password.":
    "La nueva contraseña debe ser diferente a la anterior.",
  "Auth session missing!": "Tu sesión expiró. Solicita un nuevo enlace de recuperación.",
};

export function translateAuthError(message: string): string {
  if (TRANSLATIONS[message]) return TRANSLATIONS[message];

  if (/only request this after/i.test(message)) {
    return "Por seguridad, espera unos segundos antes de intentar de nuevo.";
  }

  return "Ocurrió un error. Intenta de nuevo.";
}
