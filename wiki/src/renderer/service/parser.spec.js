const { parse } = require('./parser')

describe('Parser', () => {
  describe('With empty input', () =>
    it('Produces an empty parsed object', () =>
      expect(parse([])).toEqual({ data: '', info: [] })))
  describe('Adding data', () => {
    it('Adds plain data', () =>
      expect(parse(['data', 'more data'])).toEqual({
        data: 'data\nmore data',
        info: []
      }))
    it('Ignores info tags', () =>
      expect(parse(['@i[data][more data]', 'more data'])).toEqual({
        data: 'more data',
        info: [{ name: 'data', data: ['more data'] }]
      }))
  })
})
