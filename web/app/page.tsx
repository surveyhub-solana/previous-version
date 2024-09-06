'use client';
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import BN from 'bn.js';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense, useEffect, useState } from 'react';
import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
// import { getAllForms } from './services/form';
import { getAllForms } from '@/action/form';
import { Form } from './services/type';
import { Button } from '@/components/ui/button';
import { IForm, IFormWithId } from '@/lib/type';
import Readme from '@/components/Readme';
export default function Home() {
  const { publicKey } = useWallet();
  return (
    <>
      {publicKey !== null ? (
        <div className="container pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense
              fallback={
                <div>
                  {[1, 2, 3, 4].map((el) => (
                    <FormCardSkeleton key={el} />
                  ))}
                </div>
              }
            >
              <FormCards />
            </Suspense>
          </div>
        </div>
      ) : (
        <Readme />
      )}
    </>
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

function FormCards() {
  const { publicKey } = useWallet();
  const [forms, setForms] = useState<IFormWithId[]>([]); // blockchain là <Form[]>
  const [selectedForm, setSelectedForm] = useState<IFormWithId | null>(null);
  const [open, setOpen] = useState(false); // Trạng thái chung cho AlertDialog
  const handleOpenDialog = (form: IFormWithId) => {
    setSelectedForm(form);
    setOpen(true);
  };
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);
  useEffect(() => {
    async function getFormsFromServer() {
      if (!publicKey) {
        return;
      }

      try {
        const fetchedForms = await getAllForms();
        console.log(fetchedForms);
        if (fetchedForms) setForms(fetchedForms);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    getFormsFromServer();
  }, [publicKey]);
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form._id} form={form} onOpenDialog={handleOpenDialog} /> // blockchain form.id
      ))}
      {selectedForm && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedForm.name}</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                {new Date(selectedForm.created_at).toLocaleString()}
              </AlertDialogDescription>
              <AlertDialogDescription className="whitespace-pre-line">
                {selectedForm.description}
              </AlertDialogDescription>
              <AlertDialogDescription className="whitespace-pre-line">
                <div>Visits: {selectedForm.visits}</div>
                <div>Submissions: {selectedForm.submissions}</div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => setOpen(false)}>
                <Link href={`${origin}/submit/${selectedForm._id}`}>
                  Fill Out Form
                </Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
//form: Form
function FormCard({
  form,
  onOpenDialog,
}: {
  form: IFormWithId;
  onOpenDialog: (form: IFormWithId) => void;
}) {
  // const createdAtTimestamp = parseInt(form.createAt, 16) * 1000; -- blockchain
  const createdAtTimestamp = form.created_at;
  const createdAtDate = new Date(createdAtTimestamp);
  const isValidDate = !isNaN(createdAtDate.getTime());
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between text-base">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {isValidDate
            ? formatDistance(createdAtDate, new Date(), {
                addSuffix: true,
              })
            : 'Ngày không hợp lệ'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 truncate text-sm text-muted-foreground">
        <div className="h-[24px] whitespace-pre-line line-clamp-1 break-words">
          {form.description}
        </div>
        <div
          onClick={() => onOpenDialog(form)}
          className="underline cursor-pointer"
        >
          Details
        </div>
        {/* <div className="text-sm font-medium text-muted-foreground pt-4">
          Token:{' '}
          {form.mint ? (
            <Link
              href={`https://explorer.solana.com/address/${form.mint.toString()}?cluster=devnet`}
              className="underline"
            >
              {form.mint.toString()}
            </Link>
          ) : (
            'SOL'
          )}
        </div> */}
        {/* blockchain */}
        {/* <div className="text-sm font-medium text-muted-foreground">
          Amount per respondent: {new BN(form.solPerUser, 16).toString()}
        </div> */}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full mt-2 text-md gap-4">
          <Link href={`/submit/${form._id}`}>Fill Out Form</Link>
        </Button>
      </CardFooter>
    </Card>
  );
  // blockchain form.id
}
