import { Command, flags } from '@oclif/command'
import { cli } from 'cli-ux'

import { NetworkCommand } from '../base/network'

export default class NetworksCommand extends Command {
  static description = `Show information for each known network.`

  static flags = {
    json: flags.boolean({
      description: 'Display data in a json structure.',
      required: false,
      exclusive: ['table'],
    }),
    table: flags.boolean({
      description: 'Display data in a table structure.',
      required: false,
      exclusive: ['json'],
    }),
  }

  static examples = ['eth networks --display json']

  async run() {
    try {
      const { flags } = this.parse(NetworksCommand)
      const { table } = flags

      const networkConstants = NetworkCommand.getNetworksInfo()

      if (!table) {
        cli.styledJSON(networkConstants)
      } else {
        const networks = Object.values(networkConstants).sort((network1, network2) => {
          if (network1.id !== undefined && network2.id !== undefined) {
            return network1.id - network2.id
          } else if (network1.id !== undefined) {
            return -1
          } else {
            return 1
          }
        })
        cli.table(
          networks,
          {
            id: {
              header: 'Id',
              minWidth: 7,
            },
            label: {
              header: 'Name',
            },
            url: {
              header: 'Url',
            },
          },
          {
            printLine: this.log,
            ...flags, // parsed flags
          },
        )
      }
    } catch (e) {
      this.error(e.message, { exit: 1 })
    }
  }
}
