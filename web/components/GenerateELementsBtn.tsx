import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import useDesigner from '@/components/hooks/useDesigner';
import { BiSolidStar } from 'react-icons/bi';
import { Loader } from 'lucide-react';
export default function GenerateElementsBtn({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [userPrompt, setUserPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { generateElements } = useDesigner();
  const onGenerate = async () => {
    setGenerating(true);
    try {
      await generateElements(userPrompt, title, description);
      setUserPrompt('');
      setOpen(false);
      toast({
        title: 'Success',
        description: 'Form elements generated successfully',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Generating form elements failed',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-[#01BDB1] from-[16%] via-[#01A6FE] via-[50%] to-[#DCB7FF] to-[86%] text-white">
          <FaWandMagicSparkles className="w-4 h-4" />
          Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            rows={5}
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="resize-none"
          />
          <Button
            className="bg-gradient-to-r from-[#01BDB1] from-[16%] via-[#01A6FE] via-[50%] to-[#DCB7FF] to-[86%] text-white"
            onClick={onGenerate}
            disabled={generating}
          >
            {generating ? (
              <Loader className="animate-spin" />
            ) : (
              'Generate Elements'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
