import { ContextDialogs } from '../components/Store'
import { useContext } from "react"

export default function useDialogs() {
  const dialogContext = useContext(ContextDialogs)
  if (!dialogContext) { throw new Error("useDialogs must be used within ContextDialogs") }
  return dialogContext
}