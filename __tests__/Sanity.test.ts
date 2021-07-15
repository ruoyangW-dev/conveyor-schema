import { schema } from './mocks'

describe('basic sanity test', () => {
  it('schema.DefaultsTest.modelName', () => {
    expect(
      schema.getModelLabel({
        modelName: 'DefaultsTest'
      })
    ).toBe('Defaults Test')
  })
})
