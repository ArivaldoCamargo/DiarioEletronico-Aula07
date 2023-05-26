import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getAlunos from "../../requests/aluno";
import { removerAluno } from "../../requests/aluno";
import { toast } from "react-toastify";
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import './table.css';
import Modal from 'react-modal';
import { useState } from 'react';

export default function Table(props) {
  const queryClient = useQueryClient();
  const { formData, setFormData } = props;
  const [showModal, setShowModal] = useState(false);
  const [deletingAlunoId, setDeletingAlunoId] = useState(null);

  const { data, isFetching } = useQuery(["@alunos"], getAlunos, {
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation(removerAluno, {
    onSuccess: () => {
      queryClient.invalidateQueries(["@alunos"]);
      toast.success("Apagado com sucesso!");
      setShowModal(false);
      setDeletingAlunoId(null);
    },
    onError: () => {
      toast.error("Erro ao apagar aluno");
    },
  });

  if (isFetching) {
    return <h3>Buscando alunos...</h3>;
  }

  function apagarAluno(id) {
    setDeletingAlunoId(id);
    setShowModal(true);
  }

  function preencherCampos(aluno) {
    setFormData({ ...aluno, id: aluno._id });
  }

  function confirmarExclusao() {
    mutate(deletingAlunoId);
  }

  function cancelarExclusao() {
    setShowModal(false);
    setDeletingAlunoId(null);
  }

  return (
    <div className="cabecalho">
      <h2>Cadastro de Alunos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Ordem</th>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Curso</th>
            <th>Bimestre</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((aluno, index) => (
            <tr key={index}>
              <>
                <td>{index + 1}</td>
                <td>{aluno.nome}</td>
                <td>{aluno.matricula}</td>
                <td>{aluno.curso}</td>
                <td>{aluno.bimestre}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => preencherCampos(aluno)}>
                      <AiOutlineEdit color="blue" size={20} />
                    </button>
                    <button onClick={() => apagarAluno(aluno._id)}>
                      <AiOutlineDelete color="red" size={20} />
                    </button>
                  </div>
                </td>
              </>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
  isOpen={showModal}
  onRequestClose={cancelarExclusao}
  className="modal-container"
  overlayClassName="modal-overlay"
  contentLabel="Modal de Exclusão"
>
  <h2 className="modal-title">Deseja realmente excluir?</h2>
  <div className="modal-buttons">
    <button onClick={confirmarExclusao}>Sim</button>
    <button onClick={cancelarExclusao}>Cancelar</button>
  </div>
</Modal>

    </div>
  );
}