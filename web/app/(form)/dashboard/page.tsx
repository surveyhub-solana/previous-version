'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense, useEffect, useState, useTransition } from 'react';
import { LuView } from 'react-icons/lu';
import { FaEdit, FaSpinner, FaTrash } from 'react-icons/fa';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';
import { BiRightArrowAlt } from 'react-icons/bi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Separator } from '@/components/ui/separator';
import CreateFormBtn from '@/components/CreateFormBtn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import StatsCard from '@/components/StatsCard';
import { getOwnForms, getStats, deleteForm } from '../../services/form';
import { Form } from '../../services/type';
import { toast } from '@/components/ui/use-toast';
import Readme from '@/components/Readme';
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

export default function Home() {
  const wallet = useWallet();
  if (!wallet) return <Readme />;
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
        <CreateFormBtn />
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

function CardStatsWrapper() {
  const { publicKey } = useWallet();
  const [stats, setStats] = useState({
    visits: 0,
    submissions: 0,
    submissionRate: 0,
    bounceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!publicKey) {
        setLoading(false);
        return;
      }

      try {
        const fetchedStats = await getStats(publicKey?.toString());
        if (fetchedStats) setStats(fetchedStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [publicKey]);

  return <StatsCards loading={loading} data={stats} />;
}
interface StatsCardProps {
  data?: {
    visits: number;
    submissions: number;
    submissionRate: number;
    bounceRate: number;
  };
  loading: boolean;
}

function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time form visits"
        value={data?.visits.toLocaleString() || ''}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time form submissions"
        value={data?.submissions.toLocaleString() || ''}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="Submission rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visits that result in form submission"
        value={data?.submissionRate.toLocaleString() + '%' || ''}
        loading={loading}
        className="shadow-md shadow-green-600"
      />

      <StatsCard
        title="Bounce rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visits that leaves without interacting"
        value={data?.bounceRate.toLocaleString() + '%' || ''}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

function FormCards() {
  const { publicKey } = useWallet();
  const [forms, setForms] = useState<Form[]>([]); // blockchain <Form[]>
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [open, setOpen] = useState(false); // Trạng thái chung cho AlertDialog
  const handleOpenDialog = (form: Form) => {
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
        const fetchedForms = await getOwnForms(publicKey?.toString());
        if (fetchedForms) setForms(fetchedForms);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    getFormsFromServer();
  }, [publicKey]);
  return (
    // blockchain form.id
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} onOpenDialog={handleOpenDialog} />
      ))}
      {selectedForm && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedForm.name}</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                {new Date(selectedForm.createdAt).toLocaleString()}
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
                <Link href={`${origin}/submit/${selectedForm.id}`}>
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
// blockchain form: Form
function FormCard({
  form,
  onOpenDialog,
}: {
  form: Form;
  onOpenDialog: (form: Form) => void;
}) {
  const createdAtTimestamp = parseInt(form.createdAt, 16) * 1000; // blockchain
  const createdAtDate = new Date(createdAtTimestamp);
  const isValidDate = !isNaN(createdAtDate.getTime());
  const [loading, startTransition] = useTransition();
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const wallet = useWallet();
  const handleDeleteForm = async () => {
    try {
      if (!publicKey || !wallet) {
        toast({
          title: 'Error',
          description: 'You are not logged in to the wallet',
        });
        return;
      }
      // blockchain
      const tx = await deleteForm({
        id: form.id,
        ownerPubkey: publicKey?.toString(),
      });
      if (tx) {
        // Ký giao dịch bằng ví của người dùng (ở phía client)
        if (wallet.signTransaction) {
          // Ký giao dịch bằng ví của người dùng (ở phía client)
          const signedTx = await wallet.signTransaction(tx);

          // Phát sóng giao dịch lên mạng Solana
          const txId = await connection.sendRawTransaction(
            signedTx.serialize()
          );
          toast({
            title: 'Success',
            description: 'Form deleted successfully',
          });
        } else {
          console.error('Wallet does not support signing transactions');
          toast({
            title: 'Error',
            description: 'Wallet does not support signing transactions',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Error',
          description: 'Error initiating a transaction from the server',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong, please try again later',
        variant: 'destructive',
      });
    }
  };
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between text-base">
          <span className="truncate font-bold">{form.name}</span>
          {form.published ? (
            <Badge>Published</Badge>
          ) : (
            <Badge variant="destructive">Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {isValidDate
            ? formatDistance(createdAtDate, new Date(), {
                addSuffix: true,
              })
            : 'Ngày không hợp lệ'}
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 truncate text-sm text-muted-foreground">
        <div className="h-[20px] whitespace-pre-line line-clamp-1">
          {form.description}
        </div>
        <div
          onClick={() => onOpenDialog(form)}
          className="underline cursor-pointer"
        >
          Details
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        {form.published ? (
          <Button asChild className="w-full text-md gap-4">
            <Link href={`dashboard/forms/${form.id}`}>
              View submissions <BiRightArrowAlt />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="secondary" className="w-full text-md gap-4">
            <Link href={`dashboard/builder/${form.id}`}>
              Edit form <FaEdit />
            </Link>
          </Button>
        )}
        <Button
          onClick={() => startTransition(handleDeleteForm)}
          variant="destructive"
          className="w-fit text-md gap-4"
        >
          {!loading ? <FaTrash /> : <FaSpinner className="animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  );
}
