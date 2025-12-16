import * as XLSX from "xlsx";

function normalizeString(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export async function lerPlanilha(file) {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const linhasBrutas = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  // No excelReader.js, modifique a parte de detecção de localização:

// Detectar localização da escola - ajuste para buscar corretamente
let localizacaoEscola = "desconhecida";
for (let i = 0; i < linhasBrutas.length; i++) {
  const linha = linhasBrutas[i];
  if (!Array.isArray(linha)) continue;
  
  // Procurar pela linha que contém "Localização:"
  for (let j = 0; j < linha.length; j++) {
    const celula = String(linha[j]).toLowerCase().trim();
    if (celula.includes("localização:") || celula.includes("localizacao:")) {
      // Verificar se a próxima célula contém rural/urbana
      const proximaCelula = linha[j + 1]?.toLowerCase().trim() || "";
      if (proximaCelula.includes("rural")) {
        localizacaoEscola = "rural";
        break;
      }
      if (proximaCelula.includes("urbana")) {
        localizacaoEscola = "urbana";
        break;
      }
      
      // Se não encontrou, verificar a próxima linha
      if (i + 1 < linhasBrutas.length) {
        const proximaLinha = linhasBrutas[i + 1];
        if (Array.isArray(proximaLinha)) {
          for (let k = 0; k < proximaLinha.length; k++) {
            const celulaProx = String(proximaLinha[k]).toLowerCase().trim();
            if (celulaProx.includes("rural")) {
              localizacaoEscola = "rural";
              break;
            }
            if (celulaProx.includes("urbana")) {
              localizacaoEscola = "urbana";
              break;
            }
          }
        }
      }
      break;
    }
  }
  if (localizacaoEscola !== "desconhecida") break;
}

// Também procurar diretamente por "rural" ou "urbana" nas primeiras linhas
if (localizacaoEscola === "desconhecida") {
  for (let i = 0; i < Math.min(30, linhasBrutas.length); i++) {
    const linha = linhasBrutas[i]?.join(" ").toLowerCase() || "";
    if (linha.includes("rural")) {
      localizacaoEscola = "rural";
      break;
    }
    if (linha.includes("urbana")) {
      localizacaoEscola = "urbana";
      break;
    }
  }
}

  // Localizar cabeçalho - ajustar para encontrar corretamente
  let headerIndex = -1;
  for (let i = 0; i < linhasBrutas.length; i++) {
    const row = linhasBrutas[i].map(c => normalizeString(c));
    if (row.includes("ordem") && (row.includes("nome") || row.includes("cpf"))) {
      headerIndex = i;
      break;
    }
  }
  
  if (headerIndex === -1) {
    // Segunda tentativa: procurar por "Ordem" e "Nome"
    for (let i = 0; i < linhasBrutas.length; i++) {
      const row = linhasBrutas[i].map(c => normalizeString(c));
      if (row.includes("ordem") && row.includes("nome")) {
        headerIndex = i;
        break;
      }
    }
  }

  if (headerIndex === -1) throw new Error("Não foi possível localizar o cabeçalho na planilha");

  const colunas = linhasBrutas[headerIndex].map(c => normalizeString(c));

  // Função para verificar se uma linha é realmente vazia
  const linhaEhVazia = (linhaArray) => {
    // Remove as primeiras colunas (Ordem e Identificação única que podem ter números)
    const colunasParaVerificar = linhaArray.slice(2); // Pula Ordem e Identificação única
    return colunasParaVerificar.every(v => {
      const valor = String(v).trim();
      return valor === "" || valor === "--" || valor === "-" || valor === "null" || valor === "undefined";
    });
  };

  // Mapeia linhas válidas
  const linhas = [];
  for (let i = headerIndex + 1; i < linhasBrutas.length; i++) {
    const linhaArray = linhasBrutas[i];
    
    // Ignora linhas que são apenas rodapé (datas, notas, etc.)
    const linhaComoString = linhaArray.join(" ").toLowerCase();
    if (linhaComoString.includes("emitido em") || 
        linhaComoString.includes("nota:") ||
        linhaComoString.includes("os dados pessoais")) {
      continue;
    }
    
    if (!linhaEhVazia(linhaArray)) {
      const obj = {};
      colunas.forEach((col, j) => {
        obj[col] = linhaArray[j] ?? "";
      });
      
      // Verifica se tem pelo menos nome ou CPF válido
      const nome = obj["nome"] || "";
      const cpf = obj["cpf"] || "";
      if (String(nome).trim() !== "" || String(cpf).trim() !== "") {
        linhas.push(obj);
      }
    }
  }

  console.log("📍 LOCALIZAÇÃO DA ESCOLA:", localizacaoEscola);
  console.log("📍 Linhas extraídas (filtradas):", linhas.length);
  console.log("📍 Primeira linha:", linhas[0]);

  return { linhas, colunas, localizacaoEscola };
}