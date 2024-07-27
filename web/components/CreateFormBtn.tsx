'use client';

import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { formSchema, formSchemaType } from '@/schemas/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ImSpinner2 } from 'react-icons/im';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Connection, Transaction } from '@solana/web3.js';
import { NODE_URL, DEFAULT_COMMITMENT } from '@/config/anchor/constants';
import { createForm } from '@/app/services/form';

function CreateFormBtn() {
  const router = useRouter();
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const { publicKey, connect } = useWallet();
  const wallet: WalletContextState = useWallet();
  const connection = new Connection(NODE_URL, DEFAULT_COMMITMENT);

  const handleButtonClick = useCallback(() => {
    if (!publicKey) {
      toast({
        title: 'Error',
        description: 'You are not logged in to the wallet',
      });
    }
  }, [publicKey, connect]);

  async function onSubmit(values: formSchemaType) {
    try {
      if (!publicKey || !wallet) {
        toast({
          title: 'Error',
          description: 'You are not logged in to the wallet',
        });
      } else {
        const transactionAndId = await createForm({
          ...values,
          ownerPubkey: publicKey.toString(),
        });
        if (transactionAndId) {
          // Ký giao dịch bằng ví của người dùng (ở phía client)
          if (wallet.signTransaction) {
            // Ký giao dịch bằng ví của người dùng (ở phía client)
            const signedTx = await wallet.signTransaction(transactionAndId.tx);

            // Phát sóng giao dịch lên mạng Solana
            const txId = await connection.sendRawTransaction(
              signedTx.serialize()
            );
            console.log('Transaction ID:', txId);
            toast({
              title: 'Success',
              description: 'Form created successfully',
            });
            router.push(`/dashboard/builder/${transactionAndId.id}`);
          } else {
            console.error('Wallet does not support signing transactions');
            toast({
              title: 'Error',
              description: 'Wallet does not support signing transactions',
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Error',
            description: 'Error initiating a transaction from the server',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
          onClick={handleButtonClick}
        >
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">
            Create new form
          </p>
        </Button>
      </DialogTrigger>
      {publicKey && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create form</DialogTitle>
            <DialogDescription>
              Create a new form to start collecting responses
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full mt-4"
            >
              {!form.formState.isSubmitting && <span>Save</span>}
              {form.formState.isSubmitting && (
                <ImSpinner2 className="animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default CreateFormBtn;
