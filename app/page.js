'use client'
import useWeb3 from "@/hooks/useWeb3";
import Home from "@/pages/Home";
import Welcome from "@/pages/Welcome";
import { useState } from "react";

export default function Start() {
  const { connectToBlockchain, web3, account, balance, contract } = useWeb3();
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    await connectToBlockchain()
    setIsLoading(false)
  }

  return (
    <>
      {
        web3 === null ? <Welcome connectToBlockchain={handleLogin} isLoading={isLoading} /> : <Home account={account} balance={balance} contract={contract} web3={web3}/>
      }
    </>
  )
}
