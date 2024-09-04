'use client';
import { useEffect, useState } from 'react';
// import { getForm } from '@/app/services/form';
import { getForm } from '@/action/form';
import { FormElementInstance } from '@/components/FormElements';
import FormSubmitComponent from '@/components/FormSubmitComponent';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import Readme from '@/components/Readme';

function SubmitPage({
  params,
}: {
  params: {
    formUrl: string;
  };
}) {
  const { publicKey } = useWallet();
  const [formContent, setFormContent] = useState<FormElementInstance[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const form = await getForm(params.formUrl);
        if (!form) {
          throw new Error('form not found');
        }
        setFormContent(JSON.parse(form.content) as FormElementInstance[]);
      } catch (error) {
        setError(String(error));
      }
    };

    if (publicKey) {
      fetchForm();
    }
  }, [publicKey, params.formUrl]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {!publicKey && <Readme />}
      {publicKey && formContent && (
        <FormSubmitComponent
          formUrl={params.formUrl}
          content={formContent}
          author={publicKey.toString()}
        />
      )}
    </>
  );
}

export default SubmitPage;
