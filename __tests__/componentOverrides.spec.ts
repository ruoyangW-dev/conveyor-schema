import { _getFieldOverride, _getModelOverride } from '../src/componentOverrides'
import { mockSchema } from './mocks'

describe('componentOverrides', () => {
  describe('_getFieldOverride', () => {
    it('should return component value when exists.', () => {
      expect(_getFieldOverride(mockSchema, 'foo', 'bar', 'cell')!()).toEqual(2) // eslint-disable-line
    })
  })
  describe('_getModelOverride', () => {
    it('should return model override value when exist.', () => {
      expect(_getModelOverride(mockSchema, 'foo', 'detail')!()).toEqual(5) // eslint-disable-line
    })
  })
})
