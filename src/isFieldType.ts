import * as R from 'ramda'
import { inputTypes } from './inputTypes'

// object types

export const _isOneToMany = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type', 'type'], schemaJSON) === inputTypes.ONE_TO_MANY_TYPE
}

export const _isManyToMany = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type', 'type'], schemaJSON) === inputTypes.MANY_TO_MANY_TYPE
}

export const _isManyToOne = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type', 'type'], schemaJSON) === inputTypes.MANY_TO_ONE_TYPE
}

export const _isOneToOne = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type', 'type'], schemaJSON) === inputTypes.ONE_TO_ONE_TYPE
}

export const _isRel = (schemaJSON: any, modelName: string, fieldName: string) => {
  return typeof (R.path([modelName, 'fields', fieldName, 'type'], schemaJSON)) === 'object'
}

// string types

export const _isEnum = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'enum'
}
export const _isURL = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'url'
}
export const _isEmail = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'email'
}
export const _isPhone = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'phone'
}
export const _isCurrency = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'currency'
}
export const _isDate = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'date'
}
export const _isTextArea = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'text'
}
export const _isFile = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'file'
}
export const _isBoolean = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'boolean'
}
export const _isPassword = (schemaJSON: any, modelName: string, fieldName: string) => {
  return R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) === 'password'
}
