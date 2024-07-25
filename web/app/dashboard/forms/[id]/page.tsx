"use client";
import GetFormStats, { GetForms, GetFormWithSubmissions } from "@/action/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import React, { ReactNode, useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useWallet } from "@solana/wallet-adapter-react";
import { Form, FormSubmissions } from "@prisma/client";

export default function FormDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const { publicKey } = useWallet();
  const [form, setForm] = useState<Form[]>([]);
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
          const fetchedForm = await GetForms(publicKey?.toString(), Number(id));
          if (!fetchedForm) {
            throw new Error("form not found");
          }
          setForm(fetchedForm);
          const statsCurrentForm = await GetFormStats(
            publicKey?.toString(),
            Number(id)
          );
          if (!statsCurrentForm) {
            throw new Error("form not found");
          }
          setStats(statsCurrentForm);
        } catch (error) {
          console.error("Error fetching stats:", error);
        }
      }
    }

    getFormFromServer();
  }, [publicKey]);
  // const form = await GetForms(Number(id));

  return (
    <>
      {!publicKey && <div>Bạn chưa đăng nhập ví</div>}
      {publicKey && form.length != 0 && (
        <>
          <div className="py-10 border-b border-muted">
            <div className="flex justify-between container">
              <h1 className="text-4xl font-bold truncate">{form[0].name}</h1>
              <VisitBtn shareUrl={form[0].shareURL} />
            </div>
          </div>
          <div className="py-4 border-b border-muted">
            <div className="container flex gap-2 items-center justify-between">
              <FormLinkShare shareUrl={form[0].shareURL} />
            </div>
          </div>
          <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
            <StatsCard
              title="Total visits"
              icon={<LuView className="text-blue-600" />}
              helperText="All time form visits"
              value={stats.visits.toLocaleString() || ""}
              loading={false}
              className="shadow-md shadow-blue-600"
            />

            <StatsCard
              title="Total submissions"
              icon={<FaWpforms className="text-yellow-600" />}
              helperText="All time form submissions"
              value={stats.submissions.toLocaleString() || ""}
              loading={false}
              className="shadow-md shadow-yellow-600"
            />

            <StatsCard
              title="Submission rate"
              icon={<HiCursorClick className="text-green-600" />}
              helperText="Visits that result in form submission"
              value={stats.submissionRate.toLocaleString() + "%" || ""}
              loading={false}
              className="shadow-md shadow-green-600"
            />

            <StatsCard
              title="Bounce rate"
              icon={<TbArrowBounce className="text-red-600" />}
              helperText="Visits that leaves without interacting"
              value={stats.bounceRate.toLocaleString() + "%" || ""}
              loading={false}
              className="shadow-md shadow-red-600"
            />
          </div>

          <div className="container pt-10">
            <SubmissionsTable
              publicKey={publicKey.toString()}
              id={form[0].id}
            />
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
  id: number;
}) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    async function fetchSubmissions() {
      const form = await GetFormWithSubmissions(publicKey, id);
      setColumns([]);
      setRows([]);
      if (!form) {
        throw new Error("form not found");
      }

      const formElements = JSON.parse(form.content) as FormElementInstance[];

      formElements.forEach((element) => {
        switch (element.type) {
          case "TextField":
          case "NumberField":
          case "TextAreaField":
          case "DateField":
          case "SelectField":
          case "CheckboxField":
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

      form.FormSubmissions.forEach((submission: FormSubmissions) => {
        const content = JSON.parse(submission.content);
        setRows((prevRows) => [
          ...prevRows,
          {
            ...content,
            submittedAt: submission.createdAt,
          },
        ]);
      });
    }
    fetchSubmissions();
  }, [publicKey, id]);

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
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
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}
