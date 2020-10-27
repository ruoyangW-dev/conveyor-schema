export type BasicObject = Record<string, boolean | number | string>

/** simple type such as string, int, or date */
export type BasicFieldType = 'string' | 'float' | 'int' | 'boolean'

/** When type is an object is provides the type of a more complicated type such as relationship or enum */
export interface FieldTypeObject {
  /** name of relationship on the targets side */
  backref: string

  /** List of fields on the target model to display when displaying a table on the detail page */
  tableFields: string[]

  /** modelName of the target of the relationship */
  target: string

  /** Database type */
  type: 'OneToOne' | 'OneToMany' | 'ManyToOne' | 'ManyToMany'
}

export interface Field {
  /** Dict of choice values to their labels */
  choices?: Record<string, string>

  /** Order of 'choices' appearing in Enum field */
  choiceOrder?: string[]

  components?: any

  /** Whether the given field should be editable */
  editable?: boolean

  /** Whether the given field should be filterable on tables */
  filterable?: boolean

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

  /** Whether the given field should be displayed on the create page */
  showCreate?: boolean

  /** Whether the given field should be displayed on the detail page */
  showDetail?: boolean

  /** Whether the given field should be displayed on the index page */
  showIndex?: boolean

  /** Whether the given field should be displayed on the tooltip */
  showTooltip?: boolean

  /** Whether the given field should be sortable on tables */
  sortable?: boolean

  type: BasicFieldType | FieldTypeObject
}

export type Fields = Record<
  string,
  {
    /** Determines whether or not a field should display in the attribute or table section of a detail page */
    detailAttribute?: boolean

    /** Provides how the field should be displayed or function that calculates displayName */
    displayName: string | (() => string)

    components?: Record<string, string>

    /** Name of the field, used as the key in fields dictionary */
    fieldName: string

    type: FieldType
  }
>

export interface Schema {
  actions?: any

  components?: Record<string, any>

  /** List or a function that returns a list of the order that the create fields display */
  createFieldOrder?: string[] | (() => string[])

  /** List or a function that returns a list of the order that the detail fields display */
  detailFieldOrder?: string[] | (() => string[])

  /** name of field that holds the data used to represent the instance when it is being displayed or referenced, defaults to "name" if left undefined, can also be a function that determines the value for any instance of the model */
  displayField?: string | (() => string)

  /** Singular display name of model or function that calculates displayName, used on detail page */
  displayName?: string | (() => string)

  /** Plural display name of Model or function that calculates displayNamePlural, used on index page */
  displayNamePlural?: string | (() => string)

  fields: Fields

  /** List of ALL fields on a model in the order that they should be displayed on its own Detail and Index pages, also serves as a fall back if a different model is displaying this model without having specified the order in which the fields should be displayed. */
  fieldOrder?: string[]

  /** Whether the model should be included in an index page */
  hasIndex?: boolean

  /** List or a function that returns a list of the order that the index fields display */
  indexFieldOrder?: string[] | (() => string[])

  /** Name of model */
  modelName: string

  /** Name of gqlquery that will return all instances of the model */
  queryAllName?: string

  /** Name of gql query that will return a single instance of the model */
  queryName?: string

  /** List of fields that must be present on the query */
  queryRequired?: string

  /** name of the field/column in a table that links to the detail page, a value of null means no link to the model should be displayed on a table */
  tableLinkField?: null | string

  tabs?: any
}

export type SchemaJSON = Record<string, Schema>
