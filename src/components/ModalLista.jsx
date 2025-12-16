import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaIdCard, FaWheelchair } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

export default function ModalLista({ titulo, alunos, onClose }) {
  // Impede scroll do body quando modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Fecha modal com ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Overlay com blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative z-[10000] w-full max-w-4xl max-h-[85vh] overflow-hidden"
        >
          {/* Efeito de brilho no fundo */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-emerald-500/5 to-transparent" />
          
          {/* Conteúdo do Modal */}
          <div className="relative bg-gradient-to-b from-white to-emerald-50 rounded-2xl shadow-2xl border-2 border-primary-200 overflow-hidden">
            {/* Header do Modal */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {titulo.includes('Deficiência') ? (
                      <FaWheelchair className="text-white text-xl" />
                    ) : titulo.includes('Transporte') ? (
                      <FaIdCard className="text-white text-xl" />
                    ) : (
                      <FaUser className="text-white text-xl" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{titulo}</h2>
                    <p className="text-emerald-100 text-sm">
                      Total: {alunos.length} registro{alunos.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Fechar"
                >
                  <FiX className="text-2xl text-white" />
                </motion.button>
              </div>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 overflow-auto max-h-[60vh]">
              {alunos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-emerald-600 text-2xl" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    Nenhum registro encontrado
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-emerald-100">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-emerald-50/80 backdrop-blur-sm">
                        <th className="py-4 px-6 text-left text-emerald-700 font-semibold whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-emerald-600" />
                            Nome
                          </div>
                        </th>
                        <th className="py-4 px-6 text-left text-emerald-700 font-semibold whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaIdCard className="text-emerald-600" />
                            CPF
                          </div>
                        </th>
                        <th className="py-4 px-6 text-left text-emerald-700 font-semibold whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {titulo.includes('Deficiência') ? (
                              <>
                                <FaWheelchair className="text-emerald-600" />
                                Deficiência
                              </>
                            ) : (
                              <>
                                <FaUser className="text-emerald-600" />
                                Informação
                              </>
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50">
                      {alunos.map((a, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-emerald-50/50 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500/20 to-emerald-500/20 
                                flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-emerald-500/30 transition-all">
                                <span className="text-primary-700 font-bold text-sm">
                                  {a.nome?.charAt(0) || "?"}
                                </span>
                              </div>
                              <span className="font-medium text-gray-800">{a.nome || "Não informado"}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <code className="bg-emerald-100 text-primary-700 px-3 py-1.5 rounded-lg font-mono text-sm border border-emerald-200">
                              {a.cpf || "—"}
                            </code>
                          </td>
                          <td className="py-4 px-6">
                            <div className="max-w-xs">
                              {titulo.includes('Deficiência') ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 
                                  text-emerald-700 rounded-lg border border-emerald-200 text-sm">
                                  <FaWheelchair className="text-emerald-600" />
                                  {a.deficiencia || a.informacao || "Não especificado"}
                                </span>
                              ) : (
                                <div className="space-y-1">
                                  <span className="block text-gray-700">
                                    {a.deficiencia || a.informacao || a.residencia || "—"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer do Modal */}
            <div className="border-t border-emerald-100 px-6 py-4 bg-white/50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  {alunos.length} registro{alunos.length !== 1 ? 's' : ''} encontrado{alunos.length !== 1 ? 's' : ''}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-emerald-600 text-white font-medium 
                    rounded-xl shadow-md hover:shadow-lg transition-all hover:from-primary-600 hover:to-emerald-700
                    flex items-center gap-2"
                >
                  <FaTimes className="text-sm" />
                  Fechar
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}