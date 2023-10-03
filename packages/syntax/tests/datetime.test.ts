import {
  isValidDatetime,
  ensureValidDatetime,
  normalizeAndEnsureValidDatetime,
  InvalidDatetimeError,
} from '../src'
import * as readline from 'readline'
import * as fs from 'fs'

describe('datetime validation', () => {
  const expectValid = (h: string) => {
    ensureValidDatetime(h)
  }
  const expectInvalid = (h: string) => {
    expect(() => ensureValidDatetime(h)).toThrow(InvalidDatetimeError)
  }

  it('conforms to interop valid datetimes', () => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(
        `${__dirname}/interop-files/datetime_syntax_valid.txt`,
      ),
      terminal: false,
    })
    lineReader.on('line', (line) => {
      if (line.startsWith('#') || line.length == 0) {
        return
      }
      if (!isValidDatetime(line)) {
        console.log(line)
      }
      expectValid(line)
    })
  })

  it('conforms to interop invalid datetimes', () => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(
        `${__dirname}/interop-files/datetime_syntax_invalid.txt`,
      ),
      terminal: false,
    })
    lineReader.on('line', (line) => {
      if (line.startsWith('#') || line.length == 0) {
        return
      }
      expectInvalid(line)
    })
  })

  it('conforms to interop invalid parse (semantics) datetimes', () => {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(
        `${__dirname}/interop-files/datetime_parse_invalid.txt`,
      ),
      terminal: false,
    })
    lineReader.on('line', (line) => {
      if (line.startsWith('#') || line.length == 0) {
        return
      }
      expectInvalid(line)
    })
  })
})

describe('normalization', () => {
  it('normalizes datetimes', () => {
    const normalized = normalizeAndEnsureValidDatetime(
      '1985-04-12T23:20:50.123',
    )
    expect(normalized).toMatch(/^1985-04-1[234]T[0-9:.]+Z$/)
  })

  it('throws on invalid normalized datetimes', () => {
    expect(() => normalizeAndEnsureValidDatetime('blah')).toThrow(
      InvalidDatetimeError,
    )
  })
})
