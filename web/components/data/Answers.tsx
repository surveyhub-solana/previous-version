import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Input } from '../ui/input';
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from '../FormElements';
import { Label } from '../ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '../ui/use-toast';
import { FormSubmissions, Form } from '@/app/services/type';

export default function Answers({
  form,
  submissions,
}: {
  form: Form;
  submissions: FormSubmissions[];
}) {
  const [no, setNo] = useState(1);
  const [formContent, setFormContent] = useState(() => {
    if (submissions.length === 0) return [];
    return JSON.parse(submissions[0].content);
  });
  const [address, setAddress] = useState(() => {
    if (submissions.length === 0) return '';
    return submissions[0].author;
  });
  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sử dụng useEffect để load lại formContent mỗi khi no thay đổi
  useEffect(() => {
    if (no >= 1 && no <= submissions.length) {
      const newFormContent = JSON.parse(submissions[no - 1].content);
      setFormContent(newFormContent);
      setAddress(submissions[no - 1].author);
    }
  }, [no, submissions]);

  return (
    <div className="w-full h-full rounded-[0.5rem] bg-secondary p-3">
      {submissions.length == 0 ? (
        <div className="py-12 flex items-center justify-center">
          <h1 className="text-2xl font-bold">No submissions yet</h1>
        </div>
      ) : (
        <div>
          <div className="flex max-w-[200px]">
            <div>
              <Button
                variant={'ghost'}
                className="rounded-full"
                disabled={no <= 1}
                onClick={() => setNo((prevNo) => prevNo - 1)} // Đảm bảo giảm no
              >
                <FaArrowLeft />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Input
                type="number"
                value={no}
                onChange={(e) => {
                  const newNo = parseInt(e.target.value);
                  setNo(newNo);
                }}
                className="border-b-2 border-b-slate-500 border-t-0 border-r-0 border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent flex items-center justify-center text-right"
                max={submissions.length}
                min={1}
                step={1}
              />
            </div>
            <div className="flex items-center justify-center">/</div>
            <div className="flex-1 flex items-center justify-center">
              {submissions.length}
            </div>
            <div>
              <Button
                variant={'ghost'}
                className="rounded-full"
                disabled={no >= submissions.length}
                onClick={() => setNo((prevNo) => prevNo + 1)} // Đảm bảo tăng no
              >
                <FaArrowRight />
              </Button>
            </div>
          </div>
          <div
            key={`${formContent}-${no}`}
            className="w-full py-4 flex items-center justify-center"
          >
            <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
              {formElements.map((element) => {
                const FormComponent =
                  FormElements[element.type].answerComponent;
                let answers = formContent[element.id];
                if (
                  typeof answers === 'string' &&
                  answers.trim().startsWith('[') &&
                  answers.trim().endsWith(']')
                ) {
                  try {
                    answers = JSON.parse(answers); // Parse JSON nếu đúng là chuỗi JSON của mảng
                  } catch (e) {
                    // Nếu parse thất bại, giữ nguyên answers
                  }
                }

                if (!Array.isArray(answers)) {
                  answers = [answers];
                }

                return (
                  <FormComponent
                    key={`${element.id}-${no}-${JSON.stringify(answers)}`} // Thêm answers vào key
                    elementInstance={element}
                    answers={answers}
                  />
                );
              })}
              <div className="flex flex-col gap-2 w-full">
                <Label className="leading-relaxed">Wallet Address:</Label>
                <Input
                  value={address.toString()}
                  type="text"
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="ms-auto me-0 flex">
                      Accept
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Duyệt đơn</DialogTitle>
                      <DialogDescription>
                        Tính năng này chỉ dùng trong phiên bản Beta bởi nhà phát
                        triển để thuận tiện trong quá trình sản xuất. Vì vậy nếu
                        không có quyền truy cập vui lòng bỏ qua tính năng này.
                        Xin cảm ơn!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="wallet" className="text-right">
                          Wallet
                        </Label>
                        <Input
                          id="wallet"
                          value={address.toString()}
                          className="col-span-3"
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="code" className="text-right">
                          Access code
                        </Label>
                        <Input
                          id="code"
                          className="col-span-3"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        disabled={submitting}
                        onClick={async () => {
                          setSubmitting(true);
                          try {
                            const response = await fetch(
                              '/api/accept-submission',
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  address,
                                  code,
                                }),
                              }
                            );
                            const data = await response.json();

                            if (response.ok) {
                              toast({
                                title: 'Success',
                                description: 'Transferred tokens to users',
                              });
                            } else {
                              // Trả về thông tin chi tiết lỗi từ server nếu có
                              toast({
                                title: 'Error',
                                description: 'Something went wrong',
                              });
                              throw new Error(
                                data.error || 'Something went wrong'
                              );
                            }
                          } catch (error) {
                            if (error instanceof Error)
                              console.log(error.message);
                            else console.log(String(error));
                            return null;
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="flex max-w-[200px] ms-auto me-0">
            <div>
              <Button
                variant={'ghost'}
                className="rounded-full"
                disabled={no <= 1}
                onClick={() => setNo((prevNo) => prevNo - 1)} // Đảm bảo giảm no
              >
                <FaArrowLeft />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Input
                type="number"
                value={no}
                onChange={(e) => {
                  const newNo = parseInt(e.target.value);
                  setNo(newNo);
                }}
                className="border-b-2 border-b-slate-500 border-t-0 border-r-0 border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent flex items-center justify-center text-right"
                max={submissions.length}
                min={1}
                step={1}
              />
            </div>
            <div className="flex items-center justify-center">/</div>
            <div className="flex-1 flex items-center justify-center">
              {submissions.length}
            </div>
            <div>
              <Button
                variant={'ghost'}
                className="rounded-full"
                disabled={no >= submissions.length}
                onClick={() => setNo((prevNo) => prevNo + 1)} // Đảm bảo tăng no
              >
                <FaArrowRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
