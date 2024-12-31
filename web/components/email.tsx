import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Email() {
  return (
    <div className="w-full max-w-[500px]">
      <div className="flex w-full items-center justify-center gap-4 rounded-xl bg-white p-4 dark:bg-black">
        <Input
          className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Enter your email"
        />
        <Button className="flex-none bg-card text-black hover:text-white dark:text-white">
          Submit
        </Button>
      </div>
      <div className="text-main-gray-03 dark:text-main-gray-02 text-xs">
        *Submit your email, and our team will get in touch with you soon!
      </div>
    </div>
  );
}
