import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

// Função principal
export default function App() {

  // Refs são usados para acessar elementos do DOM
  const inputRef = useRef<HTMLInputElement>(null); // Referência para o elemento de input
  const primeiraR = useRef(true); // Referência para controlar a primeira renderização

  // Estados para armazenar os dados da aplicação
  const [input, setInput] = useState(""); // Estado para o valor do input
  const [tarefas, setTarefas] = useState<string[]>([]); // Estado para as tarefas
  const [editarTarefa, setEditarTarefa] = useState({ // Estado para o modo de edição de tarefa
    enabled: false,
    tarefa: ''
  })

  // Efeito que carrega as tarefas salvas do localStorage na primeira renderização
  useEffect(() => {
    const tarefaSalva = localStorage.getItem("@cursoreact");
    if (tarefaSalva) {
      setTarefas(JSON.parse(tarefaSalva));
    }
  }, [])

  // Efeito que salva as tarefas no localStorage sempre que tarefas é atualizado
  useEffect(() => {
    if (primeiraR.current) {
      primeiraR.current = false;
      return;
    }

    localStorage.setItem("@cursoreact", JSON.stringify(tarefas));
    console.log("useEffect chamado!")
  }, [tarefas]);

  // Função para registrar ou atualizar uma tarefa
  const registrar = useCallback(() => {
    if (!input) {
      alert("Preencha o nome da sua tarefa");
      return;
    }

    if (editarTarefa.enabled) {
      editarTarefaSalva();
      return;
    }

    setTarefas(tarefas => [...tarefas, input]);
    setInput("");
  }, [input, tarefas, editarTarefa])

  // Função para editar uma tarefa existente
  function editarTarefaSalva() {
    const findIndexTarefa = tarefas.findIndex(tarefa => tarefa === editarTarefa.tarefa);
    const todasTarefas = [...tarefas];

    todasTarefas[findIndexTarefa] = input;
    setTarefas(todasTarefas);

    setEditarTarefa({
      enabled: false,
      tarefa: ''
    });
    setInput("");
  }

  // Função para excluir uma tarefa
  function excluir(item: string) {
    const excluirTarefa = tarefas.filter(tarefa => tarefa !== item);
    setTarefas(excluirTarefa);
  }

  // Função para entrar no modo de edição de uma tarefa
  function editar(item: string) {
    inputRef.current?.focus();

    setInput(item);
    setEditarTarefa({
      enabled: true,
      tarefa: item
    });
  }

  // Calcula o número total de tarefas usando useMemo para evitar cálculos desnecessários
  const totalTarefas = useMemo(() => {
    return tarefas.length;
  }, [tarefas])

  return (
    <div>
      <h1>Lista de tarefas</h1>

      {/* Input para adicionar/editar tarefas */}
      <input
        placeholder="Digite uma tarefa..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        ref={inputRef}
      />
      <button onClick={registrar}>{editarTarefa.enabled ? "Atualizar tarefa" : "Adicionar Tarefa"}</button>
      <hr />

      {/* Exibe o número total de tarefas */}
      <strong>Você tem: {totalTarefas} tarefas!</strong>

      {/* Mapeia e exibe as tarefas com botões para excluir/editar */}
      {tarefas.map((item, index) => (
        <section key={item}>
          <span>{item}</span>
          <button onClick={() => excluir(item)}>Excluir</button>
          <button onClick={() => editar(item)}>Editar</button>
        </section>
      ))}
    </div>
  )
}
