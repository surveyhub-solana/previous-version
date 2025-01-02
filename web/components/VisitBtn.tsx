'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

function VisitBtn({ shareUrl }: { shareUrl: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // avoiding window not defined error
  }

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <Button
      className="w-full md:w-[200px] bg-black text-white dark:bg-white dark:text-black"
      onClick={() => {
        window.open(shareLink, '_blank');
      }}
    >
      Visit
    </Button>
  );
}

export default VisitBtn;
