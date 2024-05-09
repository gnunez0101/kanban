import './TaskAdd.css'
import { useEffect, useState } from 'react'
import useDatabase from '../hooks/useDatabase'
import useDialogs  from '../hooks/useDialogs'
import DialogModal from './DialogModal'
import Select from 'react-select'
import { Button } from './Button'

function TaskAdd( { board, add = false }: { board?: number, add?: boolean } ) {
  const { database }       = useDatabase()
  const { dialogLaunch } = useDialogs()

  // const taskData = database.boards[board].columns[column]
  const [subtasks, setSubtasks] = useState<any[]>([
    { text: '', placeholder: 'e.g. Make Coffee' },
    { text: '', placeholder: 'e.g. Drink coffee & smile' },
  ])

  type typeColumns = {
    value: string,
    label: string
  }
  const [columns, setColumns] = useState<typeColumns[]>()

  let firstTime = true
  useEffect(() => {
    if (firstTime) {
      firstTime = false
      let cols: typeColumns[] = database.boards[board!].columns.map((column: any) => {
        return { value: column.name, label: column.name }
      })
      setColumns(cols)
    }
  }, [])
  
  function closeDialog() {
    dialogLaunch("close", board, 0, 0)
  }

  return (
    <DialogModal onClick={closeDialog}>
      <section className="taskadd__dialog--title">
        {`${add ? "Add New Task" : "Edit Task"}`}
      </section>
      <section className="taskadd__title">
        <div className="taskadd__-title">Title</div>
        <div className="taskadd__-text">
          <textarea spellCheck={false}
            placeholder='e.g. Take coffee break'
            defaultValue = {""}
          />
        </div>
      </section>
      <section className="taskadd__description">
        <div className="taskadd__-title">Description</div>
        <div className="taskadd__-text">
          <textarea spellCheck={false}
            placeholder='e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little.'
            defaultValue = {""}
            style={{minHeight: "112px"}}
          />
        </div>
      </section>
      <section className="taskadd__subtasks">
        <div className="taskadd__-title">Subtasks</div>
        <div className="taskadd__items">
          { subtasks.map((subtask: typeSubtask, index: number) => 
            <Subtask data={subtask} key={index}/>
          )}
        </div>
        <Button className="taskadd__btn-add secondary">
          + Add New Subtask
        </Button>
      </section>
      <section className="taskadd__status">
        <div className="taskadd__-title">Status</div>
        <div className="taskadd__current-status--items">
          { columns &&
            <Select 
              defaultValue={columns[0]}
              options={columns}
              className='taskadd__current-status-select' 
              classNamePrefix='taskadd__current-status-select'
            />
          }
        </div>
      </section>
      <section className="taskadd__create">
        <Button className="taskadd__btn-create primary">
          {`${add ? "Create Task" : "Save Changes"}`}
        </Button>
      </section>
    </DialogModal>
  )
}
export default TaskAdd

type typeSubtask = {
  text: string,
  placeholder: string
}

function Subtask( {data} : {data: typeSubtask}) {
  return (
    <div className="taskadd__-text">
      <textarea spellCheck={false}
        placeholder={data.placeholder}
        defaultValue = {data.text}
      />
      <div className="taskadd__delete"></div>
    </div>
  )
}