import React, { useState, useRef } from 'react';
import { FaFileExcel, FaUpload, FaCloudUploadAlt, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadArea({ onUpload }) {
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simular progresso de upload
      setUploadProgress(0);
      setIsUploaded(false);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 50);

      setTimeout(() => {
        clearInterval(progressInterval);
        setFileName(file.name);
        setIsUploaded(true);
        setUploadProgress(100);
        onUpload(file);
      }, 500);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes('spreadsheet') || file.name.includes('.xlsx') || file.name.includes('.xls'))) {
      const event = { target: { files: e.dataTransfer.files } };
      handleFileChange(event);
    }
  };

  const handleClearFile = () => {
    setFileName('');
    setIsUploaded(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Área de Upload Principal */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative overflow-hidden rounded-2xl cursor-pointer
          ${isDragging 
            ? 'border-2 border-blue-500 bg-blue-50/30' 
            : 'border border-gray-300/50 bg-white/10 backdrop-blur-sm'
          }
          ${isUploaded ? 'border-green-500/50' : 'border-gray-300/50'}
          transition-all duration-300 ease-out
          shadow-xl hover:shadow-2xl
          p-8 md:p-10
          before:absolute before:inset-0 before:bg-gradient-to-br 
          before:from-blue-500/5 before:via-purple-500/5 before:to-indigo-500/5
          before:animate-gradient-shift
        `}
        onClick={!isUploaded ? handleAreaClick : null}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Efeito de gradiente animado no fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-30" />
        
        {/* Efeito de partículas brilhantes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Conteúdo Principal */}
        <div className="relative z-10">
          {!isUploaded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              {/* Ícone Principal */}
              <motion.div
                animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative mx-auto w-20 h-20 mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl rotate-45 blur-sm opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl rotate-45" />
                <div className="relative flex items-center justify-center w-full h-full text-white">
                  <FaCloudUploadAlt className="text-3xl -rotate-45" />
                </div>
              </motion.div>

              {/* Textos */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isDragging ? 'Solte o arquivo' : 'Upload de Planilha'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {isDragging 
                  ? 'Solte aqui para enviar'
                  : 'Arraste e solte sua planilha ou clique para selecionar'
                }
              </p>

              {/* Botão de Seleção */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex items-center gap-3 px-6 py-3 
                  bg-gradient-to-r from-blue-600 to-indigo-600 
                  text-white font-semibold rounded-xl 
                  shadow-lg hover:shadow-xl 
                  transition-all duration-300
                  group overflow-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAreaClick();
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FaFileExcel className="text-xl relative z-10" />
                <span className="relative z-10">Selecionar Arquivo</span>
              </motion.button>

              {/* Formato Aceito */}
              <p className="mt-6 text-sm text-gray-500">
                Formatos aceitos: .xlsx, .xls
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {/* Ícone de Sucesso */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative mx-auto w-20 h-20 mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 
                  rounded-full animate-pulse" />
                <div className="relative flex items-center justify-center w-full h-full text-white">
                  <FaCheckCircle className="text-3xl" />
                </div>
              </motion.div>

              {/* Nome do Arquivo */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Arquivo Carregado!
              </h3>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gray-50 
                  rounded-xl border border-gray-200 mb-4"
              >
                <FaFileExcel className="text-green-600 text-xl" />
                <span className="font-medium text-gray-800 truncate max-w-xs">
                  {fileName}
                </span>
              </motion.div>

              {/* Botões de Ação */}
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearFile}
                  className="flex items-center gap-2 px-5 py-2.5 
                    bg-gradient-to-r from-gray-700 to-gray-800 
                    text-white font-medium rounded-lg
                    hover:from-gray-800 hover:to-gray-900 
                    transition-all duration-300"
                >
                  <FaTimes className="text-sm" />
                  Remover
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAreaClick}
                  className="flex items-center gap-2 px-5 py-2.5 
                    bg-gradient-to-r from-blue-600 to-indigo-600 
                    text-white font-medium rounded-lg
                    hover:from-blue-700 hover:to-indigo-700 
                    transition-all duration-300"
                >
                  <FaUpload className="text-sm" />
                  Alterar
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Barra de Progresso (aparece durante upload) */}
          <AnimatePresence>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8"
              >
                <div className="text-sm text-gray-600 mb-2">
                  Processando arquivo... {uploadProgress}%
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 
                      rounded-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent 
                      via-white/30 to-transparent animate-shimmer" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input de Arquivo (escondido) */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>

      {/* Texto Informativo */}
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Envie a planilha do Educacenso para análise automatizada
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Suporta arquivos Excel (.xlsx, .xls) exportados diretamente do sistema
        </p>
      </div>

      {/* Instruções */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50/30 
          rounded-xl p-6 border border-blue-100/50"
      >
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FaFileExcel className="text-blue-600" />
          Como obter a planilha:
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>Acesse o Educacenso e exporte a relação de alunos/profissionais</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>Salve o arquivo em formato Excel (.xlsx)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            <span>Faça o upload acima para análise automática</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}