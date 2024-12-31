import { ChevronRight } from 'lucide-react';

export default function LaunchApp() {
  return (
    <div
      className="bg-main-right text-black flex h-full cursor-pointer items-center rounded-full px-4 text-sm font-bold"
      onClick={() => (window.location.href = '/forms')}
    >
      Launch App
      <ChevronRight />
    </div>
  );
}
