type typeDropIndicator = {
  beforeId: number | null,
  column: number
}

export function DropIndicator( { beforeId, column }: typeDropIndicator ) {

  return (
    <div className='drop-indicator'
      // data-before = { beforeId !== null ? beforeId : "-1"}
      data-before = { beforeId }
      data-column = { column }
    />
  )
}
