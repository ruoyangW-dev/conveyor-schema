export interface FormStack {
  // lsit with entries that populate the stack
  stack: any[]

  // current index of the stack, -1 when the stack is empty
  index: number

  // path of location to return to once stack is empty
  originPath: string
}
