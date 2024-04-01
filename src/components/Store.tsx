import React, { useReducer } from "react";
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

export const ContextDatabase = React.createContext<typeData>(data);
export const ContextDialogs  = React.createContext<any | null>(null);


type StoreProps = { children: React.ReactNode }

export const StoreProvider = ( props: StoreProps ) => {
    // const [ setDialog ]       = useState<any>(null);
    const [database, dispatch] = useReducer(dataReducer, data);

    function boardAdmin(command: string, coord: []) {
      
    }

    function columnAdmin(command: string, coord: []) {
      
    }

    function taskAdmin(command: string, coord: []) {

    }

    function subtaskAdmin(command: string, coord: []) {

    }

    return (
        <ContextDatabase.Provider value = { database }>
        <ContextDialogs.Provider  value = { setDialog }>
          { props.children }
        </ContextDialogs.Provider>
        </ContextDatabase.Provider>
    );
};


type typeAction =  
| { type: 'boardAdd', name: string }
| { type: 'boardEdit', index: number, name: string }
| { type: 'boardDelete', index: number }
| { type: 'columnAdd', name: string }
| { type: 'columnEdit', index: number, name: string }
| { type: 'columnDelete', index: number }

function dataReducer(state: typeData, action: typeAction) {
  
  return state
}

function setDialog ( ) {

}