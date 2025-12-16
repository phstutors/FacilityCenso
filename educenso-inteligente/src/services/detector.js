export function detectarTipoPlanilha(colunas) {
const c = colunas.map(col => col.toUpperCase());


if (c.some(col => col.includes("ALUNO")) && c.some(col => col.includes("CPF"))) {
return "ALUNO";
}


if (c.some(col => col.includes("FUNÇÃO") || col.includes("CARGO"))) {
return "PROFISSIONAL";
}


return "DESCONHECIDO";
}