import { _getFieldOverride, _getModelOverride } from '../src/componentOverrides'
import { mockSchema } from './mocks'

describe('componentOverrides', () => {
  describe('_getFieldOverride', () => {
    it('should return component value when exists.', () => {
      expect(_getFieldOverride(mockSchema, 'foo', 'bar', 'baz')).toEqual('bleh')
    })
  })
  describe('_getModelOverride', () => {
    it('should return model override value when exist.', () => {
      expect(_getModelOverride(mockSchema, 'foo', 'bar')).toEqual(
        'modeloverride'
      )
    })
  })
})
