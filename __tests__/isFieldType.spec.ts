import * as FieldType from '../src/isFieldType'
import * as R from 'ramda'
import { mockSchema } from './mocks'

describe('isFieldType', () => {
  describe('_isOneToMany', () => {
    it('should return true when is one to many', () => {
      expect(
        FieldType._isOneToMany(mockSchema, 'foo', 'oneToMany')
      ).toBeTruthy()
    })
    it('should return false when is not one to many', () => {
      const sch = R.assocPath(
        ['foo', 'fields', 'oneToMany', 'type', 'type'],
        'false',
        mockSchema
      )
      expect(FieldType._isOneToMany(sch, 'foo', 'oneToMany')).toBeFalsy()
    })
  })
  describe('_isManyToMany', () => {
    it('should return true when is many to many', () => {
      expect(
        FieldType._isManyToMany(mockSchema, 'foo', 'manyToMany')
      ).toBeTruthy()
    })
    it('should return false when is not many to many', () => {
      const sch = R.assocPath(
        ['foo', 'fields', 'manyToMany', 'type', 'type'],
        'false',
        mockSchema
      )
      expect(FieldType._isManyToMany(sch, 'foo', 'manyToMany')).toBeFalsy()
    })
  })
  describe('_isManyToOne', () => {
    it('should return true when is many to one', () => {
      expect(
        FieldType._isManyToOne(mockSchema, 'foo', 'manyToOne')
      ).toBeTruthy()
    })
    it('should return false when is not many to one', () => {
      const sch = R.assocPath(
        ['foo', 'fields', 'manyToOne', 'type', 'type'],
        'false',
        mockSchema
      )
      expect(FieldType._isManyToOne(sch, 'foo', 'manyToOne')).toBeFalsy()
    })
  })
  describe('_isOneToOne', () => {
    it('should return true when is one to one', () => {
      expect(FieldType._isOneToOne(mockSchema, 'foo', 'oneToOne')).toBeTruthy()
    })
    it('should return false when is not one to one', () => {
      const sch = R.assocPath(
        ['foo', 'fields', 'oneToOne', 'type', 'type'],
        'false',
        mockSchema
      )
      expect(FieldType._isOneToOne(sch, 'foo', 'oneToOne')).toBeFalsy()
    })
  })
  describe('_isRel', () => {
    it('should return true when type is object', () => {
      expect(FieldType._isRel(mockSchema, 'foo', 'manyToOne')).toBeTruthy()
    })
    it('should return false when type is not object', () => {
      expect(FieldType._isRel(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isEnum', () => {
    it('should return true when type is enum', () => {
      expect(FieldType._isEnum(mockSchema, 'foo', 'enum')).toBeTruthy()
    })
    it('should return false when type is not enum', () => {
      expect(FieldType._isEnum(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isUrl', () => {
    it('should return true when type is url', () => {
      expect(FieldType._isURL(mockSchema, 'foo', 'url')).toBeTruthy()
    })
    it('should return fals ewhen type is not url', () => {
      expect(FieldType._isURL(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isEmail', () => {
    it('should return true if type is email', () => {
      expect(FieldType._isEmail(mockSchema, 'foo', 'email')).toBeTruthy()
    })
    it('should return false if type is not email', () => {
      expect(FieldType._isEmail(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isPhone', () => {
    it('should return true if type is phone', () => {
      expect(FieldType._isPhone(mockSchema, 'foo', 'phone')).toBeTruthy()
    })
    it('should return false if type is not phone', () => {
      expect(FieldType._isPhone(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isCurrency', () => {
    it('should return true when type is currency', () => {
      expect(FieldType._isCurrency(mockSchema, 'foo', 'currency')).toBeTruthy()
    })
    it('should return false if type is not currency', () => {
      expect(FieldType._isCurrency(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isDate', () => {
    it('should return true when type is date', () => {
      expect(FieldType._isDate(mockSchema, 'foo', 'date')).toBeTruthy()
    })
    it('should return false when type is not date', () => {
      expect(FieldType._isDate(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isTextarea', () => {
    it('should return true when type is text', () => {
      expect(FieldType._isTextArea(mockSchema, 'foo', 'text')).toBeTruthy()
    })
    it('should return false when type not text', () => {
      expect(FieldType._isTextArea(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isFile', () => {
    it('should return true when type is text', () => {
      expect(FieldType._isFile(mockSchema, 'foo', 'file')).toBeTruthy()
    })
    it('should return false when type is not text', () => {
      expect(FieldType._isFile(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isBoolean', () => {
    it('should return true when type is boolean', () => {
      expect(FieldType._isBoolean(mockSchema, 'foo', 'boolean')).toBeTruthy()
    })
    it('should return false when type is not boolean', () => {
      expect(FieldType._isBoolean(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
  describe('_isPassword', () => {
    it('should return true when type is password', () => {
      expect(FieldType._isPassword(mockSchema, 'foo', 'password')).toBeTruthy()
    })
    it('should return false when type is not password', () => {
      expect(FieldType._isPassword(mockSchema, 'foo', 'bar')).toBeFalsy()
    })
  })
})
