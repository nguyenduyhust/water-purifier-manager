import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Calendar, Clock } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterStatusBadge } from './filter-status-badge';
import type { FilterWithStatus } from '@/types';

interface FilterCardProps {
  filter: FilterWithStatus;
  onReplace?: (filter: FilterWithStatus) => void;
}

export function FilterCard({ filter, onReplace }: FilterCardProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? vi : enUS;

  const lastReplacedDate =
    filter.lastReplacedAt instanceof Timestamp
      ? filter.lastReplacedAt.toDate()
      : new Date(filter.lastReplacedAt);

  const formatDate = (date: Date) => {
    return format(date, 'd MMM, yyyy', { locale });
  };

  const getIntervalText = (months: number) => {
    if (i18n.language === 'vi') {
      return `${months} tháng`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            {filter.position}. {filter.name}
          </CardTitle>
          <FilterStatusBadge
            status={filter.status}
            daysUntilReplacement={filter.daysUntilReplacement}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{t('filter.lastReplaced')}: {formatDate(lastReplacedDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {t('filter.nextReplacement')}: {formatDate(filter.nextReplacementAt)} ({i18n.language === 'vi' ? 'mỗi' : 'every'}{' '}
            {getIntervalText(filter.intervalMonths)})
          </span>
        </div>
        {onReplace && (
          <Button
            size="sm"
            variant={filter.status === 'expired' ? 'default' : 'outline'}
            className="w-full mt-2"
            onClick={() => onReplace(filter)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('filter.replaceFilter')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
