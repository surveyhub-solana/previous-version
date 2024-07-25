import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContent } from "@/action/form";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";
import { useWallet } from "@solana/wallet-adapter-react";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const { publicKey } = useWallet();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      if (!publicKey) {
        toast({
          title: "Error",
          description: "You are not logged in to the wallet",
        });
      } else {
        await UpdateFormContent(publicKey?.toString(), id, jsonElements);
        toast({
          title: "Success",
          description: "Your form has been saved",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <HiSaveAs className="h-4 w-4" />
      Save
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
