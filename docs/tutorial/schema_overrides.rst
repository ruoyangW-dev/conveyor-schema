.. _tutorial/schema_overrides:


***********************
Schema Overrides
***********************


disabledDropDown
------------------

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