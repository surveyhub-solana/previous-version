"use client";
import FormBuilder from "@/components/FormBuilder";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Form } from "@/app/services/type";
import { getForm } from "@/app/services/form";

export default function BuilderPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  const [form, setForm] = useState<Form>();
  const { publicKey } = useWallet();
  useEffect(() => {
    async function getFormsFromServer() {
      if (!publicKey) {
        return;
      } else {
        try {
          const fetchedForm: Form | null = await getForm(id);
          if (!fetchedForm) {
            throw new Error("form not found");
          }
          setForm(fetchedForm);
        } catch (error) {
          console.error("Error fetching stats:", error);
          return
        }
      }
    }

    getFormsFromServer();
  }, [publicKey]);
  // return <FormBuilder form={form} />;
  return (
    <>
      {!publicKey && <div>Bạn chưa đăng nhập ví</div>}
      {publicKey && form != null && (
        <FormBuilder publicKey={publicKey?.toString()} form={form} />
      )}
    </>
  );
}
