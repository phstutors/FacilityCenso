export function normalizarSimNao(valor) {
  if (!valor) return false;

  const v = String(valor).toUpperCase().trim();
  return v === "SIM" || v === "S" || v === "1";
}

export function temDeficiencia(valor) {
  if (!valor) return false;

  const v = String(valor).trim();
  return v !== "--";
}