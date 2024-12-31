'use client';
import FormBuilder from '@/components/FormBuilder';
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Form } from '@/app/services/type';
import { getFormByOwner } from '@/app/services/form';
import Readme from '@/components/Readme';

export default function BuilderPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const [form, setForm] = useState<Form>(); // blockchain Form
  const { publicKey } = useWallet();
  useEffect(() => {
    async function getFormsFromServer() {
      if (!publicKey) {
        return;
      } else {
        try {
          const fetchedForm: Form | null = await getFormByOwner({
            id,
            ownerPubkey: publicKey.toString()
        });
          if (!fetchedForm) {
            throw new Error('form not found');
          }
          setForm(fetchedForm);
        } catch (error) {
          console.error('Error fetching stats:', error);
          return;
        }
      }
    }

    getFormsFromServer();
  }, [publicKey]);
  // return <FormBuilder form={form} />;
  return (
    <>
      {!publicKey && <Readme />}
      {publicKey && form != null && (
        <FormBuilder publicKey={publicKey?.toString()} form={form} />
      )}
    </>
  );
}
