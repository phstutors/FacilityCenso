import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaWheelchair, FaBus, FaChartPie, FaChartBar, FaFileExcel, FaGraduationCap, FaSchool, FaUniversity, FaExclamationTriangle } from "react-icons/fa";
import { FiAlertTriangle, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import UploadArea from "./UploadArea";
import ResumoCard from "./ResumoCard";
import ListaAlunosModal from "./ModalLista";
import { lerPlanilha } from "../services/excelReader";
import { analisarDados, gerarResumo, calcularDistribuicaoCorRaca, calcularDistribuicaoTransporte, calcularDistribuicaoEscolaridade } from "../services/analyzer";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const [tipo, setTipo] = useState("ALUNO");
  const [resumo, setResumo] = useState(null);
  const [erros, setErros] = useState([]);
  const [modal, setModal] = useState(null);
  const [dadosGraficos, setDadosGraficos] = useState({
    distribuicaoCorRaca: [],
    distribuicaoTransporte: [],
    distribuicaoEscolaridade: [],
    inconsistenciaData: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localizacaoEscola, setLocalizacaoEscola] = useState("");

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  const COR_RACA_COLORS = {
    'parda': '#FF6B6B',
    'branca': '#4ECDC4',
    'preta': '#45B7D1',
    'amarela': '#96CEB4',
    'indígena': '#FECA57',
    'nao declarado': '#FF9FF3'
  };

  async function handleUpload(file) {
    setIsLoading(true);
    try {
      const { linhas, localizacaoEscola: localizacao } = await lerPlanilha(file);
      setLocalizacaoEscola(localizacao);

      const listaErros = analisarDados(tipo, linhas, localizacao);
      const resumoPlanilha = gerarResumo(tipo, linhas, localizacao);
      
      // Calcular dados para gráficos
      const distribuicaoCorRaca = calcularDistribuicaoCorRaca(linhas);
      const distribuicaoTransporte = tipo === "ALUNO" ? calcularDistribuicaoTransporte(linhas) : [];
      const distribuicaoEscolaridade = tipo === "PROFISSIONAL" ? calcularDistribuicaoEscolaridade(linhas) : [];
      
      // Dados de inconsistência
      const totalValido = linhas.filter(l => {
        const nome = l["nome"]?.trim() || "";
        const cpf = l["cpf"]?.trim() || "";
        return nome !== "" && cpf !== "";
      }).length;
      
      const inconsistenciaData = [
        { name: 'Total', value: totalValido },
        { name: 'Inconsistências', value: listaErros.length }
      ];

      setDadosGraficos({
        distribuicaoCorRaca,
        distribuicaoTransporte,
        distribuicaoEscolaridade,
        inconsistenciaData
      });

      setErros(listaErros);
      setResumo(resumoPlanilha);
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 md:p-6"
    >
      {/* Efeito de partículas no background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/20"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Analítico</span>
              </h1>
              <p className="text-gray-300">
                Análise completa de dados do Educacenso
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <select
                value={tipo}
                onChange={e => setTipo(e.target.value)}
                className="bg-gray-800/80 backdrop-blur-sm border border-cyan-500/30 text-white px-6 py-3 rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                  appearance-none cursor-pointer font-medium shadow-lg"
              >
                <option value="ALUNO" className="bg-gray-800">📊 Planilha de Aluno</option>
                <option value="PROFISSIONAL" className="bg-gray-800">👨‍🏫 Planilha de Profissional</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none">
                ▼
              </div>
            </motion.div>
          </div>

          {/* Info Localização */}
          {localizacaoEscola && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 
                rounded-lg border border-cyan-500/30 backdrop-blur-sm"
            >
              <div className={`w-3 h-3 rounded-full ${localizacaoEscola === 'rural' ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`} />
              <span className="text-white">
                Localização da Escola: <span className="font-bold capitalize">{localizacaoEscola}</span>
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Área de Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <UploadArea onUpload={handleUpload} />
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-12"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-semibold">Processando...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards de Resumo */}
        {resumo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <ResumoCard
              titulo={tipo === "ALUNO" ? "Total de Alunos" : "Total de Profissionais"}
              valor={resumo.total}
              icon={<FaUsers className="text-2xl" />}
              color="from-cyan-500 to-blue-500"
              trend={resumo.total > 0 ? "up" : "none"}
              percentage="100%"
            />
            
            <ResumoCard
              titulo="Com Deficiência"
              valor={resumo.deficiencia}
              icon={<FaWheelchair className="text-2xl" />}
              color="from-green-500 to-emerald-500"
              onClick={() => setModal({ titulo: "Com Deficiência", alunos: resumo.listaDeficiencia })}
              trend={resumo.deficiencia > 0 ? "up" : "none"}
              percentage={`${((resumo.deficiencia / resumo.total) * 100).toFixed(1)}%`}
            />
            
            {tipo === "ALUNO" && (
              <ResumoCard
                titulo="Recebem Transporte"
                valor={resumo.transporte}
                icon={<FaBus className="text-2xl" />}
                color="from-purple-500 to-pink-500"
                onClick={() => setModal({ titulo: "Alunos que Recebem Transporte", alunos: resumo.listaTransporte })}
                trend={resumo.transporte > 0 ? "up" : "none"}
                percentage={`${((resumo.transporte / resumo.total) * 100).toFixed(1)}%`}
              />
            )}
          </motion.div>
        )}

        {/* Gráficos */}
        {resumo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Linha 1: Gráficos de Distribuição */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráfico de Cor/Raça */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaChartPie className="text-cyan-400" />
                    Distribuição de Cor/Raça
                  </h3>
                  <span className="text-sm text-gray-300">Total: {resumo.total}</span>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosGraficos.distribuicaoCorRaca}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value} (${((entry.value / resumo.total) * 100).toFixed(1)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosGraficos.distribuicaoCorRaca.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COR_RACA_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} (${((value / resumo.total) * 100).toFixed(1)}%)`, 'Quantidade']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                          border: '1px solid #06b6d4',
                          borderRadius: '10px',
                          color: 'white'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Gráfico de Transporte (Alunos) ou Escolaridade (Profissionais) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FaChartBar className="text-purple-400" />
                    {tipo === "ALUNO" ? "Uso de Transporte Escolar" : "Escolaridade dos Profissionais"}
                  </h3>
                  <span className="text-sm text-gray-300">Em porcentagem</span>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {tipo === "ALUNO" ? (
                      <BarChart data={dadosGraficos.distribuicaoTransporte}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Porcentagem']}
                          contentStyle={{ 
                            backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                            border: '1px solid #8b5cf6',
                            borderRadius: '10px',
                            color: 'white'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Porcentagem"
                          radius={[4, 4, 0, 0]}
                        >
                          {dadosGraficos.distribuicaoTransporte.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === 'Sim' ? '#10B981' : '#EF4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <BarChart data={dadosGraficos.distribuicaoEscolaridade}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#9CA3AF"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                            border: '1px solid #8b5cf6',
                            borderRadius: '10px',
                            color: 'white'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Quantidade"
                          radius={[4, 4, 0, 0]}
                        >
                          {dadosGraficos.distribuicaoEscolaridade.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Linha 2: Gráfico de Inconsistências */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FiAlertTriangle className="text-red-400" />
                  Análise de Inconsistências
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-300">Total Válido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span className="text-sm text-gray-300">Inconsistências</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGraficos.inconsistenciaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                        border: '1px solid #ef4444',
                        borderRadius: '10px',
                        color: 'white'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      name="Quantidade"
                      radius={[4, 4, 0, 0]}
                    >
                      {dadosGraficos.inconsistenciaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Total' ? '#3B82F6' : '#EF4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {dadosGraficos.inconsistenciaData[1]?.value > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-lg border border-red-500/30">
                  <p className="text-red-300 text-center">
                    <FaExclamationTriangle className="inline-block mr-2" />
                    {((dadosGraficos.inconsistenciaData[1].value / resumo.total) * 100).toFixed(1)}% dos registros têm inconsistências
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Tabela de Inconsistências */}
        {erros.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm 
              rounded-2xl p-6 border border-red-500/30 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiAlertTriangle className="text-red-400" />
                Inconsistências Detectadas
                <span className="ml-2 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 
                  text-white text-sm font-bold rounded-full">
                  {erros.length}
                </span>
              </h2>
              <div className="text-gray-300 text-sm">
                Total de registros: {resumo?.total || 0}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-4 px-4 text-left text-gray-300 font-semibold">
                      <div className="flex items-center gap-2">
                        <FaUsers className="text-cyan-400" />
                        Nome
                      </div>
                    </th>
                    <th className="py-4 px-4 text-left text-gray-300 font-semibold">CPF</th>
                    <th className="py-4 px-4 text-left text-gray-300 font-semibold">
                      <div className="flex items-center gap-2">
                        <FiAlertTriangle className="text-red-400" />
                        Inconsistências
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {erros.map((a, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 
                            flex items-center justify-center">
                            <span className="text-cyan-300 font-bold">{a.nome?.charAt(0) || "—"}</span>
                          </div>
                          <span className="text-white">{a.nome || "—"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <code className="bg-gray-900 px-3 py-1 rounded-lg text-cyan-300">
                          {a.cpf || "—"}
                        </code>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-2">
                          {a.erros?.map((erro, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 
                                text-red-300 rounded-lg text-sm border border-red-500/30"
                            >
                              {erro}
                            </span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {modal && <ListaAlunosModal titulo={modal.titulo} alunos={modal.alunos} onClose={() => setModal(null)} />}
    </motion.div>
  );
}