'use client';
import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import React, { ReactNode, useEffect, useState } from 'react';
import StatsCard from '@/components/StatsCard';
import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';
import { ElementsType, FormElementInstance } from '@/components/FormElements';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, formatDistance } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  getFormByOwner,
  getFormWithSubmissions,
  getStats,
} from '@/app/services/form';
import { Form, FormSubmissions } from '@/app/services/type';
import BN from 'bn.js';

export default function FormDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const { publicKey } = useWallet();
  const [form, setForm] = useState<Form>();
  const [stats, setStats] = useState({
    visits: 0,
    submissions: 0,
    submissionRate: 0,
    bounceRate: 0,
  });
  useEffect(() => {
    async function getFormFromServer() {
      if (!publicKey) {
        return;
      } else {
        try {
          try {
            const fetchedForm: Form | null = await getFormByOwner({
              id: id,
              ownerPubkey: publicKey.toString(),
            });
            if (!fetchedForm) {
              throw new Error('form not found');
            }
            setForm(fetchedForm);
          } catch (error) {
            console.error('Error fetching stats:', error);
            return;
          }
          try {
            const fetchedStats = await getStats(publicKey?.toString());
            if (fetchedStats) setStats(fetchedStats);
          } catch (error) {
            console.error('Error fetching stats:', error);
            return;
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    }

    getFormFromServer();
  }, [publicKey]);

  return (
    <>
      {!publicKey && <div>Bạn chưa đăng nhập ví</div>}
      {publicKey && form && (
        <>
          <div className="py-10 border-b border-muted">
            <div className="flex justify-between container">
              <h1 className="text-4xl font-bold truncate">{form.name}</h1>
              <VisitBtn shareUrl={form.id} />
            </div>
          </div>
          <div className="py-4 border-b border-muted">
            <div className="container flex gap-2 items-center justify-between">
              <FormLinkShare shareUrl={form.id} />
            </div>
          </div>
          <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
            <StatsCard
              title="Total visits"
              icon={<LuView className="text-blue-600" />}
              helperText="All time form visits"
              value={stats.visits.toLocaleString() || ''}
              loading={false}
              className="shadow-md shadow-blue-600"
            />

            <StatsCard
              title="Total submissions"
              icon={<FaWpforms className="text-yellow-600" />}
              helperText="All time form submissions"
              value={stats.submissions.toLocaleString() || ''}
              loading={false}
              className="shadow-md shadow-yellow-600"
            />

            <StatsCard
              title="Submission rate"
              icon={<HiCursorClick className="text-green-600" />}
              helperText="Visits that result in form submission"
              value={stats.submissionRate.toLocaleString() + '%' || ''}
              loading={false}
              className="shadow-md shadow-green-600"
            />

            <StatsCard
              title="Bounce rate"
              icon={<TbArrowBounce className="text-red-600" />}
              helperText="Visits that leaves without interacting"
              value={stats.bounceRate.toLocaleString() + '%' || ''}
              loading={false}
              className="shadow-md shadow-red-600"
            />
          </div>

          <div className="w-full flex py-6 container">
            <div className="w-fit ms-auto me-0 text-sm font-medium text-muted-foreground text-right">
              <div>
                Total lamports used: {new BN(form.sumSol, 16).toString()}
              </div>
              <div>
                Remaining lamports: {new BN(form.remainSol, 16).toString()}
              </div>
              <div>
                Lamports per respondent:{' '}
                {new BN(form.solPerUser, 16).toString()}
              </div>
            </div>
          </div>

          <div className="container">
            <SubmissionsTable publicKey={publicKey.toString()} id={form.id} />
          </div>
        </>
      )}
    </>
  );
}

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

type Column = {
  id: string;
  label: string;
  required: boolean;
  type: ElementsType;
};

function SubmissionsTable({
  publicKey,
  id,
}: {
  publicKey: string;
  id: string;
}) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    async function fetchSubmissions() {
      const fetchedFormWithSubmissions = await getFormWithSubmissions({
        id,
        ownerPubkey: publicKey,
      });
      if (!fetchedFormWithSubmissions) throw new Error('form not found');
      const { form, submissions } = fetchedFormWithSubmissions;
      setColumns([]);
      setRows([]);

      const formElements = JSON.parse(form.content) as FormElementInstance[];

      formElements.forEach((element) => {
        switch (element.type) {
          case 'TextField':
          case 'NumberField':
          case 'TextAreaField':
          case 'DateField':
          case 'SelectField':
          case 'CheckboxField':
            setColumns((prevColumns) => [
              ...prevColumns,
              {
                id: element.id,
                label: element.extraAttributes?.label,
                required: element.extraAttributes?.required,
                type: element.type,
              },
            ]);
            break;
          default:
            break;
        }
      });

      submissions.forEach((submission: FormSubmissions) => {
        const content = JSON.parse(submission.content);
        setRows((prevRows) => [
          ...prevRows,
          {
            ...content,
            submittedAt: parseInt(submission.createdAt, 16) * 1000,
          },
        ]);
      });
    }
    fetchSubmissions();
  }, [publicKey, id]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case 'DateField': {
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={'outline'}>{format(date, 'dd/MM/yyyy')}</Badge>;
      break;
    }
    case 'CheckboxField': {
      const checked = value === 'true';
      node = <Checkbox checked={checked} disabled />;
      break;
    }
  }

  return <TableCell>{node}</TableCell>;
}
