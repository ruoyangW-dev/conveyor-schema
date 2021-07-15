import React from 'react'
import { schema } from './mocks'
/**
import {
  getIndexOverride,
  getIndexPageOverride,
  getIndexTitleOverride,
  getCreateOverride,
  getCreatePageOverride,
  getCreateTitleOverride,
  getDetailOverride,
  getDetailPageOverride,
  getDetailTitleOverride
} from '../src/Utils'
**/
// Tests
describe('getIndexOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getIndexOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getIndexOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Index</h1>)
  })
})

describe('getIndexPageOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getIndexPageOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getIndexPageOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Index Page</h1>)
  })
})

describe('getIndexTitleOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getIndexTitleOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getIndexTitleOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Index Title</h1>)
  })
})

describe('getCreateOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getCreateOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getCreateOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Create</h1>)
  })
})

describe('getCreatePageOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getCreatePageOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getCreatePageOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Create Page</h1>)
  })
})

describe('getCreateTitleOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getCreateTitleOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getCreateTitleOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Create Title</h1>)
  })
})

describe('getDetailOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getDetailOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getDetailOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Detail</h1>)
  })
})

describe('getDetailPageOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getDetailPageOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getDetailPageOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Detail Page</h1>)
  })
})

describe('getDetailTitleOverride function', () => {
  it('Return UNDEFINED w/o override defined', () => {
    expect(schema.getDetailTitleOverride('NoModelOverride')).toBe(undefined)
  })
  it('Return override w/ override defined', () => {
    expect(
      (schema.getDetailTitleOverride('ModelOverride') as CallableFunction)()
    ).toStrictEqual(<h1>Custom Detail Title</h1>)
  })
})
