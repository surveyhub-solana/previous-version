import { clusterApiUrl, PublicKey } from '@solana/web3.js';

export const DEFAULT_COMMITMENT = 'confirmed';
export const DEFAULT_CLUSTER = 'devnet';
export const PROGRAM_ADDRESS = new PublicKey(
  '8XEbkhydCyZSPqvsfRmE2s4p1YbBQeMabY8DXu92B54E'
);
export const NODE_URL = clusterApiUrl(DEFAULT_CLUSTER);
