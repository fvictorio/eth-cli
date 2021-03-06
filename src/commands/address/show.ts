import { Command } from '@oclif/command'
import cli from 'cli-ux'

import { configService } from '../../helpers/config-service'

export class ShowCommand extends Command {
  static description = 'Display a known address.'

  static args = [
    {
      name: 'name',
      required: true,
      description: 'Name of the address to get',
    },
  ]

  static examples = ['eth address:show ganache']

  async run() {
    const { args } = this.parse(ShowCommand)

    const { name } = args
    const addresses = configService.getAddresses()
    if (addresses[name]) {
      cli.styledJSON(addresses[name])
    } else {
      this.warn(`No address found for '${name}'`)
    }
  }
}
