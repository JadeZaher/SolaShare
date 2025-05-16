"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WalletProvider } from "@/features/wallet/WalletProvider"
import { Feed } from "@/features/feed/components/Feed"

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <Card className="mb-16 overflow-hidden">
            <div className="grid md:grid-cols-[1.5fr,1fr] border-b border-black">
              <div className="p-16 space-y-8">
                <h1 className="text-7xl font-extrabold tracking-tight leading-none">
                  Welcome to{" "}
                  <span className="inline-block">SolaShare</span>
                </h1>
                <p className="text-2xl font-light leading-relaxed max-w-2xl text-gray-600">
                  Transform your social interactions into NFTs on the Solana blockchain.
                  Connect your wallet to start sharing and owning your digital interactions.
                </p>
                <div className="pt-4">
                  <Button 
                    size="lg" 
                    className="text-lg px-12 py-8 h-auto font-medium tracking-wide"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
              <div className="hidden md:block border-l border-black">
                <div className="aspect-square relative">
                  <img 
                    src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Hero" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-2">Feed</h2>
            <p className="text-xl font-light text-gray-600 mb-8">
              Share your thoughts and connect with others on the blockchain
            </p>
          </div>

          <Feed />
        </div>

        {/* Swiss Design Grid Pattern */}
        <div className="fixed inset-0 grid grid-cols-4 pointer-events-none z-[-1]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-l border-black/5 h-full" />
          ))}
        </div>
      </div>
    </WalletProvider>
  )
}
