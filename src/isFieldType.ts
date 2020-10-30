import * as R from 'ramda'
import { inputTypes } from './inputTypes'
import { SchemaJSON } from './schemaJson'

// object types

export const _isOneToMany = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type', 'type'], schemaJSON) ===
  inputTypes.ONE_TO_MANY_TYPE

export const _isManyToMany = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type', 'type'], schemaJSON) ===
  inputTypes.MANY_TO_MANY_TYPE

export const _isManyToOne = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type', 'type'], schemaJSON) ===
  inputTypes.MANY_TO_ONE_TYPE

export const _isOneToOne = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type', 'type'], schemaJSON) ===
  inputTypes.ONE_TO_ONE_TYPE

export const _isRel = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  typeof R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  'object'

// string types

export const _isString = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  schemaJSON[modelName].fields[fieldName].type === inputTypes.STRING_TYPE

export const _isEnum = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.ENUM_TYPE

export const _isURL = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.URL_TYPE

export const _isEmail = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.EMAIL_TYPE

export const _isPhone = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.PHONE_TYPE

export const _isCurrency = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.CURRENCY_TYPE

export const _isDate = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.DATE_TYPE

export const _isTextArea = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.TEXTAREA_TYPE

export const _isFile = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.FILE_TYPE

export const _isBoolean = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.BOOLEAN_TYPE

export const _isPassword = (
  schemaJSON: SchemaJSON,
  modelName: string,
  fieldName: string
): boolean =>
  R.path([modelName, 'fields', fieldName, 'type'], schemaJSON) ===
  inputTypes.PASSWORD_TYPE
