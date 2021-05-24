import { SchemaBuilder } from './schemaBuilder'
import { NodeType } from './schemaBuilder'

export type BasicObject = Record<string, boolean | number | string>

export interface CallbackProps {
  schema: SchemaBuilder
  modelName: string
  fieldName: string
  customProps?: Record<string, unknown>
}

/** simple type such as string, int, or date */
export type BasicFieldType =
  | 'string'
  | 'float'
  | 'int'
  | 'boolean'
  | 'password'
  | 'url'
  | 'date'
  | 'file'
  | 'text'
  | 'currency'
  | 'phone'
  | 'email'
  | 'enum'

export type RelFieldType = 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany'

/** When type is an object is provides the type of a more complicated type such as relationship or enum */
export interface FieldTypeObject {
  /** name of relationship on the targets side */
  backref?: string

  /** List of fields on the target model to display when displaying a table on the detail page */
  tableFields?: string[]

  /** modelName of the target of the relationship */
  target?: string

  /** Database type */
  type: RelFieldType
}

export const isFieldTypeObject = (
  fieldType: BasicFieldType | FieldTypeObject | undefined
): fieldType is FieldTypeObject => {
  return typeof fieldType === 'object'
}

export type DisplayCondition =
  | boolean
  | ((props: CallbackProps & { node?: NodeType }) => boolean)

export interface DisplayConditions {
  index?: DisplayCondition
  create?: DisplayCondition
  detail?: DisplayCondition
}

export interface FieldComponents {
  cell?: () => JSX.Element
  detail?: () => JSX.Element
  detailLabel?: () => JSX.Element
  detailValue?: () => JSX.Element
  input?: () => JSX.Element
  labelInfo?: () => JSX.Element
}

export interface Field {
  /** Dict of choice values to their labels */
  choices?: Record<string, string>

  /** Order of 'choices' appearing in Enum field */
  choiceOrder?: string[]

  components?: FieldComponents

  /** Determines whether or not a field should display in the attribute or table section of a detail page */
  detailAttribute?: boolean

  /** Whether field should be disabled or not */
  disabled?:
    | boolean
    | ((props?: CallbackProps & { defaultDisable?: boolean }) => boolean)

  /**
   * Function which conditionally disables options in the select dropdown. Works for relationships (single & multi) & enums.
   *
   * ```javascript
   * const foo = ({ schema, modelName, fieldName, options, value }) => {
   *   // add 'disabled' = True to option obj (so it shows up but can't be chosen)
   *   options = R.map(obj => R.assoc('disabled', true, obj), options)
   *
   *   // or filter out options (these don't show up)
   *   options = R.filter(obj => obj.value === 'some_value', options)
   *
   *   return options
   * }
   * // add to schema
   * schema = {
   *   <modelName>: {
   *     fields: {
   *       <fieldName>: {
   *         disabledDropDown: foo
   *       }
   *     }
   *   }
   * }
   * ```
   */
  disabledDropDown?: (
    props: CallbackProps & {
      options?: Array<{ label: string; value: unknown }>
      value?: { disabled: boolean; label: string; value: unknown }
    }
  ) => boolean

  displayConditions?: DisplayConditions

  /** Provides how the field should be displayed or function that calculates displayName */
  displayName:
    | string
    | ((
        props: CallbackProps & {
          data?: NodeType[]
          node?: NodeType
          defaultValue: string
        }
      ) => string)

  /** Whether the given field should be editable */
  editable?:
    | boolean
    | ((
        props: CallbackProps & { node?: NodeType; parentNode?: NodeType }
      ) => boolean)

  /** Text to display under the field when it is being edited */
  fieldHelp?: string

  /** Name of the field, used as the key in fields dictionary */
  fieldName: string

  /** Whether the given field should be filterable on tables */
  filterable?:
    | boolean
    | ((props: CallbackProps & { data?: NodeType[] }) => boolean)

  /** if table component can be hidden, have 'hide' button */
  hideable?: boolean

  /** Value to display when a field has no data */
  noDataDisplayValue?:
    | string
    | ((props?: CallbackProps & { node?: NodeType }) => string)

  /** Whether should be queried while fetching detail page; by default
   * the query will look at 'showDetail' prop but, if showDetail is
   * false and queryDetail is true, will still query the field; used
   * if you wish to have a field be available but NOT displaying for
   * detail */
  queryDetail?: boolean

  /** Whether should be queried while fetching index page; by default
   * the query will look at 'showIndex' prop but, if showIndex is
   * false and queryIndex is true, will still query the field; used
   * if you wish to have a field be available but NOT displaying for
   * index */
  queryIndex?: boolean

  /** Whether to prevent the field from being queried so that no backend
   *  resolver is created */
  virtualField?: boolean

  /** Whether the given field should be displayed on the create page */
  showCreate?: boolean | (() => boolean)

  /** Whether the given field should be displayed on the detail page */
  showDetail?: boolean | (() => boolean)

  /** Whether the given field should be displayed on the index page */
  showIndex?: boolean | (() => boolean)

  /** Whether the given field should be displayed on the tooltip */
  showTooltip?: boolean | (() => boolean)

  /** Whether the given field should be sortable on tables */
  sortable?: boolean | ((props: CallbackProps) => boolean)

  type: BasicFieldType | FieldTypeObject

  collapsable?: boolean

  [key: string]: unknown
}

export type Fields = Record<
  string,
  Field
  // {
  //   /** Determines whether or not a field should display in the attribute or table section of a detail page */
  //   detailAttribute?: boolean

  //   /** Provides how the field should be displayed or function that calculates displayName */
  //   displayName: string | (() => string)

  //   components?: Record<string, string>

  //   /** Name of the field, used as the key in fields dictionary */
  //   fieldName: string

  //   type: FieldType
  // }
>

export interface SchemaComponents {
  cell?: () => JSX.Element
  create?: () => JSX.Element
  createPage?: () => JSX.Element
  createTitle?: () => JSX.Element
  detail?: () => JSX.Element
  detailLabel?: () => JSX.Element
  detailPage?: () => JSX.Element
  detailTitle?: () => JSX.Element
  detailValue?: () => JSX.Element
  index?: () => JSX.Element
  indexPage?: () => JSX.Element
  indexTitle?: () => JSX.Element
  input?: () => JSX.Element
  labelInfo?: () => JSX.Element
}

export interface Schema {
  actions?: {
    create?: any
    edit?: any
    delete?: any
    list?: any
    detail?: any
  }

  components?: SchemaComponents

  /** Whether the given field should be creatable */
  creatable?:
    | boolean
    | ((
        props: Omit<CallbackProps, 'fieldName'> & {
          parentNode?: NodeType
          data?: NodeType[]
        }
      ) => boolean)

  /** List or a function that returns a list of the order that the create fields display */
  createFieldOrder?:
    | string[]
    | ((
        props: Omit<CallbackProps, 'fieldName'> & { defaultOrder?: string[] }
      ) => string[])

  /** Whether the given field should be deletable */
  deletable?:
    | boolean
    | ((
        props: Omit<CallbackProps, 'fieldName'> & {
          node?: NodeType
          parentNode?: NodeType
        }
      ) => boolean)

  /** List or a function that returns a list of the order that the detail fields display */
  detailFieldOrder?:
    | string[]
    | ((
        props: Omit<CallbackProps, 'fieldName'> & {
          node?: NodeType
          defaultOrder?: string[]
        }
      ) => string[])

  /** name of field that holds the data used to represent the instance when it is being displayed or referenced, defaults to "name" if left undefined, can also be a function that determines the value for any instance of the model */
  displayField?:
    | string
    | ((
        props: Omit<CallbackProps, 'fieldName'> & { node?: NodeType }
      ) => string)

  /** Singular display name of model or function that calculates displayName, used on detail page */
  displayName?:
    | string
    | ((
        props: Omit<CallbackProps, 'fieldName'> & {
          node?: NodeType
          data?: NodeType[]
          defaultValue: string
        }
      ) => string)

  /** Plural display name of Model or function that calculates displayNamePlural, used on index page */
  displayNamePlural?:
    | string
    | ((
        props: Omit<CallbackProps, 'fieldName'> & {
          data?: NodeType[]
          defaultValue: string
        }
      ) => string)

  fields: Fields

  /** List of ALL fields on a model in the order that they should be displayed on its own Detail and Index pages, also serves as a fall back if a different model is displaying this model without having specified the order in which the fields should be displayed. */
  fieldOrder?: string[]

  /** Whether the given table should be filterable (can be set on field lvl as well) */
  filterable?:
    | boolean
    | ((
        props: Omit<CallbackProps, 'fieldName'> & { data?: NodeType[] }
      ) => boolean)

  hasDetail?: boolean

  /** Whether the model should be included in an index page */
  hasIndex?: boolean

  /** List or a function that returns a list of the order that the index fields display */
  indexFieldOrder?:
    | string[]
    | ((
        props: Omit<CallbackProps, 'fieldName'> & {
          data?: NodeType[]
          defaultOrder?: string[]
        }
      ) => string[])

  /** Name of model */
  modelName: string

  /** Name of gqlquery that will return all instances of the model */
  queryAllName?: string

  /** Name of gql query that will return a single instance of the model */
  queryName?: string

  /** List of fields that must be present on the query */
  queryRequired?: string[]

  /** Whether this model is singleton (display one instance only) */
  singleton?: boolean

  /** Whether the given table should be sortable (can be set on field lvl as well) */
  sortable?: boolean | ((props: Omit<CallbackProps, 'fieldName'>) => boolean)

  /** name of the field/column in a table that links to the detail page, a value of null means no link to the model should be displayed on a table */
  tableLinkField?: null | string

  /** Whether the given model should be displayed on the delete modal */
  showDeleteModal?: boolean | (() => boolean)

  tabs?: any[]

  tooltipFieldOrder?:
    | string[]
    | ((
        props: Omit<CallbackProps, 'fieldName'> & { defaultOrder?: string[] }
      ) => string[])

  searchable?: boolean

  [key: string]: unknown
}

export type SchemaJSON = Record<string, Schema>
