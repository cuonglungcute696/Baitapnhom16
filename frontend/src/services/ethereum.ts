import { ethers } from "ethers";

export const VOTING_ABI = [
  // sẽ cập nhật sau khi deploy contract
];
export const VOTING_ADDRESS = "0x0000000000000000000000000000000000000000";

export function getVotingContract(providerOrSigner: ethers.Signer | ethers.Provider) {
    return new ethers.Contract(VOTING_ADDRESS, VOTING_ABI, providerOrSigner);
}