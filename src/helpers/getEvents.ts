import Web3 from 'web3'
import { EventLog } from 'web3/types'

import { getAddress } from './config'
import { extractMethodsAndEventsFromABI } from './utils'

export async function getEvents(
  abi: any,
  eventName: string,
  name: string,
  url: string,
  { from, to }: any,
) {
  const matchingEvents = extractMethodsAndEventsFromABI(abi).filter(x => x.name === eventName)

  if (!matchingEvents.length) {
    throw new Error('[getEvents] event specified does not exist in the ABI provided')
  }

  const eventAbi = matchingEvents[0]

  const web3 = new Web3(new Web3.providers.HttpProvider(url))
  const networkId = await web3.eth.net.getId()

  const address = getAddress(name, String(networkId))

  const contract = new web3.eth.Contract(abi, address)
  const events = await contract.getPastEvents(eventName, { fromBlock: from, toBlock: to })

  return { eventAbi, events }
}

export const parseEvent = (event: EventLog, eventAbi: any) => {
  const returnValues = eventAbi.inputs.map((x: any, i: number) => event.returnValues[i]).join(',')
  const parsedEvent = `${eventAbi.name}(${returnValues})`
  const block = event.blockNumber
  return `#${block}: ${parsedEvent}`
}

export const processEvent = (event: EventLog, eventAbi: any) => {
  const eventJson = {
    blockNumber: event.blockNumber,
    name: eventAbi.name,
    arguments: {} as any,
  }

  Object.entries(event.returnValues).forEach(([key, value]) => {
    if (/\d+/.test(key)) {
      return
    }

    eventJson.arguments[key] = value
  })

  return eventJson
}
