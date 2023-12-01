'use client'

import { useEffect, useState } from 'react'
import { CircularProgress } from '@nextui-org/react'
import { ConnectionState, XrplClient } from 'xrpl-client'
import { getAmendmentName } from '@/data/amendments'

type Props = {
  server: string
}

export default function NetworkInfo({ server: endpoint }: Props) {
  const [connectionState, setConnectionState] = useState<ConnectionState>()
  const [amendments, setAmendments] = useState<string[]>([])

  useEffect(() => {
    const client = new XrplClient(endpoint)
    client.ready().then(() => {
      setConnectionState(client.getState())
      client.send({
        command: 'ledger_entry',
        index: '7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4'
      }).then((res => {
        const { Majorities, Amendments } = res.node
        setAmendments(Amendments.reverse())
        client.close()
      }))
    })
    return () => {
      client.close()
    }
  }, [endpoint])

  if (!connectionState)
    return (
      <div className="m-4">
        <CircularProgress />
      </div>
    )

  return (
    <div>
      <div className="mt-4 mb-2 text-center">
        <span className='text-lg'>Network Version</span>
      </div>
      <div className='text-center'>
        <span>{connectionState.server.version}</span>
      </div>
      
      <div className="mt-4 mb-2 text-center">
        <span className='text-lg'>Enabled Amendments</span>
      </div>
      {amendments.map((amendment) => {
        return <div key={amendment}>{getAmendmentName(amendment)}</div>
      })}
    </div>
  )
}
