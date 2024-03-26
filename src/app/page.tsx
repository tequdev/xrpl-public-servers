'use client'
import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import { NETWORKS } from '@/data/networks';
import { getKeys } from '@/utils';
import { XrplClient } from 'xrpl-client';
import { amendments, getAmendmentName } from '@/data/amendments';

const RIPPLE_EPOCH_DIFF = 0x386d4380

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
const initialNetworkAmendment = amendments.reverse().reduce<Record<string, Record<string, Record<'enabled' | 'majority', boolean> & { closeTime: number | undefined }>>>((prevAm, curAm) => ({ ...prevAm, [curAm]: networkData.reduce((prev, cur) => ({ ...prev, [getNetworkKey(cur)]: { enabled: false, majority: false, closeTime: undefined } }), {}) }), {})

const rippleTimeToUnixTime = (rpepoch: number) => {
  return (rpepoch + RIPPLE_EPOCH_DIFF) * 1000
}

export default function Home() {
  const [networkAmendments, setNetworkAmendments] = useState(initialNetworkAmendment)
  const [networkVersion, setNetworkVersion] = useState(() =>
    networkData.reduce((prev, cur) => ({ ...prev, [getNetworkKey(cur)]: undefined }), {} as Record<ReturnType<typeof getNetworkKey>, string | undefined>)
  )

  useEffect(() => {
    networkData.forEach(network => {
      const client = new XrplClient(network.server)
      try {
        const _1 = client.ready().then(() => {
          console.log(client.getState())
          setNetworkVersion((curr) => ({ ...curr, [getNetworkKey(network)]: client.getState().server.version }))
          return
        })
        const _2 = client.send({
          command: 'ledger_entry',
          index: '7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4'
        }).then((res => {
          const { Majorities, Amendments } = res.node
          console.log(Amendments)
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
            ; ((Majorities || []) as Record<'Majority', { Amendment: string, CloseTime: number }>[]).forEach((majority) => {
              console.log({ majority })
              const amendmentName = getAmendmentName(majority.Majority.Amendment)
              setNetworkAmendments((prevState) => {
                const hasAmendment = (amendmentName in prevState)
                if (!hasAmendment) {
                  return { [amendmentName]: networkData.reduce((prev, cur) => ({ ...prev, [getNetworkKey(cur)]: { enabled: false, majority: getNetworkKey(network) === getNetworkKey(cur) } }), {}), ...prevState }
                } else {
                  return { ...prevState, [amendmentName]: { ...prevState[amendmentName], [getNetworkKey(network)]: { enabled: false, majority: true, closeTime: majority.Majority.CloseTime } } }
                }
              })
            })
          Promise.all([_1, _2]).then(() => {
            client.close()
          })
        }))
      } catch (e) {
        client.close()
      }
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
          {...[
            <TableRow key='version'>
              {...[
                <TableCell key='name'>Version</TableCell>,
                ...networkData.map(network => {
                  const version = networkVersion[getNetworkKey(network)]
                  if (!version) return <TableCell className='text-center' key={getNetworkKey(network)}>Loading...</TableCell>
                  const [versionHead, tag] = version.split('-')
                  return <TableCell className='text-center' key={getNetworkKey(network)}>{versionHead}<br />{tag || '　'}</TableCell>
                }
                )]}
            </TableRow>
            , ...getKeys(networkAmendments).map((amendmentId) =>
              <TableRow key={amendmentId}>
                {...[<TableCell key='name'>{amendmentId}</TableCell>, ...getKeys(networkAmendments[amendmentId]).map((networkKey) => {
                  const status = networkAmendments[amendmentId][networkKey]

                  const enableDatatimeStr = () => {
                    if (!status.closeTime) return null
                    let close = new Date(rippleTimeToUnixTime(status.closeTime))
                    if (networkKey.toLowerCase().includes('xahau'))
                      close.setDate(close.getDate() + 5)
                    else
                      close.setDate(close.getDate() + 14)
                    return close.toLocaleString()
                  }

                  return (
                    <TableCell className='text-center' key={networkKey}>
                      <Tooltip isDisabled={!status.majority} content={enableDatatimeStr()} closeDelay={50}>
                        <button disabled className='p-2 px-4 -m-2'>
                          {status.enabled ? '✅' : status.majority ? '🗳️' : ''}
                        </button>
                      </Tooltip>
                    </TableCell>
                  )
                })]
                }
              </TableRow>
            )]}
        </TableBody>
      </Table>
    </main>
  )
}
