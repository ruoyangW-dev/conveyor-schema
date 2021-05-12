import * as R from 'ramda'
import pluralize from 'pluralize'

export const capitalizeFirstChar = (str: string): string =>
  str.replace(/^./, (str) => str.toUpperCase())

export const spaceOnCapitalLetter = (str: string): string =>
  str.replace(/([A-Z])/g, ' $1')

export const underscoreToSpace = (str: string): string => str.replace(/_/g, ' ')

export const trimWhitespaceBetweenWords = (str: string): string =>
  str.replace(/\s\s+/g, ' ')

export const humanize = (str: string): string =>
  R.pipe(
    spaceOnCapitalLetter,
    capitalizeFirstChar,
    underscoreToSpace,
    trimWhitespaceBetweenWords,
    R.trim
  )(str)

export const titleize = (title: string): string => {
  let strArr = title.split(' ')
  strArr = strArr.map((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })
  return strArr.join(' ')
}

// used in getFieldLabel
export const humanizeField = (modelName: string): string => humanize(modelName)

// used in getModelLabel
export const humanizeModel = (modelName: string): string =>
  titleize(humanize(modelName))

// used in getModelLabelPlural
export const humanizeModelPlural = (modelName: string): string =>
  pluralize(titleize(humanize(modelName)))
