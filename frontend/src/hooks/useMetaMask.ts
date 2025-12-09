import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function useMetaMask() {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);

    useEffect(() => {
        const anyWindow = window as any;
        if (anyWindow.ethereum) {
            const p = new ethers.BrowserProvider(anyWindow.ethereum);
            setProvider(p);
            anyWindow.ethereum.on("accountsChanged", async (accounts: string[]) => {
                setAccount(accounts[0] || null);
                if (accounts[0]) {
                    const s = await p.getSigner();
                    setSigner(s);
                } else {
                    setSigner(null);
                }
            });
            anyWindow.ethereum.on("chainChanged", (chain: string) => {
                setChainId(parseInt(chain, 16));
            });
        }
    }, []);

    async function connect() {
        const anyWindow = window as any;
        if (!anyWindow.ethereum) throw new Error("MetaMask không được cài đặt");
        const p = new ethers.BrowserProvider(anyWindow.ethereum);
        const accounts = await p.send("eth_requestAccounts", []);
        setProvider(p);
        setAccount(accounts[0] || null);
        const s = await p.getSigner();
        setSigner(s);
        const network = await p.getNetwork();
        setChainId(Number(network.chainId));
    }

    return { provider, signer, account, chainId, connect };
}