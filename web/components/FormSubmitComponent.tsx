'use client';

import React, { useCallback, useRef, useState, useTransition } from 'react';
import { FormElementInstance, FormElements } from './FormElements';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';
import { toast } from './ui/use-toast';
import { ImSpinner2 } from 'react-icons/im';
// import { submitForm } from '@/app/services/form';
import { submitForm } from '@/action/form';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { NODE_URL, DEFAULT_COMMITMENT } from '@/config/anchor/constants';

function FormSubmitComponent({
  formUrl,
  content,
  author,
}: {
  content: FormElementInstance[];
  formUrl: string;
  author: string;
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const wallet: WalletContextState = useWallet();
  const connection = new Connection(NODE_URL, DEFAULT_COMMITMENT);

  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || '';
      const valid = FormElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }

    return true;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitFormHandle = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: 'Error',
        description: 'please check the form for errors',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (!author || !wallet) {
        toast({
          title: 'Error',
          description: 'You are not logged in to the wallet',
        });
      } else {
        const jsonContent = JSON.stringify(formValues.current);
        // const transactionAndId = await submitForm({
        //   id: formUrl,
        //   content: jsonContent,
        //   authorPubkey: author,
        // });
        // if (!transactionAndId)
        //   toast({
        //     title: 'Error',
        //     description: 'Something went wrong',
        //     variant: 'destructive',
        //   });
        // else {
        //   console.log(transactionAndId.id);
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
        //       description: 'Form submitted successfully',
        //     });
        //     setSubmitted(true);
        //   }
        // }
        const submitSuccess = await submitForm(formUrl, jsonContent, author);
        if (!submitSuccess) {
          toast({
            title: 'Error',
            description: 'Failed to submit form. Please try again.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Form submitted successfully.',
          });
        }

      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: String(error),
        variant: 'destructive',
      });
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
          <h1 className="text-2xl font-bold">Form submitted</h1>
          <p className="text-muted-foreground">
            Thank you for submitting the form, you can close this page now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded"
      >
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8"
          onClick={() => {
            startTransition(submitFormHandle);
          }}
          disabled={pending}
        >
          {!pending && (
            <>
              <HiCursorClick className="mr-2" />
              Submit
            </>
          )}
          {pending && <ImSpinner2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}

export default FormSubmitComponent;
