import { clusterApiUrl, PublicKey } from '@solana/web3.js';

export const DEFAULT_COMMITMENT = 'confirmed';
export const DEFAULT_CLUSTER = 'devnet';
export const PROGRAM_ADDRESS = new PublicKey(
  'Dzz1hUHAkAFuMSm7qqmSPic4ucVpXNZjoov1WvFRmCCL'
);
export const NODE_URL = clusterApiUrl(DEFAULT_CLUSTER);
