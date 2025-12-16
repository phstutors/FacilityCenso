import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartBar, FaFileExcel, FaSearch, FaEnvelope, FaPhone } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  const handleConsultar = () => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: <FaChartBar className="text-3xl text-blue-600" />,
      title: "Análise Inteligente",
      description: "Identifique automaticamente inconsistências nos dados do censo escolar."
    },
    {
      icon: <FaFileExcel className="text-3xl text-green-600" />,
      title: "Processamento de Planilhas",
      description: "Leia e processe arquivos Excel diretamente do Educacenso."
    },
    {
      icon: <FaSearch className="text-3xl text-purple-600" />,
      title: "Verificação em Tempo Real",
      description: "Detecte erros de preenchimento antes do envio oficial."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <FaChartBar className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">FacilityCenso</h1>
                <p className="text-sm text-gray-600">Sistema de Análise do Censo Escolar</p>
              </div>
            </div>
            <nav className="flex space-x-6">
              <a href="#sobre" className="text-gray-700 hover:text-blue-600 font-medium">Sobre</a>
              <a href="#recursos" className="text-gray-700 hover:text-blue-600 font-medium">Recursos</a>
              <a href="#contato" className="text-gray-700 hover:text-blue-600 font-medium">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            🎯 SOLUÇÃO OFICIAL
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Seja Bem-Vindo ao <span className="text-blue-600">FacilityCenso</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Seu sistema para facilitar a análise dos dados do censo escolar brasileiro. 
            O <strong>FacilityCenso</strong> oferece uma base sólida de informações para 
            garantir a qualidade e conformidade dos dados enviados ao Educacenso.
          </p>
          
          {/* Botão Principal */}
          <div className="mb-16">
            <button
              onClick={handleConsultar}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center mx-auto space-x-3"
            >
              <FaSearch className="text-xl" />
              <span>INICIAR CONSULTA</span>
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Clique para acessar o painel de análise de dados
            </p>
          </div>

          {/* Cards de Recursos */}
          <div id="recursos" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 bg-gray-50 p-4 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção de Consulta */}
        <div id="sobre" className="bg-white rounded-2xl shadow-lg p-10 max-w-4xl mx-auto mb-16 border border-gray-200">
          <div className="flex items-start space-x-4 mb-8">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <FaSearch className="text-2xl text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">CONSULTA INTELIGENTE</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 mb-6"></div>
            </div>
          </div>
          
          <div className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              Realize a análise completa dos dados de <strong>alunos</strong> e <strong>profissionais</strong> 
              da sua escola. O sistema processa automaticamente as planilhas exportadas do Educacenso 
              e identifica possíveis inconsistências.
            </p>
            
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
              <p className="text-gray-700">
                <strong className="text-blue-600">Funcionalidades da consulta:</strong>
              </p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Verificação de CPF válido e cor/raça declarada</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Análise de transporte escolar para áreas rurais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Validação de qualificação de profissionais</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Contagem de alunos com deficiência e necessidades especiais</span>
                </li>
              </ul>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed">
              Com o <strong>FacilityCenso</strong>, você garante que sua escola esteja em conformidade 
              com todas as exigências do censo escolar, evitando inconsistências e melhorando a 
              qualidade dos dados enviados ao INEP.
            </p>
          </div>
        </div>

        {/* Botão Final */}
        <div className="text-center mb-16">
          <button
            onClick={handleConsultar}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center mx-auto space-x-3"
          >
            <FaChartBar className="text-xl" />
            <span>ACESSAR PAINEL DE ANÁLISE</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FacilityCenso</h3>
              <p className="text-gray-400">
                Sistema especializado na análise e validação de dados do censo escolar brasileiro.
              </p>
            </div>
            
            <div id="contato">
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-blue-400" />
                  <a href="mailto:prisadmini5a@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                    phsefamilia8@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-blue-400" />
                  <a href="tel:+5581988897874" className="text-gray-300 hover:text-white transition-colors">
                    (81) 98899-7874
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Suporte</h3>
              <p className="text-gray-400 mb-4">
                Dúvidas sobre o uso do sistema ou problemas técnicos?
              </p>
              <p className="text-gray-400">
                Entre em contato pelo email ou telefone acima.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              Copyright © 2025 PhsTutors | Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Desenvolvido para otimizar o processo de análise do Censo Escolar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;