import { Command } from '@oclif/command'

import { isEmptyCommand } from '../../../helpers/checkCommandInputs'
import { config } from '../../../helpers/config'

export class RemoveCommand extends Command {
  static description = 'Remove a known address'

  static args = [
    {
      name: 'name',
      required: false,
      description: 'Name of the address to remove',
    },
  ]

  static aliases = ['rm']

  static examples = ['eth conf:address:rm ganache1']

  async run() {
    const { args, flags } = this.parse(RemoveCommand)

    if (isEmptyCommand(flags, args)) {
      this._help()
      this.exit(1)
    }

    const { name } = args
    const addresses = config.get('addresses', {})
    if (addresses[name]) {
      delete addresses[name]
      config.set('addresses', addresses)
    } else {
      this.warn(`No address found for '${name}'`)
    }
  }
}
