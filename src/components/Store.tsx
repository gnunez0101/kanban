import React, { createContext, useState } from "react";
import { useImmerReducer } from "use-immer"
import data from '../assets/data.json'

type typeData = { 
  boards: Array<{
    name: string,
    columns: Array<{ 
      name: string,
        tasks: Array<{ 
          title: string,
          description: string,
          status: string,
          subtasks: Array<{
            title: string,
            isCompleted: boolean
          }>
        }>
    }>
  }>
}

type typeValueData = {
  database:     typeData,
  dispatch:     React.Dispatch<typeAction>
}

type typeDialogs = [
  dialog: string,
  board:  number | undefined,
  column: number | undefined,
  task:   number | undefined,
  callBack: ((param: any) => void) | undefined
] | undefined

type typeValueDialogs = {
  dialogLaunch: (dialog: string, board?: number, column?: number, task?: number, callBack?: (param: any) => void) => void,
  dialogsData?:  typeDialogs,
  setDialogsData: ([]: typeDialogs) => void,
  currentBoard: number | null,
  setCurrentBoard: (board: number | null) => void,
  subtaskChange: boolean,
  setSubTaskChange: (isOpen: boolean) => void
}

type StoreProps = { children: React.ReactNode }

type typeCoords = number[]

type typeBoard = {
  name: string,
  columns: typeColumn
}

type typeColumn = {
  name: string,
  tasks: typeTask[]
}

type typeTask = {
  title: string,
  description: string,
  status: string,
  subtasks: typeSubTask[],
}

type typeSubTask = {
  title: string,
  isCompleted: boolean
}

type typeBoardAction = {
  type:   'board_Add'|'board_Modify'|'board_Delete',
  coord:  typeCoords,
  values: typeBoard
}

type typeColumnAction = {
  type:   'column_Add'|'column_Modify'|'column_Delete',
  coord:  typeCoords,
  values: typeColumn
}

type typeTaskAction = {
  type: 'task_Add'|'task_Modify'|'task_Delete',
  coord: typeCoords,
  values: typeTask
}

type typeSubTaskAction = {
  type: 'subtask_Add'|'subtask_Modify'|'subtask_Delete',
  coord: typeCoords,
  values: typeSubTask
}

type typeAction = typeBoardAction | typeColumnAction | typeTaskAction | typeSubTaskAction

export const ContextDatabase = createContext<typeValueData    | undefined>(undefined)
export const ContextDialogs  = createContext<typeValueDialogs | undefined>(undefined)

export const StoreProvider = ( props: StoreProps ) => {
  
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
    
    case 'task_Add' : {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks = 
        [ ...draft.boards[action.coord[0]].columns[action.coord[1]].tasks, action.values ]
      return draft
    }

    case 'task_Modify': {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]] = action.values
      console.log("Tarea modificada...")
      return draft
    }

    case 'subtask_Modify': {
      draft.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]].subtasks[action.coord[3]] = action.values
      // console.log("Subtarea modificada...")
      return draft
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
// ===============================================================================================================================