"use client";
import { GetForms } from "@/action/form";
import FormBuilder from "@/components/FormBuilder";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Form } from "@prisma/client";

export default function BuilderPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const [form, setForm] = useState<Form[]>([]);
  const { publicKey } = useWallet();
  useEffect(() => {
    async function getFormsFromServer() {
      if (!publicKey) {
        return;
      } else {
        try {
          const fetchedForm = await GetForms(publicKey?.toString(), Number(id));
          if (!fetchedForm) {
            throw new Error("form not found");
          }
          console.log(fetchedForm);
          setForm(fetchedForm);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }
    }

    getFormsFromServer();
  }, [publicKey]);
  // return <FormBuilder form={form} />;
  return (
    <>
      {!publicKey && <div>Bạn chưa đăng nhập ví</div>}
      {publicKey && form.length != 0 && (
        <FormBuilder publicKey={publicKey?.toString()} form={form[0]} />
      )}
    </>
  );
}
