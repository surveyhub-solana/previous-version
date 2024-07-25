"use client";

import { PublishForm, UpdateForm } from "@/action/form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlinePublish } from "react-icons/md";
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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { getAuthorBalance, transferSOLToSystem } from "@/lib/solana";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateFormSchema, updateFormSchemaType } from "@/schemas/form";

function PublishFormBtn({ id, publicKey }: { id: number; publicKey: string }) {
  const [isPending, startTransition] = useTransition();
  const [isPublishing, setIsPublishing] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter(); // useRouter phải được đặt trong thành phần React
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
          title: "Error",
          description: "You are not logged in to the wallet",
        });
        return;
      }

      const authorSOL = await getAuthorBalance(connection, wallet);
      console.log("Author SOL balance:", authorSOL);

      if (values.sumSOL >= 0 && values.SOLPerUser >= 0) {
        if (authorSOL >= values.sumSOL) {
          if (values.sumSOL !== 0 && values.SOLPerUser !== 0) {
            const resultTransfer = await transferSOLToSystem(
              connection,
              wallet,
              values.sumSOL
            );

            if (!resultTransfer.success) {
              toast({
                title: "Error",
                description: resultTransfer.message,
              });
              return;
            }
          }

          const formId = await UpdateForm(publicKey, id, values);

          if (formId === id) {
            await PublishForm(publicKey, id);
            toast({
              title: "Success",
              description: "Your form is now available to the public",
            });
            window.location.href = `/dashboard/builder/${id}`;
          } else {
            toast({
              title: "Error",
              description: "Something went wrong, please try again later",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Error",
            description: "Not enough SOL balance",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Invalid parameter",
        });
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
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
