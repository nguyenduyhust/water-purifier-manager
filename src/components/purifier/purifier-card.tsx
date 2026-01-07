import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { MapPin, Calendar, ChevronRight, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Purifier, FilterWithStatus } from '@/types';

interface PurifierCardProps {
  purifier: Purifier;
  filters?: FilterWithStatus[];
}

export function PurifierCard({ purifier, filters = [] }: PurifierCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? vi : enUS;

  const installationDate =
    purifier.installationDate instanceof Timestamp
      ? purifier.installationDate.toDate()
      : new Date(purifier.installationDate);

  const expiredCount = filters.filter((f) => f.status === 'expired').length;
  const warningCount = filters.filter((f) => f.status === 'warning').length;
  const okCount = filters.filter((f) => f.status === 'ok').length;

  return (
    <Link to={`/purifiers/${purifier.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{purifier.name}</CardTitle>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          {purifier.typeName && (
            <p className="text-sm text-muted-foreground">{purifier.typeName}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {purifier.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{purifier.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{t('purifier.installed')} {format(installationDate, 'd MMMM, yyyy', { locale })}</span>
          </div>

          {/* Filter status summary */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {expiredCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {expiredCount} {t('dashboard.expired')}
                </Badge>
              )}
              {warningCount > 0 && (
                <Badge variant="warning" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {warningCount} {t('dashboard.dueSoon')}
                </Badge>
              )}
              {okCount > 0 && expiredCount === 0 && warningCount === 0 && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {t('dashboard.filtersOk')}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
