"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  connect: async () => {},
  disconnect: () => {},
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)

  const connect = useCallback(async () => {
    try {
      // TODO: Implement actual Web3Auth and Solana wallet connection
      const mockPublicKey = new PublicKey("11111111111111111111111111111111")
      setPublicKey(mockPublicKey)
      setConnected(true)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }, [])

  const disconnect = useCallback(() => {
    setPublicKey(null)
    setConnected(false)
  }, [])

  return (
    <WalletContext.Provider value={{ connected, publicKey, connect, disconnect }}>
      <div className="fixed top-4 right-4">
        {!connected ? (
          <button 
            onClick={connect}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <button 
            onClick={disconnect}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Disconnect {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
          </button>
        )}
      </div>
      {children}
    </WalletContext.Provider>
  )
}
