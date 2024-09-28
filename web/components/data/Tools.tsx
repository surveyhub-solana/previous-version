import { IFormSubmissionWithId, IFormWithId } from '@/lib/type';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormElementInstance, LayoutElements } from '../FormElements';
import { toSnakeCase } from '@/lib/utils';

export default function Tools({
  form,
  submissions,
}: {
  form: IFormWithId;
  submissions: IFormSubmissionWithId[];
}) {
  const formElements = JSON.parse(form.content) as FormElementInstance[];

  const onHandleExport = () => {
    const worksheet: XLSX.WorkSheet = {};

    // Định nghĩa header
    const header = [
      { label: 'Index', id: 0 },
      ...formElements
        .filter((element) => !LayoutElements.includes(element.type))
        .map((element) => {
          return { label: element.extraAttributes?.label, id: element.id };
        }),
      { label: 'Owner', id: 1 },
    ];

    // Ghi tiêu đề vào hàng đầu tiên
    header.forEach((element, index) => {
      const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 });
      worksheet[cellAddress] = {
        v: element.label,
        s: {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '0070C0' } },
          alignment: { horizontal: 'center' },
        },
      };
    });

    // Ghi dữ liệu vào các hàng tiếp theo
    submissions.forEach((submission, rowIndex) => {
      const submissionContent = JSON.parse(submission.content);
      header.forEach((value, colIndex) => {
        let cellValue;

        if (value.id === 0) {
          cellValue = rowIndex + 1;
        } else if (value.id === 1) {
          cellValue = submission.author;
        } else {
          let content = submissionContent[value.id];
          if (
            typeof content === 'string' &&
            content.trim().startsWith('[') &&
            content.trim().endsWith(']')
          ) {
            try {
              content = JSON.parse(content);
            } catch (error) {
              console.error(
                `Error parsing JSON for field ID ${value.id}:`,
                error
              );
            }
          }
          cellValue = content;
        }

        const cellAddress = XLSX.utils.encode_cell({
          c: colIndex,
          r: rowIndex + 1,
        });
        worksheet[cellAddress] = { v: cellValue };
      });
    });

    // Xác định phạm vi của worksheet
    const range = {
      s: { c: 0, r: 0 },
      e: { c: header.length - 1, r: submissions.length },
    };
    worksheet['!ref'] = XLSX.utils.encode_range(range);

    // Tạo workbook và lưu tệp Excel
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Answers(Câu trả lời)');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/octet-stream', // Có thể cải thiện bằng cách sử dụng MIME type chính xác
    });
    saveAs(dataBlob, `${toSnakeCase(form.name)}.xlsx`);
    console.log(header.length);
  };

  return (
    <div className="min-h-80vh w-full rounded-[0.5rem] bg-secondary p-3">
      <Button onClick={onHandleExport}>Export</Button>
    </div>
  );
}
