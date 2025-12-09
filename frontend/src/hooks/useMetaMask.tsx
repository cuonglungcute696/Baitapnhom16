import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function useMetaMask() {
    const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);

    useEffect(() => {
        const anyWindow = window as any;
        if (anyWindow.ethereum) {
            const p = new ethers.providers.Web3Provider(anyWindow.ethereum);
            setProvider(p);
            anyWindow.ethereum.on("accountsChanged", (accounts: string[]) => {
                setAccount(accounts[0] || null);
                setSigner(accounts[0] ? p.getSigner() : null);
            });
            anyWindow.ethereum.on("chainChanged", (chain: string) => {
                setChainId(parseInt(chain, 16));
            });
        }
    }, []);

    async function connect() {
        const anyWindow = window as any;
        if (!anyWindow.ethereum) throw new Error("MetaMask không được cài đặt");
        const p = new ethers.providers.Web3Provider(anyWindow.ethereum);
        const accounts = await p.send("eth_requestAccounts", []);
        setProvider(p);
        setAccount(accounts[0] || null);
        setSigner(p.getSigner());
        const network = await p.getNetwork();
        setChainId(network.chainId);
    }

    return { provider, signer, account, chainId, connect };
}