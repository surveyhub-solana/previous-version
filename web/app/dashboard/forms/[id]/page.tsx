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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
// import {
//   getFormByOwner,
//   getFormWithSubmissions,
//   getStats,
// } from '@/app/services/form';
import {
  getFormByOwner,
  getFormWithSubmissions,
  getStats,
} from '@/action/form';
import { Form, FormSubmissions } from '@/app/services/type';
import BN from 'bn.js';
import {
  IFormSubmission,
  IFormSubmissionWithId,
  IFormWithId,
} from '@/lib/type';
import Readme from '@/components/Readme';
import Statistics from '@/components/data/Statistics';
import Answers from '@/components/data/Answers';
import Tools from '@/components/data/Tools';

export default function FormDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const { publicKey } = useWallet();
  const [form, setForm] = useState<IFormWithId>(); // blockchain
  const [stats, setStats] = useState({
    visits: 0,
    submissions: 0,
    submissionRate: 0,
    bounceRate: 0,
  });
  useEffect(() => {
    async function getFormFromServer() {
      if (!publicKey) return;

      try {
        const fetchedForm = await getFormByOwner(id, publicKey.toString());
        if (!fetchedForm) throw new Error('Form not found');
        setForm(fetchedForm);

        const fetchedStats = await getStats(publicKey.toString(), id);
        if (fetchedStats) setStats(fetchedStats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    getFormFromServer();
  }, [publicKey, id]);

  return (
    <>
      {!publicKey && <Readme />}
      {publicKey && form && (
        <>
          <div className="py-10 border-b border-muted">
            <div className="flex justify-between container">
              <h1 className="text-4xl font-bold truncate">{form.name}</h1>
              <VisitBtn shareUrl={form._id} />
            </div>
          </div>
          <div className="py-4 border-b border-muted">
            <div className="container flex gap-2 items-center justify-between">
              <FormLinkShare shareUrl={form._id} />
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

          {/* blockchain
           <div className="w-full flex py-6 container">
            <div className="w-fit ms-auto me-0 text-sm font-medium text-muted-foreground text-right">
              <div>
                Total {form.mint ? 'Token' : 'SOL'} used:{' '}
                {new BN(form.sumSol, 16).toString()}
              </div>
              <div>
                Remaining {form.mint ? 'Token' : 'SOL'}:{' '}
                {new BN(form.remainSol, 16).toString()}
              </div>
              <div>
                {form.mint ? 'Token' : 'SOL'} per respondent:{' '}
                {new BN(form.solPerUser, 16).toString()}
              </div>
            </div>
          </div> */}

          <div className="container">
            <SubmissionsTable publicKey={publicKey.toString()} id={id} />
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
  const [form, setForm] = useState<IFormWithId>();
  const [submissions, setSubmissions] = useState<IFormSubmissionWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true); // Bắt đầu tải dữ liệu
      try {
        const fetchedFormWithSubmissions = await getFormWithSubmissions(
          id,
          publicKey
        );
        if (!fetchedFormWithSubmissions) throw new Error('form not found');
        const result = fetchedFormWithSubmissions;
        if (result) {
          setForm(result.form);
          setSubmissions(result.submissions);
        }
        if (!result) return;
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
      // const formElements = JSON.parse(form.content) as FormElementInstance[];

      // formElements.forEach((element) => {
      //   switch (element.type) {
      //     case 'TextField':
      //     case 'NumberField':
      //     case 'TextAreaField':
      //     case 'DateField':
      //     case 'SelectField':
      //     case 'CheckboxField':
      //     case 'RadioField':
      //       setColumns((prevColumns) => [
      //         ...prevColumns,
      //         {
      //           id: element.id,
      //           label: element.extraAttributes?.label,
      //           required: element.extraAttributes?.required,
      //           type: element.type,
      //         },
      //       ]);
      //       break;
      //     default:
      //       break;
      //   }
      // });

      // submissions.forEach((submission: IFormSubmission) => {
      //   // blockchain : FormSubmissions
      //   const content = JSON.parse(submission.content);
      //   console.log(content);
      //   setRows((prevRows) => [
      //     ...prevRows,
      //     {
      //       wallet: submission.author,
      //       ...content,
      //       // submittedAt: parseInt(submission.createdAt, 16) * 1000, // blockchain
      //       submittedAt: submission.created_at,
      //     },
      //   ]);
      // });
    }
    fetchSubmissions();
  }, [publicKey, id]);
  return (
    form &&
    !loading && (
      <Tabs defaultValue="statistics" className="w-full py-5">
        <TabsList className="grid w-[600px] grid-cols-3 rounded-[0.5rem]">
          <TabsTrigger value="statistics" className="rounded-[0.5rem]">
            Statistics
          </TabsTrigger>
          <TabsTrigger value="answer" className="rounded-[0.5rem]">
            Answers
          </TabsTrigger>
          <TabsTrigger value="tools" className="rounded-[0.5rem]">
            Tools
          </TabsTrigger>
        </TabsList>
        <TabsContent value="statistics" className="w-full min-h-screen">
          <Statistics />
        </TabsContent>
        <TabsContent value="answer" className="w-full min-h-screen">
          <Answers form={form} submissions={submissions} />
        </TabsContent>
        <TabsContent value="tools" className="w-full min-h-screen">
          <Tools form={form} submissions={submissions} />
        </TabsContent>
      </Tabs>
    )
  );

  // return (
  //   <>
  //     <h1 className="text-2xl font-bold mb-4">Submissions</h1>
  //     <div className="rounded-md border">
  //       <Table className="w-max">
  //         <TableHeader>
  //           <TableRow>
  //             <TableHead className="uppercase max-w-[300px]">
  //               Wallet Address
  //             </TableHead>
  //             {columns.map((column) => (
  //               <TableHead key={column.id} className="uppercase max-w-[300px]">
  //                 {column.label}
  //               </TableHead>
  //             ))}
  //             <TableHead className="text-muted-foreground text-right uppercase">
  //               Submitted at
  //             </TableHead>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody>
  //           {rows.map((row, index) => (
  //             <TableRow key={index}>
  //               <TableCell>{row['wallet']}</TableCell>
  //               {columns.map((column) => (
  //                 <RowCell
  //                   key={column.id}
  //                   type={column.type}
  //                   value={row[column.id]}
  //                 />
  //               ))}
  //               <TableCell className="text-muted-foreground text-right">
  //                 {formatDistance(row.submittedAt, new Date(), {
  //                   addSuffix: true,
  //                 })}
  //               </TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </>
  // );
}

// function RowCell({ type, value }: { type: ElementsType; value: string }) {
//   let node: ReactNode = value;

//   switch (type) {
//     case 'DateField': {
//       if (!value) break;
//       const date = new Date(value);
//       node = <Badge variant={'outline'}>{format(date, 'dd/MM/yyyy')}</Badge>;
//       break;
//     }
//     // case 'CheckboxField': {
//     //   const checked = value === 'true';
//     //   node = <Checkbox checked={checked} disabled />;
//     // }
//   }

//   return <TableCell className=" max-w-[300px]">{node}</TableCell>;
// }
