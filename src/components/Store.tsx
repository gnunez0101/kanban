import './types'
import { createContext, useState } from "react";
import { useImmerReducer } from "use-immer"
import data from '../assets/data.json'

export const ContextDatabase = createContext<typeValueData    | undefined>(undefined)
export const ContextDialogs  = createContext<typeValueDialogs | undefined>(undefined)

var taskCounter = -1

export const StoreProvider = ( props: StoreProps ) => {
  // const data = { boards: [] }
  const [dialogsData, setDialogsData]   = useState<typeDialogs | undefined>(undefined)
  const [currentBoard, setCurrentBoard] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen]     = useState(false)

  // ------------------------------------------------------------------------------------
  const [database, dispatch] = useImmerReducer(dataReducer, data, loadData)
  // ------------------------------------------------------------------------------------
  
  function loadData(data: typeData) {
    // Load data from Local Storage, if exist:
    const kanbanStored = localStorage.getItem("kanban_data")
    taskCounter = 0    // Reset Counter for Task ID's
    const kanbanData: typeData = kanbanStored ? JSON.parse(kanbanStored) : data   // Load data
    // Adding IDs to tasks:
    kanbanData.boards.map((board: typeBoard) => 
      board.columns.map((column: typeColumn) => 
        column.tasks.map((task: typeTask) => {
          task.id = taskCounter.toString()
          taskCounter++
        })
      )
    )
    return kanbanData
  }

  function setTaskCounter(count: number) {
    taskCounter = count
  }

  const databaseValue: typeValueData = {
    database: database,
    dispatch: dispatch,
    taskCounter:    taskCounter,
    setTaskCounter: setTaskCounter
  }

  const dialogsValue: typeValueDialogs = {
    dialogLaunch:     launchDialog,
    dialogsData:      dialogsData,
    setDialogsData:   setDialogsData,
    currentBoard:     currentBoard,
    setCurrentBoard:  setCurrentBoard,
    subtaskChange:    dialogOpen,
    setSubTaskChange: setDialogOpen
  }
  
  function launchDialog( dialog: string, board?: number, column?: number, task?: number, callBack?: (param: any) => void ) {
    const _board  = board != undefined ? board : dialogsData ? dialogsData[1] : 0
    // const _column = column ? column : 0
    // const _task   = task   ? task   : 0
    setDialogsData( [dialog, _board, column, task, callBack] )
  }

  return (
    <ContextDatabase.Provider  value = { databaseValue }>
      <ContextDialogs.Provider value = { dialogsValue  }>
        { props.children }
      </ContextDialogs.Provider>
    </ContextDatabase.Provider>
  )
}

// ===============================================================================================================================
function dataReducer(draft: typeData, action: typeAction): typeData {

  switch (action.type) {
    
    case 'board_Add' : {
      draft.boards = [...draft.boards, action.values!]
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    case 'board_Modify' : {
      draft.boards[action.coord![0]] = action.values!
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    case 'board_Delete' : {
      draft.boards.splice(action.coord![0], 1)
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    case 'task_Add' : {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks = 
        [ ...draft.boards[action.coord[0]].columns[action.coord[1]].tasks, action.values ]
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    case 'task_Modify': {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]] = action.values
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    case 'task_MoveColumn' : {
      // Copy current Task:
      const taskToMove = draft.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]]
      // Delete Task from original column:
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks.splice(action.coord[2], 1)
      // Add Task to destination column, at last position:
      draft.boards[action.coord[0]].columns[action.dest].tasks = 
        [ ...draft.boards[action.coord[0]].columns[action.dest].tasks, taskToMove ]
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    case 'task_Move' : {
      // Copy current Task:
      const taskToMove = draft.boards[action.from[0]].columns[action.from[1]].tasks[action.from[2]]
      // Delete Task from original position:
      draft.boards[action.from[0]].columns[action.from[1]].tasks.splice(action.from[2], 1)
      // Add Task to destination position:
      draft.boards[action.to[0]].columns[action.to[1]].tasks.splice(action.to[2], 0, taskToMove)
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    case 'task_Delete' : {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks.splice(action.coord[2], 1)
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    case 'subtask_Modify': {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]].subtasks[action.coord[3]] = action.values
      localStorage.setItem("kanban_data", JSON.stringify(draft))
      return draft
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
// ===============================================================================================================================