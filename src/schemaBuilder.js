export class SchemaBuilder {
  constructor({ json, defaults, warnings_on= true }) {
    this.json = json
    this.defaults = defaults
    this.warnings_on = warnings_on
  }
}