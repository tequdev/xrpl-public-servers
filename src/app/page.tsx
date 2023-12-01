'use client'
import { useState } from 'react';
import { Tab, Tabs, RadioGroup } from '@nextui-org/react'
import { CustomRadio } from '@/components/CustomRadio';
import NetworkInfo from '@/components/NetworkInfo';
import { NETWORKS } from '@/data/networks';
import { getKeys } from '@/utils';

export default function Home() {
  const [network, setNetwork] = useState<keyof typeof NETWORKS>(getKeys(NETWORKS)[0])

  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <RadioGroup className='m-8' label="Networks" defaultValue={network} value={network} onChange={(e) => setNetwork(e.target.value as 'xrpl' || 'xahau')} orientation='horizontal'>
        <CustomRadio value="xrpl">
          XRP Ledger
        </CustomRadio>
        <CustomRadio value="xahau">
          Xahau Network
        </CustomRadio>
      </RadioGroup>

      <Tabs defaultSelectedKey='mainnet'>
        {getKeys(NETWORKS[network]).map((key) => {
          const data = NETWORKS[network][key]
          return (
            <Tab key={network + key} title={key}>
              <NetworkInfo server={data.server} />
            </Tab>
          )
        })}
      </Tabs>
    </main>
  )
}
