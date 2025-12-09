import React, { useState } from "react";

type Props = {
    onAdd: (name: string) => Promise<void>;
    isOwner: boolean;
};

export default function AdminForm({ onAdd, isOwner }: Props) {
    const [proposalName, setProposalName] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOwner) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!proposalName.trim()) {
            alert("Vui lòng nhập tên proposal");
            return;
        }
        setLoading(true);
        try {
            await onAdd(proposalName);
            setProposalName("");
        } catch (e) {
            console.error(e);
            alert("Lỗi khi thêm proposal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Admin: Thêm Proposal</h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={proposalName}
                    onChange={(e) => setProposalName(e.target.value)}
                    placeholder="Tên proposal..."
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition"
                >
                    {loading ? "Thêm..." : "Thêm"}
                </button>
            </div>
        </form>
    );
}