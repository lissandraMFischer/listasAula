import { useState } from 'react'

//Função principal
export default function App(){

  const [input, setInput] = useState("");
  const [tarefas, setTarefas] = useState([
    'Estudar', 
    'Lavar louças',
    'Descansar'
  ])

  const [editarTarefa, setEditarTarefa] = useState({
    enabled: false,
    tarefa:''
  })

    function registrar(){
      if(!input){
        alert("Preencha o nome da sua tarefa")
        return;
      }
      
      if(editarTarefa.enabled){
        editarTarefaSalva();
        return;
      }

      setTarefas(tarefas => [...tarefas, input])
      setInput("")
    }

    function editarTarefaSalva(){
      const findIndexTarefa = tarefas.findIndex(tarefas => tarefas === editarTarefa.tarefa)
      const todasTarefas = [...tarefas];

      todasTarefas[findIndexTarefa]=input;
      setTarefas(todasTarefas);
      setEditarTarefa({
        enabled: false,
        tarefa: ''
      })
      setInput("")

    }

    function excluir(item: string){
      const excluirTarefa = tarefas.filter(tarefas => tarefas !== item)
      setTarefas(excluirTarefa)
    }
    function editar(item: string){
      setInput(item)
      setEditarTarefa({
        enabled:true,
        tarefa: item
      })
    }

   return (
      <div>
        <h1>Lista de tarefas</h1>

        <input
          placeholder="Digite uma tarefa..."
          value={input}
          onChange={ (e) => setInput(e.target.value)}
        />
        <button onClick={registrar}>Adicionar Tarefa</button>
        <hr/>
        
        {tarefas.map( (item, index) =>(
          <section key={item}>
            <span>{item}</span>
            <button onClick={ () => excluir(item) }>Excluir</button>
            <button onClick={ () => editar(item)}>Editar</button>
          </section>

        ))}
      </div>
  )
}
