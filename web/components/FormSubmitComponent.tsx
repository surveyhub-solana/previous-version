'use client';

import React, { useCallback, useRef, useState, useTransition } from 'react';
import {
  checkValidSection,
  FormElementInstance,
  FormElements,
} from './FormElements';
import { Button } from './ui/button';
import { HiCursorClick } from 'react-icons/hi';
import { toast } from './ui/use-toast';
import { ImSpinner2 } from 'react-icons/im';
import { submitForm } from '@/app/services/form';
// import { submitForm } from '@/action/form';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { NODE_URL, DEFAULT_COMMITMENT } from '@/config/anchor/constants';

function FormSubmitComponent({
  formUrl,
  content,
  author,
}: {
  content: FormElementInstance[];
  formUrl: string;
  author: string;
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const wallet: WalletContextState = useWallet();
  const connection = new Connection(NODE_URL, DEFAULT_COMMITMENT);
  const [commonLayout, setCommonLayout] = useState<FormElementInstance[]>(
    () => {
      const elements = [...content];
      // Nếu 2 cái section trở lên mới là common còn 1 cái thì sẽ lưu toàn bộ ở section
      if (
        elements.filter((element) => element.type == 'SectionField').length > 1
      ) {
        const firstNotLayoutElement =
          elements.findIndex(
            (element, index) => !checkValidSection(elements, index)
          ) - 1;
        return elements.slice(0, firstNotLayoutElement);
      }
      return [];
    }
  );
  const [section, setSection] = useState<FormElementInstance[]>(() => {
    const elements = [...content];
    if (content.length < 1) return content;
    if (
      elements.filter((element) => element.type == 'SectionField').length < 1
    ) {
      return elements;
    } else if (
      elements.filter((element) => element.type == 'SectionField').length == 1
    ) {
      const firstSectionIndex = elements.findIndex(
        (element) => element.type == 'SectionField'
      );
      return elements.splice(firstSectionIndex, 1);
    } else {
      const firstSectionIndex = elements.findIndex(
        (element) => element.type == 'SectionField'
      );
      const nextSectionIndex =
        elements
          .slice(firstSectionIndex + 1)
          .findIndex((element) => element.type == 'SectionField') +
        firstSectionIndex +
        1; // do cắt bớt firstSectionIndex + 1 phần tử nên phải + firstSectionIndex + 1 để bù lại index
      return elements.slice(firstSectionIndex, nextSectionIndex);
    }
  });

  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const isFirstSection = () => {
    if (content.filter((element) => element.type == 'SectionField').length <= 1)
      return true;
    const sections = content.filter(
      (element) => element.type == 'SectionField'
    );
    if (section[0].id == sections[0].id) return true;
    return false;
  };
  const isLastSection = () => {
    const sections = content.filter(
      (element) => element.type == 'SectionField'
    );
    if (!section) return true;
    if (section[0].id == sections[sections.length - 1].id) return true;
    return false;
  };
  const backSection = () => {
    const sections = content.filter(
      (element) => element.type == 'SectionField'
    );
    const currentSectionId = section[0].id;
    const currentSectionIndex = content.findIndex(
      (element) => element.id == currentSectionId
    );
    const prevSectionId =
      sections[
        sections.findIndex((element) => element.id == currentSectionId) - 1
      ].id;
    const prevSectionIndex = content.findIndex(
      (element) => element.id == prevSectionId
    );
    setSection(content.slice(prevSectionIndex, currentSectionIndex));
  };
  const nextSection = () => {
    const sections = content.filter(
      (element) => element.type == 'SectionField'
    );
    const currentSectionId = section[0].id;
    const nextSectionId =
      sections[
        sections.findIndex((element) => element.id == currentSectionId) + 1
      ].id;
    const nextSectionIndex = content.findIndex(
      (element) => element.id == nextSectionId
    );
    if (sections[sections.length - 1].id == nextSectionId)
      setSection(content.slice(nextSectionIndex));
    else {
      const nextNextSectionId =
        sections[
          sections.findIndex((element) => element.id == currentSectionId) + 2
        ].id;
      const nextNextSectionIndex = content.findIndex(
        (element) => element.id == nextNextSectionId
      );
      setSection(content.slice(nextSectionIndex, nextNextSectionIndex));
    }
  };

  const validateForm: () => boolean = () => {
    for (const field of section) {
      const actualValue = formValues.current[field.id] || '';
      const valid = FormElements[field.type].validate(field, actualValue);
      if (!valid) {
        formErrors.current[field.id] = true;
      } else {
        if (formErrors.current[field.id] == true)
          delete formErrors.current[field.id];
      }
    }
    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  };

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitFormHandle = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: 'Error',
        description: 'please check the form for errors',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (!author || !wallet) {
        toast({
          title: 'Error',
          description: 'You are not logged in to the wallet',
        });
      } else {
        const jsonContent = JSON.stringify(formValues.current);
        const transactionAndId = await submitForm({
          id: formUrl,
          content: jsonContent,
          authorPubkey: author,
        });
        if (!transactionAndId)
          toast({
            title: 'Error',
            description: 'Something went wrong',
            variant: 'destructive',
          });
        else {
          if (wallet.signTransaction) {
            // Ký giao dịch bằng ví của người dùng (ở phía client)
            const signedTx = await wallet.signTransaction(transactionAndId.tx);

            // Phát sóng giao dịch lên mạng Solana
            const txId = await connection.sendRawTransaction(
              signedTx.serialize()
            );
            toast({
              title: 'Success',
              description: 'Form submitted successfully',
            });
            setSubmitted(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: String(error),
        variant: 'destructive',
      });
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
          <h1 className="text-2xl font-bold">Form submitted</h1>
          <p className="text-muted-foreground">
            Thank you for submitting the form, you can close this page now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8 overflow-auto">
      <div className="w-full h-fit flex justify-center items-center">
        <div
          key={renderKey}
          className="max-w-[620px] flex flex-col gap-4 bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded"
        >
          {commonLayout.map((element) => {
            if (element.type == 'SectionField') return;
            const FormElement = FormElements[element.type].formComponent;
            return (
              <FormElement
                key={element.id}
                elementInstance={element}
                submitValue={submitValue}
                isInvalid={formErrors.current[element.id]}
                defaultValue={formValues.current[element.id]}
              />
            );
          })}
          {section.map((element) => {
            if (element.type == 'SectionField') return;
            const FormElement = FormElements[element.type].formComponent;
            return (
              <FormElement
                key={element.id}
                elementInstance={element}
                submitValue={submitValue}
                isInvalid={formErrors.current[element.id]}
                defaultValue={formValues.current[element.id]}
              />
            );
          })}
          <div className="flex pt-6 items-center">
            {content.filter((element) => element.type == 'SectionField')
              .length <= 1 || isLastSection() ? (
              <Button
                className="rounded-xl"
                onClick={() => {
                  startTransition(submitFormHandle);
                }}
                disabled={pending}
              >
                {!pending && (
                  <>
                    <HiCursorClick className="mr-2" />
                    Submit
                  </>
                )}
                {pending && <ImSpinner2 className="animate-spin" />}
              </Button>
            ) : (
              <div className="gap-2 flex items-center justify-center">
                <Button
                  onClick={() => {
                    backSection();
                  }}
                  disabled={isFirstSection()}
                  className="w-[80px] rounded-xl"
                >
                  Back
                </Button>
                <Button
                  className="w-[80px] rounded-xl"
                  onClick={() => {
                    const validForm = validateForm();
                    if (!validForm) {
                      setRenderKey(new Date().getTime());
                      toast({
                        title: 'Error',
                        description: 'please check the form for errors',
                        variant: 'destructive',
                      });
                      return;
                    } else nextSection();
                  }}
                >
                  Next
                </Button>
              </div>
            )}
            {section[0].type == 'SectionField'
              ? [section[0]].map((element) => {
                  const FormElement = FormElements[element.type].formComponent;
                  return (
                    <FormElement
                      key={element.id}
                      elementInstance={element}
                      submitValue={submitValue}
                      isInvalid={formErrors.current[element.id]}
                      defaultValue={formValues.current[element.id]}
                    />
                  );
                })
              : ''}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormSubmitComponent;
