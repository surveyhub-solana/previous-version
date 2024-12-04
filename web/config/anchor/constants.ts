import { clusterApiUrl, PublicKey } from '@solana/web3.js';

export const DEFAULT_COMMITMENT = 'confirmed';
export const DEFAULT_CLUSTER = 'devnet';
export const PROGRAM_ADDRESS = new PublicKey(
  '9PvGWypCFJqb5B52BYHtMXiPPzJ9EFw2b9ndJpsV1kBs'
);
export const NODE_URL = clusterApiUrl(DEFAULT_CLUSTER);
