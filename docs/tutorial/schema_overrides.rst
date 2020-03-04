.. _tutorial/schema_overrides:


***********************
Schema Overrides
***********************

Callback Getters
------------------

The following methods are callback getters, meaning that they can potentially be associated with a callback like so:

 .. code-block:: javascript

    // the following 'creatable' prop is in this part of the schema:
    schema = { <modelName>: {
        creatable: creatable
    }}

    // the following is example of callback function you would put into the schema under the 'creatable' prop:
    const creatable = ({ schema, modelName, parentNode, data, customProps }) => {
      // do your own logic to figure out if this model is 'creatable' based on the props coming in
      return true
    }

    // if you want to see if a model is creatable, pass in props you need to figure out the logic.
    // this will call upon the 'creatable' function above
    const isCreatable = schema.isCreatable({ modelName: 'Book' , parentNode, data, customProps })

'schema.isCreatable' will check the 'creatable' prop in the schema, evaluate if its a function or boolean, and return the correct value



**Other callbacks and their props include:**

  schema.isTableEditable({ modelName, data, parentNode, fieldOrder, customProps })

    *'editable' for every object in the 'data' prop => calls isRowEditable*

  schema.isRowEditable({ modelName, node, parentNode, fieldOrder, customProps })

    *'editable' for every object in the 'node' prop => calls isFieldEditable*

  schema.isFieldEditable({ modelName, fieldName, node, parentNode, customProps })

    *'editable' on field level*

  schema.isTableDeletable({ modelName, data, parentNode, customProps })

    *'deletable' for every object in 'data' prop => calls isDeletable*

  schema.isDeletable({ modelName, node, parentNode, customProps })

    *'deletable' on model level*

  schema.isCreatable({ modelName, parentNode, data, customProps })

    *'creatable' on model level*

  schema.shouldDisplay ({ modelName, fieldName, node, displayCondition, customProps })

    *applies displayCondition function for given field*

  schema.shouldDisplayIndex({ modelName, fieldName, node, customProps })

    *applies 'displayConditions.index' for given field*

  schema.shouldDisplayDetail({ modelName, fieldName, node, customProps })

    *applies 'displayConditions.detail' for given field*

  schema.shouldDisplayCreate({ modelName, fieldName, node, customProps })

    *applies 'displayConditions.create' for given field*

  schema.isFieldDisabled({ modelName, fieldName, formStack, customProps })

    *checks 'disabled' on field level OR checks formStack for 'disabled' flag on field*

  schema.isSortable({ modelName, fieldName, customProps })

    *'sortable' on field level => does NOT check 'sortable' on model level, must call isTableSortable as well for full coverage*

  schema.isTableSortable({ modelName, customProps })

    *'sortable' on model level => also calls isSortable for every fieldName in models' 'fieldOrder'*

  schema.isFilterable({ modelName, fieldName, data, customProps })

    *'filterable' on field level => does NOT check 'filterable' on model level, must call isTableFilterable as well for full coverage*

  schema.isTableFilterable({ modelName, data, customProps })

    *'filterable' on model level => also calls isFilterable for every fieldName listed in model's 'fieldOrder'*

  schema.getShownFields({ modelName, type, node, data, customProps })

    *called by getDetailFields, getIndexFields, and getCreateFields internally*

  schema.getDetailFields({ modelName, node, customProps })

    *'detailFieldOrder' on model level OR fetches all fields with 'showDetail' boolean true OR 'showDetail' function evaluate to true*

  schema.getIndexFields({ modelName, data, customProps })

    *'indexFieldOrder' on model level OR fetches all fields with 'showIndex' boolean true OR 'showIndex' function evaluate to true*

  schema.getCreateFields({ modelName, customProps })

    *'createFieldOrder' on model level OR fetches all fields with 'showCreate' boolean true OR 'showCreate' function evaluate to true*

  schema.getTooltipFields({ modelName, customProps })

    *'tooltipFieldOrder' on model level OR fetches all fields with 'showTooltip' boolean true OR 'showTooltip' function evaluate to true*

  schema.getOptionsOverride({ modelName, fieldName, options, value, customProps })

    *applies 'disabledDropDown' on field level*


**Common Props**

modelName => string

fieldName => string

data => list of nodes

node => database object that is to be displayed. must contain '__typename' prop to indicate modelName: {__typename: 'Book', ...props}

parentNode => node of parent object whose page the child 'node' is on

fieldOrder => list of strings (fieldNames on a table, tooltip, ect)

customProps => anything you want, usually a dictionary


**Uncommon Props**

displayCondition => function indicating if a given field should display

formStack => conveyor-redux's formStack object, holding the 'create' form data

options => list of values with format {label: 'foo', value: 'bar'}

value => current value selected in the dropdown



Recipes
-----------


**disabledDropDown**

Conditionally disable options in the select dropdown. Works for relationships (single & multi) & enums


 .. code-block:: javascript

    const foo = ({ schema, modelName, fieldName, options, value }) => {
      // add 'disabled' = True to option obj (so it shows up but can't be chosen)
      options = R.map(obj => R.assoc('disabled', true, obj), options)

      // or filter out options (these don't show up)
      options = R.filter(obj => obj.value === 'some_value', options)

      return options
    }
    // add to schema
    schema = { <modelName>: { fields: { <fieldName>: {
        disabledDropDown: foo
    }}}}