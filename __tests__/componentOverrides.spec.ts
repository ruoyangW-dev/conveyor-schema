import { _getFieldOverride, _getModelOverride } from '../src/componentOverrides'
import { mockSchema } from './mocks'

describe('componentOverrides', () => {
  describe('_getFieldOverride', () => {
    it('should return component value when exists.', () => {
      expect(
        // eslint-disable-next-line
        _getFieldOverride(mockSchema, 'foo', 'bar', 'cell')!().props
      ).toEqual({ children: '2' })
    })
  })
  describe('_getModelOverride', () => {
    it('should return model override value when exist.', () => {
      // eslint-disable-next-line
      expect(_getModelOverride(mockSchema, 'foo', 'detail')!().props).toEqual({
        children: '5'
      })
    })
  })
})
