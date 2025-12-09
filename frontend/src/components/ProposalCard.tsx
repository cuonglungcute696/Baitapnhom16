import React from "react";

type Props = {
    id: number;
    name: string;
    votes: number;
    onVote: (id: number) => Promise<void>;
    disabled?: boolean;
};

export default function ProposalCard({ id, name, votes, onVote, disabled }: Props) {
    return (
        <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
            <h3>{name}</h3>
            <p>Phiếu: {votes}</p>
            <button onClick={() => onVote(id)} disabled={disabled}>
                Vote
            </button>
        </div>
    );
}