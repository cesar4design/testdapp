'use client'

import { useWeb3Modal } from '@web3modal/wagmi/react'
import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import {
  useDisconnect,
  useAccount,
  usePrepareContractWrite,
  usePrepareContractRead,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  useSwitchNetwork 
} from 'wagmi'
import ABI from "../abi/ABI.json";


export default function Component() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const { chain } = useNetwork()
  const { chains, error, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  const currentChain = chain && chain.id;

  const [ethAmount, setEthAmount] = useState('1')
  const [tokenAmount, setTokenAmount] = useState('10000')

  const conversionRate = 10000 // 1 ETH = 10,000 tokens

  useEffect(() => {
    convertEthToTokens(ethAmount)
  }, [ethAmount])

  const convertEthToTokens = (eth) => {
    const ethValue = parseFloat(eth)
    if (!isNaN(ethValue)) {
      const tokens = (ethValue * conversionRate).toFixed(6)
      setTokenAmount(tokens)
    } else {
      setTokenAmount('0')
    }
  }

  const handleEthInputChange = (e) => {
    setEthAmount(e.target.value)
  }

  const ethToWei = parseEther(ethAmount);

  // Contracts
  const [smartContract, setSmartContract] = useState({ address: '0xaeCB54347eE4B36cC260dCE51DA0C1A0191DcB63', abi: ABI });

  // Buy Tokens
  const { write: buyTokens } = useContractWrite({
    ...smartContract,
    functionName: "buyTokens",
    value: ethToWei,
  });

  return (
    <body>


      <div className="container">
        <div className="stats">
          <div className="stat">
            <h1>$3,530,784.65</h1>
            <p>ETH Raised</p>

          </div>
          <div className="stat">
            <h1>4,616</h1>
            <p>Holders</p>
          </div>
        </div>

        <div className="card">
          <div className="token-info">
            <div className="token-price">
              <img src="/token.png" alt="TICS" className="token-icon" />
              <span>1 TEST = </span>
              <img src="/eth.svg" alt="USD" className="eth-icon" />
              <span>0.0001 ETH</span>
            </div>
            <div className="phase-info">233,824,637 Tokens Sold</div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill"></div>
              <div className="progress-marker"></div>
            </div>

          </div>

          <div className="purchase-steps">
            <div className="step">
              <h3>Enter the amount of eth you would like to spend:</h3>
              <div className="conversion-inputs">
                <div className="input-group">
                  <input
                    type="text"
                    value={ethAmount}
                    onChange={handleEthInputChange}
                    aria-label="ETH amount"
                  />
                  <span className="currency">ETH</span>
                </div>
                <div className="equals">=</div>
                <div className="input-group">
                  <input
                    type="text"
                    value={tokenAmount}
                    readOnly
                    aria-label="Token amount"
                  />
                  <span className="currency">TEST</span>
                </div>
              </div>

            </div>
          </div>

          {isConnected ? (
            <>
              {currentChain === 11155111 ? (

                <>
                  <button onClick={() => buyTokens()} className="connect-wallet">Buy Tokens</button>
                </>

              ) : (
                <>
                  <>
                    <button  onClick={() => switchNetwork?.(0xaa36a7)} className="connect-wallet">Change Network</button>
                  </>
                </>
              )
              }
            </>

          ) : (
            <>
              <button onClick={() => open()} className="connect-wallet">Connect Wallet</button>
            </>
          )}


          <div className="help-link">
            How to buy? →
          </div>
        </div>
      </div>

    </body>
  )
}

