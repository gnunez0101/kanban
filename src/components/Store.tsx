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
  database: typeData,
  boardAdmin?:   (command: string, coord: []) => void,
  columnAdmin?:  (command: string, coord: []) => void,
  taskAdmin?:    (command: string, coord: []) => void,
  subtaskAdmin?: (command: string, coord: []) => void
}

type StoreProps = { children: React.ReactNode }

export const ContextDatabase = createContext<typeValueData | null>(null)
export const ContextDialogs  = createContext<any | null>(null)

export const StoreProvider = ( props: StoreProps ) => {
    // const [ setDialog ]       = useState<any>(null)
    const [database, dispatch] = useReducer(dataReducer, data)
    const [dialogsData, setDialogsData] = useState<any>(null)

    function boardAdmin(command: string, coord: []) {
      dispatch( { type: 'boardAdd', name: 'Board de Prueba' } )
    }

    function columnAdmin(command: string, coord: []) {
      
    }

    function taskAdmin(command: string, coord: []) {

    }

    function subtaskAdmin(command: string, coord: []) {

    }

    const databaseValue: typeValueData = {
      database:     data,
      boardAdmin:   boardAdmin,
      columnAdmin:  columnAdmin,
      taskAdmin:    taskAdmin,
      subtaskAdmin: subtaskAdmin
    }

    function taskDialog( board: number, column: number, task: number, show: boolean ) {
      setDialogsData(["taskView", board, column, task, show])
    }
        
    type typeDialogs = {
      dialogTask?: (board: number, column: number, task: number, show: boolean) => void,
      dialogsData?: [dialog: string, board: number, column: number, task: number],
      setDialogsData: ([]) => void
    }
    
    const dialogsValue: typeDialogs = {
      dialogTask: taskDialog,
      dialogsData: dialogsData,
      setDialogsData: setDialogsData
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
| { type: 'boardAdd',      name: string }
| { type: 'boardEdit',     index: number, name: string }
| { type: 'boardDelete',   index: number }
| { type: 'columnAdd',     name: string }
| { type: 'columnEdit',    index: number, name: string }
| { type: 'columnDelete',  index: number }
| { type: 'taskAdd',       name: string }
| { type: 'taskEdit',      index: number, name: string }
| { type: 'taskDelete',    index: number }
| { type: 'subtaskAdd',    name: string }
| { type: 'subtaskEdit',   index: number, name: string }
| { type: 'subtaskDelete', index: number }

function dataReducer(state: typeData, action: typeAction): typeData {
  
  switch (action.type) {

    case 'boardAdd' : {
      return state
    }

    default:
      return state
  }
}