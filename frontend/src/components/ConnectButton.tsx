import React from "react";

type Props = { account: string | null; connect: () => Promise<void> };

export default function ConnectButton({ account, connect }: Props) {
    return (
        <div>
            {account ? (
                <button disabled>
                    {account.slice(0, 6)}...{account.slice(-4)}
                </button>
            ) : (
                <button onClick={connect}>Kết nối MetaMask</button>
            )}
        </div>
    );
}