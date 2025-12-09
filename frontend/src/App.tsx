import React, { useEffect, useState } from "react";
import useMetaMask from "./hooks/useMetaMask";
import ConnectButton from "./components/ConnectButton";
import ProposalCard from "./components/ProposalCard";
import { getVotingContract } from "./services/ethereum";
import { ethers } from "ethers";

function App() {
    const { provider, signer, account, connect } = useMetaMask();
    const [proposals, setProposals] = useState<{ id: number; name: string; votes: number }[]>([]);
    const [loading, setLoading] = useState(false);

    async function fetchProposals() {
        if (!provider) return;
        setLoading(true);
        try {
            const contract = getVotingContract(provider);
            // giả sử contract có function getProposals() trả về array
            const list: any[] = await contract.getProposals();
            setProposals(list.map((p, i) => ({ id: i, name: p.name, votes: p.voteCount.toNumber() })));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProposals();
    }, [provider]);

    async function onVote(id: number) {
        if (!signer) return alert("Vui lòng kết nối ví");
        try {
            const contract = getVotingContract(signer);
            const tx = await contract.vote(id);
            await tx.wait();
            await fetchProposals();
        } catch (e) {
            console.error(e);
            alert("Lỗi khi gửi giao dịch");
        }
    }

    return (
        <div style={{ padding: 20 }}>
            <header style={{ display: "flex", justifyContent: "space-between" }}>
                <h1>Voting DApp</h1>
                <ConnectButton account={account} connect={connect} />
            </header>

            <main>
                <h2>Proposals</h2>
                {loading ? <p>Đang tải...</p> : proposals.map(p => (
                    <ProposalCard key={p.id} id={p.id} name={p.name} votes={p.votes} onVote={onVote} />
                ))}
            </main>
        </div>
    );
}

export default App;