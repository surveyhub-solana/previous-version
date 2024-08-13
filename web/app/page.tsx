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
import BN from 'bn.js';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense, useEffect, useState } from 'react';
import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { getAllForms } from './services/form';
import { Form } from './services/type';
import { Button } from '@/components/ui/button';
export default function Home() {
  return (
    <div className="container pt-4">
      <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

function FormCards() {
  const { publicKey } = useWallet();
  const [forms, setForms] = useState<Form[]>([]);
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
      {forms.map((form: Form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}

function FormCard({ form }: { form: Form }) {
  const createdAtTimestamp = parseInt(form.createdAt, 16) * 1000;
  const createdAtDate = new Date(createdAtTimestamp);
  const isValidDate = !isNaN(createdAtDate.getTime());
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
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
      <CardContent className="h-fit truncate text-sm text-muted-foreground">
        <div className="h-fit whitespace-pre-wrap break-words">
          {form.description.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
        <div className="text-sm font-medium text-muted-foreground pt-4">
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
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          Amount per respondent: {new BN(form.solPerUser, 16).toString()}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full mt-2 text-md gap-4">
          <Link href={`/submit/${form.id}`}>Fill Out Form</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
