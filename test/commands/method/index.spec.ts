import stripAnsi from 'strip-ansi'

import MethodIndexCommand from '../../../src/commands/method/index'

describe('method', () => {
  let stdoutResult: any

  beforeEach(() => {
    stdoutResult = []
    jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(val => stdoutResult.push(stripAnsi(val.toString())))
  })

  afterEach(() => jest.restoreAllMocks())

  it(`Should run 'method' with empty args and flags and throw an error.`, async () => {
    await expect(MethodIndexCommand.run()).rejects.toThrow()
  })

  it(`Should run 'method' and throw an error.`, async () => {
    await expect(MethodIndexCommand.run([])).rejects.toThrow('EEXIT: 0')
  })

  it(`Should run 'method --help' and throw an error.`, async () => {
    await expect(MethodIndexCommand.run(['--help'])).rejects.toThrow('EEXIT: 0')
  })

  it(`Should run 'method --bar' and throw an error.`, async () => {
    await expect(MethodIndexCommand.run(['--bar'])).rejects.toThrow(
      'Unexpected argument: --bar\n' + 'See more help with --help',
    )
  })
})
