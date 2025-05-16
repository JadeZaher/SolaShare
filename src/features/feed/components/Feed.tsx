"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/features/wallet/WalletProvider"
import { postContract, PostData } from "@/contract/postContract"
import { PublicKey } from '@solana/web3.js'

interface ExamplePost {
  id: string
  content: string
  author: string
  timestamp: number
  imageUrl?: string
}

const examplePosts: ExamplePost[] = [
  {
    id: '1',
    content: "Welcome to SolaShare! This is a featured post with rich text support. You can add images too.",
    author: "Featured",
    timestamp: Date.now() - 1000000,
    imageUrl: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=600"
  },
  {
    id: '2',
    content: "Here's another example post. Rich text and images make your posts more engaging!",
    author: "Featured",
    timestamp: Date.now() - 500000,
  }
]

type DisplayPost = ExamplePost | PostData

export function Feed() {
  const { connected, publicKey } = useWallet()
  const [posts, setPosts] = useState<DisplayPost[]>(examplePosts)
  const [newPost, setNewPost] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (connected) {
      fetchPosts()
    }
  }, [connected])

  const fetchPosts = async () => {
    try {
      const chainPosts = await postContract.getPosts()
      setPosts([...examplePosts, ...chainPosts])
    } catch (error) {
      console.error("Error fetching posts:", error)
    }
  }

  const createPost = async () => {
    if (!connected || !publicKey || !newPost.trim()) return

    setIsLoading(true)
    try {
      await postContract.createPost({
        content: newPost,
        imageUrl: newImageUrl.trim() || undefined,
        author: publicKey
      })

      await fetchPosts()
      setNewPost("")
      setNewImageUrl("")
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderAuthor = (post: DisplayPost) => {
    if (post.author === "Featured") return "⭐ Featured"
    if (typeof post.author === 'string') return post.author
    return `${post.author.toBase58().slice(0, 4)}...${post.author.toBase58().slice(-4)}`
  }

  return (
    <div className="grid gap-12">
      {connected ? (
        <Card className="overflow-hidden">
          <div className="p-8 space-y-6">
            <textarea
              className="w-full p-6 text-xl border-2 border-black focus:outline-none resize-none min-h-[160px] font-light placeholder:text-gray-400"
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-6 text-lg border-2 border-black focus:outline-none font-light placeholder:text-gray-400"
              placeholder="Image URL (optional)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <Button 
              onClick={createPost}
              disabled={isLoading}
              className="w-full text-lg h-16 font-medium tracking-wide"
            >
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-8">
          <p className="text-2xl font-light text-center text-gray-600">
            Connect your wallet to start posting
          </p>
        </Card>
      )}

      <div className="grid gap-12">
        {posts.map((post) => (
          <Card key={'id' in post ? post.id : post.timestamp.toString()}>
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-black pb-4">
                <p className="text-sm font-bold tracking-widest uppercase">
                  {renderAuthor(post)}
                </p>
                <time className="text-sm font-light text-gray-600">
                  {new Date(post.timestamp).toLocaleString()}
                </time>
              </div>
              <p className="text-xl font-light leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden border-2 border-black">
                  <img 
                    src={post.imageUrl} 
                    alt="Post image" 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
