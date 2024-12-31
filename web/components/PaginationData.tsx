import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export default function PaginationData({
  no,
  setNo,
  total,
  className,
}: {
  no: number;
  setNo: any;
  total: number;
  className?: string;
}) {
  const [numberPageDisplay, setNumberPageDisplay] = useState(() => {
    if (total > 7) return 7;
    return total;
  });
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumberPageDisplay(() => {
          if (total > 5) return 5;
          return total;
        });
      } else {
        setNumberPageDisplay(() => {
          if (total > 7) return 7;
          return total;
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (no > numberPageDisplay / 2) {
      const suggestStart = no - Math.floor(numberPageDisplay / 2);
      const limitStart = total - numberPageDisplay + 1;
      setStart(() => (suggestStart > limitStart ? limitStart : suggestStart));
    } else {
      setStart(() => 1);
    }
    setEnd(() => start + numberPageDisplay - 1);
  }, [no, start, end, numberPageDisplay, total]);
  return (
    <div className="w-full py-1">
      <div className={cn('flex items-center justify-center', className)}>
        <div className="w-fit flex items-center justify-center">
          <Button
            disabled={no === 1}
            onClick={() => setNo(no - 1)}
            variant={'ghost'}
          >
            <ChevronLeft />
          </Button>
          {start > 1 && (
            <DotElement
              values={Array.from({ length: start - 1 }, (_, i) => i + 1)}
              setNo={setNo}
            />
          )}
          {Array.from({ length: end - start + 1 }, (_, i) => i + start).map(
            (value) => (
              <Button
                key={value}
                onClick={() => setNo(value)}
                variant={no === value ? 'default' : 'ghost'}
              >
                {value}
              </Button>
            )
          )}
          {end < total && (
            <DotElement
              values={Array.from(
                { length: total - end },
                (_, i) => i + 1 + end
              )}
              setNo={setNo}
            />
          )}
          <Button
            disabled={no === total}
            onClick={() => setNo(no + 1)}
            variant={'ghost'}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
function DotElement({ values, setNo }: { values: number[]; setNo: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-10">
        {values.map((value) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setNo(value)}
            className="text-sm"
          >
            {value}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
