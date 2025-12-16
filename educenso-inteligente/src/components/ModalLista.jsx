export default function ModalLista({ titulo, alunos, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-primary">{titulo}</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th>Nome</th>
              <th>CPF</th>
              <th>Deficiência</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((a, i) => (
              <tr key={i} className="border-b">
                <td>{a.nome}</td>
                <td>{a.cpf}</td>
                <td>{a.deficiencia}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={onClose}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}