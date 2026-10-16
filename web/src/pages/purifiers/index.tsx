import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Droplets, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { usePurifiers } from '@/hooks/use-purifiers';
import { PurifierCard } from '@/components/purifier/purifier-card';

export function PurifiersPage() {
  const { t } = useTranslation();
  const { purifiers, loading } = usePurifiers();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('purifier.title')}</h1>
            <p className="text-muted-foreground">
              {t('purifier.description')}
            </p>
          </div>
          <Link to="/purifiers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('purifier.addPurifier')}
            </Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : purifiers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <Droplets className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('dashboard.noPurifiers')}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {t('dashboard.noPurifiersDescription')}
            </p>
            <Link to="/purifiers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('dashboard.addFirstPurifier')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {purifiers.map((purifier) => (
              <PurifierCard key={purifier.id} purifier={purifier} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
