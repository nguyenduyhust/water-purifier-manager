import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Loader2, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFilters } from '@/hooks/use-filters';
import { toast } from '@/hooks/use-toast';
import type { FilterWithStatus } from '@/types';

const replaceSchema = z.object({
  replacedAt: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

type ReplaceFormValues = z.infer<typeof replaceSchema>;

interface ReplaceFilterDialogProps {
  filter: FilterWithStatus | null;
  purifierId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReplaceFilterDialog({
  filter,
  purifierId,
  open,
  onOpenChange,
}: ReplaceFilterDialogProps) {
  const { t } = useTranslation();
  const { replaceFilter } = useFilters();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReplaceFormValues>({
    resolver: zodResolver(replaceSchema),
    defaultValues: {
      replacedAt: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    },
  });

  const onSubmit = async (data: ReplaceFormValues) => {
    if (!filter) return;

    setIsLoading(true);
    try {
      await replaceFilter(
        purifierId,
        filter.id,
        new Date(data.replacedAt),
        data.notes
      );
      toast({
        title: t('filter.filterReplaced'),
        description: t('filter.filterReplacedDescription', { name: filter.name }),
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('filter.errors.replaceFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('filter.replaceFilter')}</DialogTitle>
          <DialogDescription>
            {filter && filter.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="replacedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('filter.replacementDate')}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="date" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('filter.replacementNotes')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('filter.replacementNotesPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.confirm')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
