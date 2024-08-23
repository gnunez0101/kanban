import { useContext } from "react"
import { ContextDatabase } from '../components/Store'

export default function useDatabase() {
  const dbContext = useContext(ContextDatabase)
  if (!dbContext) { throw new Error("useDatabase must be used within ContextDatabase") }
  return dbContext
}