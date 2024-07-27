'use client';

import { useState, useTransition } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { MdOutlinePublish } from 'react-icons/md';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateFormSchema, updateFormSchemaType } from '@/schemas/form';
import { publishForm, updateFormSOL } from '@/app/services/form';

function PublishFormBtn({ id, publicKey }: { id: string; publicKey: string }) {
  const [isPending, startTransition] = useTransition();
  const [isPublishing, setIsPublishing] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
  const form = useForm<updateFormSchemaType>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      sumSOL: 0,
      SOLPerUser: 0,
    },
  });

  async function onSubmit(values: updateFormSchemaType) {
    setIsPublishing(true);
    try {
      if (!publicKey) {
        toast({
          title: 'Error',
          description: 'You are not logged in to the wallet',
        });
        return;
      }

      if (values.sumSOL >= 0 && values.SOLPerUser >= 0) {
        if (values.sumSOL !== 0 && values.SOLPerUser !== 0) {
          const transactionAndId = await updateFormSOL({
            id: id,
            sum_sol: values.sumSOL,
            sol_per_user: values.SOLPerUser,
            ownerPubkey: publicKey.toString(),
          });

          if (transactionAndId) {
            // Ký giao dịch bằng ví của người dùng (ở phía client)
            if (wallet.signTransaction) {
              // Ký giao dịch bằng ví của người dùng (ở phía client)
              const signedTx = await wallet.signTransaction(
                transactionAndId.tx
              );

              // Phát sóng giao dịch lên mạng Solana
              const txId = await connection.sendRawTransaction(
                signedTx.serialize()
              );
              console.log('Transaction ID:', txId);
              toast({
                title: 'Success',
                description: 'Form updated successfully',
              });
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

        const formId = await publishForm({
          id,
          ownerPubkey: publicKey.toString(),
        });
        if (formId && formId == id) {
          toast({
            title: 'Success',
            description: 'Your form is now available to the public',
          });
          window.location.href = `/dashboard/builder/${id}`;
        }
        else {
          toast({
            title: 'Error',
            description: 'Errors when publishing forms',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: 'Invalid parameter',
        });
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400">
          <MdOutlinePublish className="h-4 w-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. After publishing you will not be able
            to edit this form. <br />
            <br />
            <span className="font-medium">
              Before making the project public, add a reward for those who
              provide you with information
            </span>
          </AlertDialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="sumSOL"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="SUM SOL"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="SOLPerUser"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        placeholder="SOL per user"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending || form.formState.isSubmitting || isPublishing}
            onClick={form.handleSubmit(onSubmit)}
          >
            Proceed {isPending && <FaSpinner className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;
