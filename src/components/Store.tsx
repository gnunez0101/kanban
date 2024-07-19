import React, { createContext, useReducer, useState } from "react";
import data from '../assets/data.json'

type typeData = { 
  boards: { 
    name: string,
    columns: { 
      name: string,
        tasks: { 
          title: string,
          description: string,
          status: string,
          subtasks: {
            title: string,
            isCompleted: boolean
          }[]
        }[]
    }[]
  }[]
}

type typeValueData = {
  database:     typeData,
  boardAdmin?:  (command: string, coord: typeCoords) => void,
  columnAdmin?: (command: string, coord: typeCoords) => void,
  taskAdmin?:   (command: string, coord: typeCoords) => void,
  subtaskAdmin: (command: string, coord: typeCoords, value: any) => void
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
  setCurrentBoard: (board: number | null) => void
}

type StoreProps = { children: React.ReactNode }

type typeCoords = number[]

export const ContextDatabase = createContext<typeValueData    | undefined>(undefined)
export const ContextDialogs  = createContext<typeValueDialogs | undefined>(undefined)

export const StoreProvider = ( props: StoreProps ) => {
  // const [ setDialog ]       = useState<any>(null)
  const [dialogsData, setDialogsData] = useState<typeDialogs | undefined>(undefined)
  const [currentBoard, setCurrentBoard] = useState<number | null>(null)
   
  const [database, dispatch] = useReducer(dataReducer, data)

  function boardAdmin(command: string, coord: typeCoords) {
    // dispatch( { type: 'boardAdd', name: 'Board de Prueba' } )
  }

  function columnAdmin(command: string, coord: typeCoords) {
    
  }

  function taskAdmin(command: string, coord?: typeCoords) {
  }

  function subtaskAdmin(command: string, coord: typeCoords, values: any): void {
    dispatch( { type: "subtaskEdit", coord: coord, values: values } )
  }

  const databaseValue: typeValueData = {
    database:     data,
    boardAdmin:   boardAdmin,
    columnAdmin:  columnAdmin,
    taskAdmin:    taskAdmin,
    subtaskAdmin: subtaskAdmin
  }

  const dialogsValue: typeValueDialogs = {
    dialogLaunch:    launchDialog,
    dialogsData:     dialogsData,
    setDialogsData:  setDialogsData,
    currentBoard:    currentBoard,
    setCurrentBoard: setCurrentBoard
  }
  
  function launchDialog( dialog: string, board?: number, column?: number, task?: number, callBack?: (param: any) => void ) {
    const _board  = board != undefined ? board : dialogsData ? dialogsData[1] : 0
    // const _column = column ? column : 0
    // const _task   = task   ? task   : 0
    setDialogsData( [dialog, _board, column, task, callBack] )
  }
      
  return (
      <ContextDatabase.Provider   value = { databaseValue }>
        <ContextDialogs.Provider  value = { dialogsValue }>
          { props.children }
        </ContextDialogs.Provider>
      </ContextDatabase.Provider>
  )
}

type typeAction =  
// | { type: 'boardAdd',      name: string }
// | { type: 'boardEdit',     index: number, name: string }
// | { type: 'boardDelete',   index: number }
// | { type: 'columnAdd',     name: string }
// | { type: 'columnEdit',    index: number, name: string }
// | { type: 'columnDelete',  index: number }
// | { type: 'taskAdd',       name: string }
// | { type: 'taskEdit',      index: number, values?: [] }
// | { type: 'taskDelete',    index: number }
// | { type: 'subtaskAdd',    name: string }
| { type: 'subtaskEdit',   coord: typeCoords, values: any }
// | { type: 'subtaskDelete', index: number }

function dataReducer(state: typeData, action: typeAction): typeData {
  
  switch (action.type) {

    case 'subtaskEdit': {
      let _data = data
      _data.boards[action.coord[0]].columns[action.coord[1]].tasks[action.coord[2]] = action.values
      console.log("task:", action.values)
      return _data
    }

    default:
      return state
  }
}