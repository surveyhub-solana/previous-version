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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { updateFormSchema, updateFormSchemaType } from '@/schemas/form';
import { publishForm, updateFormSOL } from '@/app/services/form';
// import { publishForm } from '@/action/form';

function PublishFormBtn({ id, publicKey }: { id: string; publicKey: string }) {
  const [isPending] = useTransition();
  const [isPublishing, setIsPublishing] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
  const form = useForm<updateFormSchemaType>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      sumSOL: '1',
      SOLPerUser: '1',
      tokenAddress: '',
      checkAdvanced: false, // default to false
    },
  });

  async function onSubmit(values: updateFormSchemaType) {
    const f_values: {
      sumSOL: number;
      SOLPerUser: number;
    } = { sumSOL: 0, SOLPerUser: 0 };
    f_values.sumSOL = parseFloat(values.sumSOL);
    f_values.SOLPerUser = parseFloat(values.SOLPerUser);
    setIsPublishing(true);
    try {
      if (!publicKey) {
        toast({
          title: 'Error',
          description: 'You are not logged in to the wallet',
        });
        return;
      }

      if (f_values.sumSOL >= 0 && f_values.SOLPerUser >= 0) {
        if (f_values.sumSOL !== 0 && f_values.SOLPerUser !== 0) {
          const transactionAndId = await updateFormSOL({
            id: id,
            sum_sol: f_values.sumSOL,
            sol_per_user: f_values.SOLPerUser,
            token_address: values.tokenAddress || '',
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
              toast({
                title: 'Success',
                description: 'Form updated successfully',
              });
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
              } else {
                toast({
                  title: 'Error',
                  description: 'Errors when publishing forms',
                });
              }
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
        <Button className="gap-2" variant={'outline'}>
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
              By publishing this form you will make it available to the public
              and you will be able to collect submissions.
            </span>
          </AlertDialogDescription>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="sumSOL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      The total number of Token used for this form is (SOL is
                      default):
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        step="any"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
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
                    <FormLabel>
                      The number of Token each respondent receives is (SOL is
                      default):
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        step="any"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkAdvanced"
                render={({ field }) => (
                  <FormItem className="items-center flex pt-2">
                    <FormControl className="items-center flex justify-center">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        ref={field.ref}
                        className="checkbox" // Ensure you have the right class for styling
                      />
                    </FormControl>
                    <FormLabel className="h-full flex items-center no-margin-top ps-1">
                      Advanced
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('checkAdvanced') && (
                <FormField
                  control={form.control}
                  name="tokenAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Address (Optional):</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder="Enter a valid Solana address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
