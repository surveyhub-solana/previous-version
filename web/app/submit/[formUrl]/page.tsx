'use client';
import { useEffect, useState } from 'react';
// import { getForm } from '@/app/services/form';
import { getForm } from '@/action/form';
import { FormElementInstance } from '@/components/FormElements';
import FormSubmitComponent from '@/components/FormSubmitComponent';
import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import Readme from '@/components/Readme';
import { IFormWithId } from '@/lib/type';
import ThankYouForSubmission from '@/components/ThankYouForSubmission';

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
  const [form, setForm] = useState<IFormWithId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        if (publicKey) {
          const data = await getForm(params.formUrl, publicKey?.toString());
          if (data == false) {
            throw new Error('form not found');
          } else if (data == true) {
            setSubmitted(true);
          } else {
            setForm(data);
            setFormContent(JSON.parse(data.content) as FormElementInstance[]);
          }
        }
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
      {submitted && <ThankYouForSubmission/>}
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
