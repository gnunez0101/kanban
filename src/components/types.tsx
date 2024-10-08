// ==================== TYPES FOR TYPESCRIPT ====================

type typeData = { boards: typeBoard[] }

type typeValueData = {
  database:     typeData,
  dispatch:     React.Dispatch<typeAction>,
  taskCounter:  number,
  setTaskCounter: any
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
  columns: typeColumn[]
}

type typeColumn = {
  name: string,
  tasks: typeTask[]
}

type typeSelectColumns = {
  value: string,
  label: string
}

type typeTask = {
  id?: string,
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
  coord?:  typeCoords,
  values?: typeBoard
}

type typeColumnAction = {
  type:   'column_Add'|'column_Modify'|'column_Delete',
  coord:  typeCoords,
  values: typeColumn
}

type typeTaskAction = {
  type: 'task_Add'|'task_Modify',
  coord: typeCoords,
  values: typeTask
}

type typeTaskActionMoveCol = {
  type: 'task_MoveColumn'
  coord: typeCoords,
  dest: number
}

type typeTaskActionMove = {
  type: 'task_Move'
  from: typeCoords,
  to:   typeCoords
}

type typeTaskActionDelete = {
  type: 'task_Delete',
  coord: typeCoords
}

type typeSubTaskAction = {
  type: 'subtask_Add'|'subtask_Modify'|'subtask_Delete',
  coord: typeCoords,
  values: typeSubTask
}

type typeAction = 
  | typeBoardAction 
  | typeColumnAction 
  | typeTaskAction | typeTaskActionMoveCol | typeTaskActionMove | typeTaskActionDelete
  | typeSubTaskAction
