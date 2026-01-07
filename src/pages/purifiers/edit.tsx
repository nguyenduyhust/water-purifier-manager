import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { usePurifier } from '@/hooks/use-purifier';
import { usePurifiers } from '@/hooks/use-purifiers';
import { toast } from '@/hooks/use-toast';

const editPurifierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  location: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});

type EditPurifierFormValues = z.infer<typeof editPurifierSchema>;

export function EditPurifierPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { purifier, loading: loadingPurifier } = usePurifier(id);
  const { updatePurifier } = usePurifiers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditPurifierFormValues>({
    resolver: zodResolver(editPurifierSchema),
    values: purifier ? {
      name: purifier.name,
      location: purifier.location || '',
      notes: purifier.notes || '',
    } : undefined,
  });

  const onSubmit = async (data: EditPurifierFormValues) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updatePurifier(id, {
        name: data.name,
        location: data.location || '',
        notes: data.notes || '',
      });
      toast({
        title: t('purifier.purifierUpdated'),
        description: t('purifier.purifierUpdatedDescription'),
      });
      navigate(`/purifiers/${id}`);
    } catch {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('purifier.errors.updateFailed'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingPurifier) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!purifier) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">{t('purifier.notFound')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('purifier.notFoundDescription')}
          </p>
          <Link to="/purifiers">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('purifier.backToPurifiers')}
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/purifiers/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('purifier.editPurifier')}
            </h1>
            <p className="text-muted-foreground">{purifier.typeName}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('purifier.details')}</CardTitle>
          </CardHeader>
          <CardContent>
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

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/purifiers/${id}`)}
                    disabled={isSubmitting}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('common.save')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
