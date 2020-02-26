import * as R from 'ramda'
import pluralize from 'pluralize'


const capitalizeFirstChar = (str: string) => str.replace(/^./, str => str.toUpperCase())

const spaceOnCapitalLetter = (str: string) => str.replace(/([A-Z])/g, ' $1')

const underscoreToSpace = (str: string) => str.replace(/_/g, ' ')

const trimWhitespaceBetweenWords = (str: string) => str.replace(/\s\s+/g, ' ')

const humanize = (str: string) =>
  R.pipe(spaceOnCapitalLetter, capitalizeFirstChar, underscoreToSpace, trimWhitespaceBetweenWords, R.trim)(str)

const titleize = (title: string) => {
  let strArr = title.split(' ')
  strArr = strArr.map(str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  })
  return strArr.join(' ')
}

// used in getFieldLabel
export const humanizeField = (modelName: string) => humanize(modelName)

// used in getModelLabel
export const humanizeModel = (modelName: string) => titleize(humanize(modelName))

// used in getModelLabelPlural
export const humanizeModelPlural = (modelName: string) => pluralize(titleize(humanize(modelName)))