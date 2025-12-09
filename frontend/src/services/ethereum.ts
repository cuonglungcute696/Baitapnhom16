import { ethers } from "ethers";

// placeholder ABI / address — cập nhật sau khi deploy contract
export const VOTING_ABI = [
  // minimal ABI cho getProposals, vote, addProposal, owner
];
export const VOTING_ADDRESS = "0x0000000000000000000000000000000000000000";

export function getVotingContract(providerOrSigner: ethers.Signer | ethers.providers.Provider) {
    return new ethers.Contract(VOTING_ADDRESS, VOTING_ABI, providerOrSigner);
}