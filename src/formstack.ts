import { NodeType } from './schemaBuilder'

export interface FormStack {
  // list with entries that populate the stack
  stack: FormStackEntry[]

  // current index of the stack, -1 when the stack is empty
  index: number

  // path of location to return to once stack is empty
  originPath: string

  originModelName?: string
  originFieldName?: string
  originNode?: NodeType
}

interface FormStackEntry {
  modelName: string
  fields: Record<string, unknown>
}
