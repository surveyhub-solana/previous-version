'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImShare } from 'react-icons/im';
import { toast } from './ui/use-toast';
import { Link } from 'lucide-react';

function FormLinkShare({ shareUrl }: { shareUrl: string }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [getBlinks, setGetBlinks] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // avoiding window not defined error
  }

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  const blinks = `${window.location.origin}/api/actions/submit-form?formId=${shareUrl}`;
  return (
    <div className="flex flex-grow gap-2 items-center flex-col md:flex-row">
      <Input value={shareLink} readOnly />
      <div className="grid md:flex grid-cols-2 gap-2 w-full md:w-fit">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(shareLink);
            setCopied(true);
            toast({
              title: 'Copied!',
              description: 'Link copied to clipboard',
            });
          }}
          disabled={copied}
        >
          <ImShare className="mr-2 h-4 w-4" />
          Share link
        </Button>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(blinks);
            setGetBlinks(true);
            toast({
              title: 'Get Blinks!',
              description: 'Blinks copied to clipboard',
            });
          }}
          disabled={getBlinks}
        >
          <Link className="mr-2 h-4 w-4" />
          Get Blinks
        </Button>
      </div>
    </div>
  );
}

export default FormLinkShare;
