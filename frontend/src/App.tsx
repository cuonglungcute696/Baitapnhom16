import { useEffect, useState } from "react";
import useMetaMask from "./hooks/useMetaMask";
import ConnectButton from "./components/ConnectButton";
import ProposalCard from "./components/ProposalCard";
import AdminForm from "./components/AdminForm";
import { getVotingContract } from "./services/ethereum";

function App() {
    const { provider, signer, account, connect } = useMetaMask();
    const [proposals, setProposals] = useState<{ id: number; name: string; votes: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [hasVoted, setHasVoted] = useState<boolean[]>([]);

    async function fetchProposals() {
        if (!provider) return;
        setLoading(true);
        try {
            const contract = getVotingContract(provider);
            const list: any[] = await contract.getProposals();
            setProposals(list.map((p, i) => ({ id: i, name: p.name, votes: p.voteCount.toNumber() })));

            if (account && signer) {
                const voted = await contract.hasVoted(account);
                setHasVoted(new Array(list.length).fill(voted));
            }
        } catch (e) {
            console.error("Lỗi fetch proposals:", e);
        } finally {
            setLoading(false);
        }
    }

    async function checkOwner() {
        if (!provider || !account) return;
        try {
            const contract = getVotingContract(provider);
            const owner = await contract.owner();
            setIsOwner(owner.toLowerCase() === account.toLowerCase());
        } catch (e) {
            console.error("Lỗi check owner:", e);
        }
    }

    useEffect(() => {
        fetchProposals();
        checkOwner();
    }, [provider, account]);

    async function onVote(id: number) {
        if (!signer) return alert("Vui lòng kết nối ví");
        try {
            const contract = getVotingContract(signer);
            const tx = await contract.vote(id);
            const receipt = await tx.wait();
            if (receipt) {
                const newVoted = [...hasVoted];
                newVoted[id] = true;
                setHasVoted(newVoted);
                await fetchProposals();
            }
        } catch (e: any) {
            console.error("Lỗi vote:", e);
            alert(e.reason || "Lỗi khi gửi giao dịch");
        }
    }

    async function onAddProposal(name: string) {
        if (!signer) return alert("Vui lòng kết nối ví");
        try {
            const contract = getVotingContract(signer);
            const tx = await contract.addProposal(name);
            const receipt = await tx.wait();
            if (receipt) {
                await fetchProposals();
            }
        } catch (e: any) {
            console.error("Lỗi add proposal:", e);
            alert(e.reason || "Lỗi khi thêm proposal");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <header className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-indigo-600">🗳️ Voting DApp</h1>
                    <ConnectButton account={account} connect={connect} />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {account && (
                    <p className="text-sm text-gray-600 mb-4">
                        Tài khoản: <span className="font-mono font-semibold">{account}</span>
                    </p>
                )}

                <AdminForm onAdd={onAddProposal} isOwner={isOwner} />

                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Proposals</h2>
                    {loading ? (
                        <p className="text-gray-600">Đang tải...</p>
                    ) : proposals.length === 0 ? (
                        <p className="text-gray-600">Chưa có proposal nào</p>
                    ) : (
                        proposals.map((p) => (
                            <ProposalCard
                                key={p.id}
                                id={p.id}
                                name={p.name}
                                votes={p.votes}
                                onVote={onVote}
                                disabled={!account}
                                hasVoted={hasVoted[p.id]}
                            />
                        ))
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
