import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PurifierForm, type PurifierFormValues } from '@/components/purifier/purifier-form';
import { usePurifiers } from '@/hooks/use-purifiers';
import { usePurifierTypes } from '@/hooks/use-purifier-types';
import { toast } from '@/hooks/use-toast';

export function NewPurifierPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addPurifier } = usePurifiers();
  const { getPurifierTypeById } = usePurifierTypes();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PurifierFormValues) => {
    setIsLoading(true);

    try {
      const purifierType = getPurifierTypeById(data.typeId);

      if (!purifierType) {
        throw new Error('Invalid purifier type');
      }

      await addPurifier(
        {
          typeId: data.typeId,
          typeName: purifierType.name,
          name: data.name,
          location: data.location,
          installationDate: new Date(data.installationDate),
          notes: data.notes,
        },
        purifierType.filterTemplates
      );

      toast({
        title: t('purifier.purifierAdded'),
        description: t('purifier.purifierAddedDescription', { name: data.name }),
      });

      navigate('/purifiers');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('purifier.errors.addFailed'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/purifiers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('purifier.newPurifier')}</h1>
            <p className="text-muted-foreground">
              {t('purifier.newPurifierDescription')}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('purifier.purifierDetails')}</CardTitle>
            <CardDescription>
              {t('purifier.purifierDetailsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurifierForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
