import { useState } from "react";

type Props = { account: string | null; connect: () => Promise<void> };

export default function ConnectButton({ account, connect }: Props) {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            await connect();
        } catch (e) {
            console.error(e);
            alert("Kết nối thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleConnect}
            disabled={loading || !!account}
            className={`px-4 py-2 rounded font-semibold transition ${
                account
                    ? "bg-green-500 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
        >
            {loading ? "Đang kết nối..." : account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Kết nối MetaMask"}
        </button>
    );
}