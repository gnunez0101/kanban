type typeDropIndicator = {
  beforeId: number | null,
  column: number
}

export function DropIndicator( { beforeId, column }: typeDropIndicator ) {

  return (
    <div className='drop-indicator'
      data-before = { beforeId }
      data-column = { column }
    />
  )
}
