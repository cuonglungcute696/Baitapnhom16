import { useState } from "react";

type Props = {
    id: number;
    name: string;
    votes: number;
    onVote: (id: number) => Promise<void>;
    disabled?: boolean;
    hasVoted?: boolean;
};

export default function ProposalCard({ id, name, votes, onVote, disabled = false, hasVoted = false }: Props) {
    const [voting, setVoting] = useState(false);

    const handleVote = async () => {
        setVoting(true);
        try {
            await onVote(id);
        } catch (e) {
            console.error(e);
        } finally {
            setVoting(false);
        }
    };

    return (
        <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold text-blue-600">{votes}</span> phiếu
            </p>
            <button
                onClick={handleVote}
                disabled={disabled || hasVoted || voting}
                className={`mt-3 px-3 py-1 rounded font-medium transition ${
                    disabled || hasVoted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : voting
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                {voting ? "Đang gửi..." : hasVoted ? "Đã bỏ phiếu" : "Vote"}
            </button>
        </div>
    );
}