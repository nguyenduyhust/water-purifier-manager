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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePurifierTypes } from '@/hooks/use-purifier-types';

const purifierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  typeId: z.string().min(1, 'Please select a purifier type'),
  location: z.string().max(200).optional(),
  installationDate: z.string().min(1, 'Installation date is required'),
  notes: z.string().max(500).optional(),
});

type PurifierFormValues = z.infer<typeof purifierSchema>;

interface PurifierFormProps {
  onSubmit: (data: PurifierFormValues) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<PurifierFormValues>;
  submitLabel?: string;
}

export function PurifierForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  submitLabel,
}: PurifierFormProps) {
  const { t } = useTranslation();
  const { purifierTypes, getPurifierTypeById } = usePurifierTypes();
  const [selectedType, setSelectedType] = useState(defaultValues?.typeId || '');

  const form = useForm<PurifierFormValues>({
    resolver: zodResolver(purifierSchema),
    defaultValues: {
      name: '',
      typeId: '',
      location: '',
      installationDate: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      ...defaultValues,
    },
  });

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    form.setValue('typeId', value);
  };

  const selectedTypeData = getPurifierTypeById(selectedType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('purifier.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('purifier.namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="typeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('purifier.type')}</FormLabel>
              <Select
                onValueChange={handleTypeChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('purifier.selectType')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {purifierTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedTypeData && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="text-sm font-medium mb-2">{t('filter.filters')}:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {selectedTypeData.filterTemplates.map((filter) => (
                <li key={filter.position}>
                  {filter.name} - {filter.defaultIntervalMonths} {t('common.months')}
                </li>
              ))}
            </ul>
          </div>
        )}

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('purifier.location')}</FormLabel>
              <FormControl>
                <Input placeholder={t('purifier.locationPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="installationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('purifier.installationDate')}</FormLabel>
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
              <FormLabel>{t('purifier.notes')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('purifier.notesPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel || t('purifier.addPurifier')}
        </Button>
      </form>
    </Form>
  );
}

export type { PurifierFormValues };
