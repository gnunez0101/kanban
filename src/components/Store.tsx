import './types'
import { createContext, useState } from "react";
import { useImmerReducer } from "use-immer"
import data from '../assets/data.json'

export const ContextDatabase = createContext<typeValueData    | undefined>(undefined)
export const ContextDialogs  = createContext<typeValueDialogs | undefined>(undefined)

export const StoreProvider = ( props: StoreProps ) => {
  // const data = { boards: [] }
  const [dialogsData, setDialogsData]   = useState<typeDialogs | undefined>(undefined)
  const [currentBoard, setCurrentBoard] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen]     = useState(false)

  // ------------------------------------------------------------------------------------
  const [database, dispatch] = useImmerReducer(dataReducer, data)
  // ------------------------------------------------------------------------------------
  
  const databaseValue: typeValueData = {
    database: database,
    dispatch: dispatch,
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
      return draft
    }

    case 'board_Modify' : {
      draft.boards[action.coord![0]] = action.values!
      return draft
    }

    case 'board_Delete' : {
      draft.boards.splice(action.coord![0], 1)
      return draft
    }

    case 'task_Add' : {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks = 
        [ ...draft.boards[action.coord[0]].columns[action.coord[1]].tasks, action.values ]
      return draft
    }

    case 'task_Modify': {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]] = action.values
      return draft
    }

    case 'task_Move' : {
      // Copy current Task:
      const taskToMove = draft.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]]
      // Delete Task from original column:
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks.splice(action.coord[2], 1)
      // Add Task to destination column, at last position:
      draft.boards[action.coord[0]].columns[action.dest].tasks = 
        [ ...draft.boards[action.coord[0]].columns[action.dest].tasks, taskToMove ]
      console.log("Task movida!")
      return draft
    }

    case 'task_Delete' : {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks.splice(action.coord[2], 1)
      return draft
    }

    case 'subtask_Modify': {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]].subtasks[action.coord[3]] = action.values
      return draft
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
// ===============================================================================================================================