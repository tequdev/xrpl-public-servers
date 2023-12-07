'use client'
import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell
} from "@nextui-org/react";
import { NETWORKS } from '@/data/networks';
import { getKeys } from '@/utils';
import { XrplClient } from 'xrpl-client';
import { amendments, getAmendmentName } from '@/data/amendments';

const protocols = getKeys(NETWORKS)
const networkData = protocols.flatMap((protocol) => {
  const networks = getKeys(NETWORKS[protocol])
  return networks.flatMap((network) => {
    const networkInfo = NETWORKS[protocol][network]
    return {
      protocol,
      ...networkInfo
    }
  })
})
const protocolName = (protocol: typeof networkData[number]['protocol']) => protocol === 'xrpl' ? 'XRPL' : protocol === 'xahau' ? 'Xahau' : protocol
const getNetworkKey = (network: typeof networkData[number]) => `${protocolName(network.protocol)}-${network.name}`
const initialNetworkAmendment = amendments.reverse().reduce<Record<string, Record<string, Record<'enabled' | 'majority', boolean>>>>((prevAm, curAm) => ({ ...prevAm, [curAm]: networkData.reduce((prev, cur) => ({ ...prev, [getNetworkKey(cur)]: { enabled: false, majority: false } }), {}) }), {})

export default function Home() {
  const [networkAmendments, setNetworkAmendments] = useState(initialNetworkAmendment)

  useEffect(() => {
    networkData.forEach(network => {
      const client = new XrplClient(network.server)
      client.send({
        command: 'ledger_entry',
        index: '7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4'
      }).then((res => {
        client.close()
        const { Majorities, Amendments } = res.node
          ; (Amendments as string[]).forEach((amendmentId) => {
            const amendmentName = getAmendmentName(amendmentId)
            setNetworkAmendments((prevState) => {
              const hasAmendment = (amendmentName in prevState)
              if (!hasAmendment) {
                return { [amendmentName]: networkData.reduce((prev, cur) => ({ ...prev, [getNetworkKey(cur)]: { enabled: getNetworkKey(network) === getNetworkKey(cur), majority: false } }), {}), ...prevState }
              } else {
                return { ...prevState, [amendmentName]: { ...prevState[amendmentName], [getNetworkKey(network)]: { enabled: true, majority: false } } }
              }
            })
          })
          ; (Majorities as { Amendment: string, CloseTime: number }[]).forEach((majority) => {
            const amendmentName = getAmendmentName(majority.Amendment)
            setNetworkAmendments((prevState) => {
              const hasAmendment = (amendmentName in prevState)
              if (!hasAmendment) {
                return { [amendmentName]: networkData.reduce((prev, cur) => ({ ...prev, [getNetworkKey(cur)]: { enabled: false, majority: getNetworkKey(network) === getNetworkKey(cur) } }), {}), ...prevState }
              } else {
                return { ...prevState, [amendmentName]: { ...prevState[amendmentName], [getNetworkKey(network)]: { enabled: false, majority: true } } }
              }
            })
          })
      }))
    })
  }, [])

  return (
    <main className="min-h-screen p-8">
      <Table isStriped fullWidth={false}>
        <TableHeader>
          {...[<TableColumn key="amendment">Amendment</TableColumn>, ...networkData.map(network =>
            <TableColumn className='text-center' key={getNetworkKey(network)}>{getNetworkKey(network).split("-")[0]}<br />{getNetworkKey(network).split("-")[1]}</TableColumn>
          )]}
        </TableHeader>
        <TableBody>
          {...getKeys(networkAmendments).map((amendmentId) =>
            <TableRow key={amendmentId}>
              {...[<TableCell key='name'>{amendmentId}</TableCell>, ...getKeys(networkAmendments[amendmentId]).map((networkKey) => {
                const status = networkAmendments[amendmentId][networkKey]
                return <TableCell className='text-center' key={networkKey}>{status.enabled ? '✅' : status.majority ? '🗳️' : ''}</TableCell>
              })]
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  )
}
