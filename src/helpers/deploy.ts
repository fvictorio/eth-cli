import * as fs from 'fs'
import Web3 from 'web3'
import Contract from 'web3/eth/contract'
import { TransactionReceipt } from 'web3/types'
import { Unit } from 'web3/utils'

import { add0x } from './utils'

interface DeployResult {
  receipt: TransactionReceipt
  address: string
}

export function deploy(url: string, privateKey: string, binPath: string): Promise<DeployResult> {
  const transactionConfirmationBlocks = 3
  const options = {
    transactionConfirmationBlocks,
  }

  const web3 = new Web3(new Web3.providers.HttpProvider(url))
  privateKey = add0x(privateKey)

  const { address } = web3.eth.accounts.wallet.add(privateKey)

  const data = add0x(fs.readFileSync(binPath).toString())

  const Contract: any = web3.eth.Contract // ts hack: transactionConfirmationBlocks is not a valid option
  const contract = new Contract([], undefined, options)

  const deploy = contract.deploy({ data })
  let receipt: TransactionReceipt

  return deploy
    .estimateGas({
      from: address,
    })
    .then((gas: Unit) => {
      process.stderr.write(`Estimated gas: ${gas}\n`)

      return deploy
        .send({
          from: address,
          gas,
        })
        .on('transactionHash', (tx: string) => {
          process.stderr.write(`TX: ${tx}\n`)
        })
        .on(
          'confirmation',
          (confirmationNumber: number, transactionReceipt: TransactionReceipt) => {
            receipt = transactionReceipt
            process.stderr.write(
              `Confirmation ${confirmationNumber} of ${transactionConfirmationBlocks}\n`,
            )
          },
        )
        .then((contract: Contract) => ({ address: contract.options.address, receipt }))
    })
}
