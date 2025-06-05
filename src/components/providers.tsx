//  aptos.dev/en/build/sdks/wallet-adapter/dapp 

"use client";
import React from 'react';
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PropsWithChildren } from "react";
import { Network } from "@aptos-labs/ts-sdk";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";


export default function Providers({ children }: PropsWithChildren) {
    return <div>
        <AptosWalletAdapterProvider
            optInWallets={['Petra']}
            autoConnect={true}
            dappConfig={{ network: Network.TESTNET }}
            onError={(error) => {
                console.log("error", error);
            }}
        >
            {children}
        </AptosWalletAdapterProvider>
    </div>
}