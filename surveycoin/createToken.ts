import {
  percentAmount,
  generateSigner,
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi';
import {
  TokenStandard,
  createAndMint,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import secret from './token-admin.json'
const umi = createUmi('https://api.devnet.solana.com/'); //Replace with your QuickNode RPC Endpoint
const userWallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(secret)
);
const userWalletSigner = createSignerFromKeypair(umi, userWallet);
const metadata = {
  name: 'SurveyCoin',
  symbol: 'SCT',
  uri: 'https://github.com/lexuandaibn123/surveyhub/blob/main/surveycoin/metadata.json',
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner));
umi.use(mplTokenMetadata());

createAndMint(umi, {
  mint,
  authority: umi.identity,
  name: metadata.name,
  symbol: metadata.symbol,
  uri: metadata.uri,
  sellerFeeBasisPoints: percentAmount(0),
  decimals: 9,
  amount: 2004 * 1_000_000_000,
  tokenOwner: userWallet.publicKey,
  tokenStandard: TokenStandard.Fungible,
})
  .sendAndConfirm(umi)
  .then(() => {
    console.log('Successfully minted 1 million tokens (', mint.publicKey, ')');
  })
  .catch((err) => {
    console.error('Error minting tokens:', err);
  });
