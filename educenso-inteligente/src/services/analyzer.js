function normalize(str) {
  return String(str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

function isEmptyLine(item) {
  if (!item) return true;
  return Object.values(item).every(v => {
    const valor = String(v).trim().toLowerCase();
    return (
      valor === "" ||
      valor === "--" ||
      valor === "-" ||
      valor === "null" ||
      valor === "undefined"
    );
  });
}

function getValue(item, keys) {
  for (const k of keys) {
    const normalizedKey = normalize(k);
    if (item[normalizedKey] !== undefined && item[normalizedKey] !== null) {
      const valor = item[normalizedKey];
      return normalize(valor);
    }
  }
  return "";
}

function validarCPF(cpf) {
  if (!cpf) return false;
  const cpfNumerico = cpf.replace(/\D/g, '');
  return cpfNumerico.length === 11;
}

const ALUNO_COLS = {
  nome: ["nome"],
  cpf: ["cpf"],
  cor_raca: ["cor/raca", "cor/raça", "raca", "raça"],
  residencia: ["localizacao/zona de residencia", "residencia"],
  transporte: ["transporte escolar (sim/nao)", "transporte escolar"],
  deficiencia: ["tipo(s) de deficiencia(s), transtorno(s) do espectro autista e altas habilidades ou superdotacao"]
};

const PROF_COLS = {
  nome: ["nome"],
  cpf: ["cpf"],
  cor_raca: ["cor/raca", "cor/raça", "raca", "raça"],
  escolaridade: ["maior nivel de escolaridade concluido", "maior nível de escolaridade concluido"],
  tipoEnsinoMedio: ["tipo de ensino medio cursado", "tipo de ensino médio cursado"],
  deficiencia: ["tipo(s) de deficiencia(s), transtorno(s) do espectro autista e altas habilidades ou superdotacao"]
};

export function analisarDados(tipo, linhas, localizacaoEscola = "rural") {
  if (!Array.isArray(linhas)) return [];

  let tipoPlanilha = tipo;
  const header = Object.keys(linhas[0] || {}).map(c => normalize(c));
  
  if (header.includes("maior nivel de escolaridade concluido")) {
    tipoPlanilha = "PROFISSIONAL";
  } else if (header.includes("localizacao/zona de residencia")) {
    tipoPlanilha = "ALUNO";
  }

  const erros = [];

  linhas.forEach(item => {
    if (isEmptyLine(item)) return;

    const listaErros = [];
    const nome = item["nome"]?.trim() || "—";
    const cpf = item["cpf"]?.trim() || "--";
    const cor = tipoPlanilha === "ALUNO" ? getValue(item, ALUNO_COLS.cor_raca) : getValue(item, PROF_COLS.cor_raca);

    // Valida CPF
    if (!validarCPF(cpf)) {
      listaErros.push("CPF não informado ou inválido");
    }

    // Valida Cor/Raça
    if (!cor || cor.includes("nao declarado")) {
      listaErros.push("Cor/Raça não declarada");
    }

    if (tipoPlanilha === "ALUNO") {
      const residencia = getValue(item, ALUNO_COLS.residencia);
      const transporte = getValue(item, ALUNO_COLS.transporte);

      if (localizacaoEscola === "rural" && residencia === "urbana" && transporte === "nao") {
        listaErros.push("Transporte Escolar | Residência: urbana | Escola: rural | Transporte: não");
      }
      if (localizacaoEscola === "rural" && transporte === "nao") {
        listaErros.push("Transporte Escolar obrigatório para alunos em área rural");
      }
      if (localizacaoEscola === "urbana" && residencia === "rural" && transporte === "nao") {
        listaErros.push("Transporte Escolar | Residência: rural | Escola: urbana | Transporte: não");
      }
    }

    if (tipoPlanilha === "PROFISSIONAL") {
      const escolaridade = getValue(item, PROF_COLS.escolaridade);
      const tipoEnsino = getValue(item, PROF_COLS.tipoEnsinoMedio);
      if (escolaridade === "ensino medio" && tipoEnsino === "formacao geral") {
        listaErros.push("Profissional com ensino médio regular (Formação Geral) não apto para atuar em sala de aula");
      }
    }

    if (listaErros.length > 0) {
      erros.push({ 
        nome: nome !== "—" ? nome : "Nome não informado", 
        cpf: validarCPF(cpf) ? cpf : "—", 
        erros: listaErros 
      });
    }
  });

  console.log(`📊 Total de linhas analisadas (${tipoPlanilha}):`, linhas.filter(l => !isEmptyLine(l)).length);
  console.log(`📊 Linhas com erros:`, erros.length);

  return erros;
}

export function gerarResumo(tipo, linhas, localizacaoEscola = "rural") {
  if (!Array.isArray(linhas) || linhas.length === 0) return null;

  let tipoPlanilha = tipo;
  const header = Object.keys(linhas[0] || {}).map(c => normalize(c));
  
  if (header.includes("maior nivel de escolaridade concluido")) {
    tipoPlanilha = "PROFISSIONAL";
  } else if (header.includes("localizacao/zona de residencia")) {
    tipoPlanilha = "ALUNO";
  }

  const linhasValidas = linhas.filter(l => !isEmptyLine(l));
  const total = linhasValidas.length;
  
  let deficiencia = 0;
  const listaDeficiencia = [];

  console.log(`📈 RESUMO - Tipo: ${tipoPlanilha}, Total válido: ${total}`);

  if (tipoPlanilha === "ALUNO") {
    let transporte = 0;
    const listaTransporte = [];

    linhasValidas.forEach(item => {
      const nome = item["nome"]?.trim() || "Não informado";
      const cpf = item["cpf"]?.trim() || "--";
      
      // Verifica deficiência
      const def = getValue(item, ALUNO_COLS.deficiencia);
      // Verifica se a deficiência não é vazia e não é "--"
      if (def && def !== "" && def !== "--") {
        // Palavras-chave para deficiência
        const palavrasDeficiencia = [
          "deficiencia",
          "transtorno",
          "autista",
          "altas habilidades",
          "superdotacao"
        ];
        const temDeficiencia = palavrasDeficiencia.some(palavra => def.includes(palavra));
        if (temDeficiencia) {
          deficiencia++;
          listaDeficiencia.push({ 
            nome: nome !== "Não informado" ? nome : "Nome não informado", 
            cpf: validarCPF(cpf) ? cpf : "—", 
            deficiencia: def 
          });
        }
      }

      // Verifica transporte
      const transporteAluno = getValue(item, ALUNO_COLS.transporte);
      const residencia = getValue(item, ALUNO_COLS.residencia);
      
      if (transporteAluno === "sim") {
        transporte++;
        listaTransporte.push({ 
          nome: nome !== "Não informado" ? nome : "Nome não informado", 
          cpf: validarCPF(cpf) ? cpf : "—", 
          residencia 
        });
      }
    });

    console.log(`📈 ALUNOS - Com deficiência: ${deficiencia}, Com transporte: ${transporte}`);
    
    return { 
      total, 
      deficiencia, 
      transporte, 
      listaDeficiencia, 
      listaTransporte 
    };
  }

  if (tipoPlanilha === "PROFISSIONAL") {
    linhasValidas.forEach(item => {
      const nome = item["nome"]?.trim() || "Não informado";
      const cpf = item["cpf"]?.trim() || "--";
      
      // Verifica deficiência
      const def = getValue(item, PROF_COLS.deficiencia);
      if (def && def !== "" && def !== "--") {
        const palavrasDeficiencia = [
          "deficiencia",
          "transtorno",
          "autista",
          "altas habilidades",
          "superdotacao"
        ];
        const temDeficiencia = palavrasDeficiencia.some(palavra => def.includes(palavra));
        if (temDeficiencia) {
          deficiencia++;
          listaDeficiencia.push({ 
            nome: nome !== "Não informado" ? nome : "Nome não informado", 
            cpf: validarCPF(cpf) ? cpf : "—", 
            deficiencia: def 
          });
        }
      }
    });

    console.log(`📈 PROFISSIONAIS - Total: ${total}, Com deficiência: ${deficiencia}`);
    
    return { 
      total, 
      deficiencia, 
      listaDeficiencia 
    };
  }

  return null;
}
// ... código existente ...

// Funções para gráficos
export function calcularDistribuicaoCorRaca(linhas) {
  const distribuicao = {};
  
  linhas.forEach(item => {
    const cor = normalize(item["cor/raca"] || "");
    if (cor && cor !== "--" && cor !== "-") {
      const chave = cor === "parda" ? "parda" : 
                   cor === "branca" ? "branca" : 
                   cor === "preta" ? "preta" : 
                   cor === "amarela" ? "amarela" : 
                   cor === "indígena" ? "indígena" : "outros";
      
      distribuicao[chave] = (distribuicao[chave] || 0) + 1;
    }
  });
  
  return Object.entries(distribuicao).map(([name, value]) => ({ name, value }));
}

export function calcularDistribuicaoTransporte(linhas) {
  let sim = 0;
  let nao = 0;
  
  linhas.forEach(item => {
    const transporte = normalize(item["transporte escolar (sim/nao)"] || "");
    if (transporte === "sim") sim++;
    else if (transporte === "nao") nao++;
  });
  
  const total = sim + nao;
  
  return [
    { name: 'Sim', value: total > 0 ? (sim / total) * 100 : 0 },
    { name: 'Não', value: total > 0 ? (nao / total) * 100 : 0 }
  ];
}

export function calcularDistribuicaoEscolaridade(linhas) {
  const distribuicao = {};
  
  linhas.forEach(item => {
    const escolaridade = normalize(item["maior nivel de escolaridade concluido"] || "");
    if (escolaridade && escolaridade !== "--" && escolaridade !== "-") {
      const chave = escolaridade.includes("medio") ? "Ensino Médio" :
                   escolaridade.includes("superior") ? "Graduação" :
                   escolaridade.includes("especializacao") ? "Pós-Graduação" : "Outros";
      
      distribuicao[chave] = (distribuicao[chave] || 0) + 1;
    }
  });
  
  return Object.entries(distribuicao).map(([name, value]) => ({ name, value }));
}