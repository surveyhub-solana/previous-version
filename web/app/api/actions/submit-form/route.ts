import {
  createActionHeaders,
  ActionGetResponse,
  ActionError,
  ActionPostRequest,
  ActionPostResponse,
  createPostResponse,
  ACTIONS_CORS_HEADERS,
  BLOCKCHAIN_IDS,
} from '@solana/actions';
import * as anchor from '@project-serum/anchor';
import { IDL } from '@/config/anchor/idl';
import { getProgram } from '@/config/anchor/index';
import { IdlAccounts, ProgramAccount } from '@project-serum/anchor';
import { decode, encode } from 'bs58'; // Thêm thư viện mã hóa base58 nếu cần
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import { gunzipSync } from 'zlib';
import { createFormAction, handleAnswers } from '@/lib/handleFormAction';
import axios from 'axios';
import { deCompressedContent } from '@/lib/content';

type FormAccount = IdlAccounts<typeof IDL>['form'];
const headers = createActionHeaders({
  headers: ACTIONS_CORS_HEADERS,
  chainId: BLOCKCHAIN_IDS.devnet,
  actionVersion: '2.1.3',
});
export async function GET(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const formId = requestUrl.searchParams.get('formId') as string;
    const program = await getProgram();
    const idBytes = Buffer.from(formId);
    const keypairBase58 = process.env.SOLANA_SECRET_KEY as string;
    const keypairBytes = decode(keypairBase58);
    const systemKeypair = Keypair.fromSecretKey(keypairBytes);
    const formAccounts: ProgramAccount<FormAccount>[] =
      await program.account.form.all([
        {
          memcmp: {
            offset: 8 + 4, // Tính toán offset dựa trên các trường trước trường owner
            bytes: encode(idBytes),
          },
        },
      ]);
    if (formAccounts.length == 0) {
      throw new Error('Form not found!');
    }
    await program.methods
      .visitForm()
      .accounts({
        form: formAccounts[0].publicKey,
        system: systemKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([systemKeypair])
      .rpc();
    const publishedForms = formAccounts
      .map((account) => account.account)
      .filter((form) => form.published);

    if (publishedForms.length == 0 || publishedForms.length > 1) {
      throw new Error('Form not found!');
    }
    const baseHref = new URL(
      `/api/actions/submit-form`,
      requestUrl.origin
    ).toString();
    const title = `${publishedForms[0].name}`;
    const description = `${publishedForms[0].description}`;
    const content = publishedForms[0].content;
    const contentDecoded = decode(content as string);
    const decompressedContent = gunzipSync(contentDecoded).toString();
    const contentParsed = JSON.parse(decompressedContent);
    const form = createFormAction(contentParsed);
    const payload: ActionGetResponse = {
      type: 'action',
      title,
      icon: new URL('/branding/actions.png', requestUrl.origin).toString(),
      description,
      label: 'Transfer', // this value will be ignored since `links.actions` exists
      links: {
        actions: [
          {
            label: 'Submit', // button text
            href: `${baseHref}?formId=${formId}`,
            parameters: form,
            type: 'transaction',
          },
        ],
      },
    };

    return Response.json(payload, {
      headers,
    });
  } catch (error) {
    console.error(error);
    const actionError: ActionError = { message: 'An unknown error occurred' };
    if (typeof error == 'string') actionError.message = error;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
}
export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    const requestUrl = new URL(req.url);
    const formId = requestUrl.searchParams.get('formId') as string;
    const body = await req.json();

    let account: PublicKey;
    let tx: Transaction;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw 'Invalid "account" provided';
    }
    const data = body.data;

    const program = await getProgram();
    const idBytes = Buffer.from(formId);
    const formAccounts: ProgramAccount<FormAccount>[] =
      await program.account.form.all([
        {
          memcmp: {
            offset: 8 + 4, // Tính toán offset dựa trên các trường trước trường owner
            bytes: encode(idBytes),
          },
        },
      ]);
    if (formAccounts.length == 0) throw new Error('Form not found!');
    const publishedForms = formAccounts
      .map((account) => account.account)
      .filter((form) => form.published);

    if (publishedForms.length == 0 || publishedForms.length > 1)
      throw new Error('Form not found!');

    const content = publishedForms[0].content;
    const contentParsed = JSON.parse(deCompressedContent(content as string));

    const answers = handleAnswers(contentParsed, data);

    if (!answers) throw 'Invalid "data" provided';

    const connection = new Connection(clusterApiUrl('devnet'));

    try {
      const requestUrl = new URL(req.url);
      const submitUrl = new URL(
        `/api/submit-form`,
        requestUrl.origin
      ).toString();
      const response = await axios.post(submitUrl, {
        id: formId,
        content: JSON.stringify(answers),
        authorPubkey: account.toString(),
      });
      const data = await response.data;
      if (response.status == 200) {
        const base64Tx = data.transaction;
        const txBuffer = Buffer.from(base64Tx, 'base64');
        tx = Transaction.from(txBuffer);
        // tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      } else throw new Error(data.error || 'Something went wrong');
    } catch (error) {
      console.log(error);
      throw error;
    }

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: tx,
        message: 'Submit Form',
        links: {
          next: {
            type: 'post',
            href: `/api/actions/next-action`,
          },
        },
        type: 'transaction',
      },
      // no additional signers are required for this transaction
      // signers: [],
    });
    return Response.json(payload, {
      headers,
    });
  } catch (err) {
    console.log(err);
    const actionError: ActionError = { message: 'An unknown error occurred' };
    if (typeof err == 'string') actionError.message = err;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};
