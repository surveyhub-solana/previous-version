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
import { Suspense, useEffect, useState } from 'react';
import { LuView } from 'react-icons/lu';
import { FaEdit } from 'react-icons/fa';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';
import { BiRightArrowAlt } from 'react-icons/bi';
import { useWallet } from '@solana/wallet-adapter-react';
import { Separator } from '@/components/ui/separator';
import CreateFormBtn from '@/components/CreateFormBtn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import StatsCard from '@/components/StatsCard';
import { getOwnForms, getStats } from '../services/form';
import { Form } from '../services/type';

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  const [forms, setForms] = useState<Form[]>([]);
  useEffect(() => {
    async function getFormsFromServer() {
      if (!publicKey) {
        return;
      }

      try {
        const fetchedForms = await getOwnForms(publicKey?.toString());
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
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant={'destructive'}>Draft</Badge>}
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
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || 'No description'}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`dashboard/forms/${form.id}`}>
              View submissions <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button
            asChild
            variant={'secondary'}
            className="w-full mt-2 text-md gap-4"
          >
            <Link href={`dashboard/builder/${form.id}`}>
              Edit form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
