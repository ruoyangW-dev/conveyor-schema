import * as StringHelpers from '../src/stringHelper'

describe('stringHelper', () => {
  describe('capitalizeFirstChar', () => {
    it('should capitalize the first letter', () => {
      expect(StringHelpers.capitalizeFirstChar('hello')).toEqual('Hello')
    })
  })
  describe('spaceOnCapitalLetter', () => {
    it('should create a space when it hits a capital letter', () => {
      expect(StringHelpers.spaceOnCapitalLetter('helloWorld')).toEqual(
        'hello World'
      )
    })
  })
  describe('underscoreToSpace', () => {
    it('should create a space when it hits a _', () => {
      expect(StringHelpers.underscoreToSpace('hello_world')).toEqual(
        'hello world'
      )
    })
  })
  describe('trimWhiteSpaceBetweenWords', () => {
    it('should trim the white space between words', () => {
      expect(StringHelpers.trimWhitespaceBetweenWords('hello   world')).toEqual(
        'hello world'
      )
    })
  })
  describe('humanize', () => {
    it('should capitalize first letter, add a space for camel/underscore casing and trim white space', () => {
      expect(StringHelpers.humanize('helloWorld_I_am   bob')).toEqual(
        'Hello World I am bob'
      )
    })
  })
  describe('titleize', () => {
    it('should uppercase each word', () => {
      expect(StringHelpers.titleize('hello world')).toEqual('Hello World')
    })
  })
})
