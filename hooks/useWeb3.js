'use client'
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import contractAbi from '../Cuyo.json';

const useWeb3 = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');

    const ADMIN_ACCOUNT = process.env.NEXT_PUBLIC_ADMIN_ACCOUNT
    const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
    const connectToBlockchain = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWeb3(provider);

                console.log("Contract address: ", CONTRACT_ADDRESS)

                const contractInstance = new provider.eth.Contract(
                contractAbi.abi,
                CONTRACT_ADDRESS
                );

                setContract(contractInstance);

                // Add implementation if user is admin
                return true
            } catch (error) {
                return false
            }

        }
    }

    const fetchAccountData = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const balanceInWei = await web3.eth.getBalance(accounts[0]);
        const balanceInEth = await web3.utils.fromWei(balanceInWei, "ether");
        setBalance(balanceInEth);
    }

    useEffect(() => {
        if (web3 !== null)
            fetchAccountData()
    }, [web3])

    return {
        connectToBlockchain,
        fetchAccountData,
        web3,
        account,
        balance,
        contract
    }
}

export default useWeb3