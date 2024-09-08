import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from './hooks/useDesigner';
import { toast } from './ui/use-toast';
import { FaSpinner } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
// import { updateFormContent } from '@/app/services/form';
import { updateFormContent } from '@/action/form';
import { Connection } from '@solana/web3.js';
import { DEFAULT_COMMITMENT, NODE_URL } from '@/config/anchor/constants';

function SaveFormBtn({ id }: { id: string }) {
  const { filterElements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const { publicKey } = useWallet();
  const wallet = useWallet();
  const connection = new Connection(NODE_URL, DEFAULT_COMMITMENT);

  const updateForm = async () => {
    try {
      const jsonElements = JSON.stringify(filterElements());
      if (!publicKey) {
        toast({
          title: 'Error',
          description: 'You are not logged in to the wallet',
        });
      } else {
        // const transactionAndId = await updateFormContent({
        //   id: id,
        //   new_content: jsonElements,
        //   ownerPubkey: publicKey.toString(),
        // });
        // if (transactionAndId) {
        //   // Ký giao dịch bằng ví của người dùng (ở phía client)
        //   if (wallet.signTransaction) {
        //     // Ký giao dịch bằng ví của người dùng (ở phía client)
        //     const signedTx = await wallet.signTransaction(transactionAndId.tx);

        //     // Phát sóng giao dịch lên mạng Solana
        //     const txId = await connection.sendRawTransaction(
        //       signedTx.serialize()
        //     );
        //     console.log('Transaction ID:', txId);
        //     toast({
        //       title: 'Success',
        //       description: 'Form updated successfully',
        //     });
        //   } else {
        //     console.error('Wallet does not support signing transactions');
        //     toast({
        //       title: 'Error',
        //       description: 'Wallet does not support signing transactions',
        //       variant: 'destructive',
        //     });
        //   }
        // } else {
        //   toast({
        //     title: 'Error',
        //     description: 'Error initiating a transaction from the server',
        //     variant: 'destructive',
        //   });
        // }
        const updateSuccess = updateFormContent(
          id,
          jsonElements,
          publicKey.toString()
        );
        if (!updateSuccess) {
          toast({
            title: 'Error',
            description: 'Failed to update form content. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Form content updated successfully.',
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Something went wrong here',
        variant: 'destructive',
      });
    }
  };
  return (
    <Button
      variant={'outline'}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateForm);
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
