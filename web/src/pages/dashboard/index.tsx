import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Droplets, AlertCircle, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAllFilters } from '@/hooks/use-all-filters';
import { usePurifiers } from '@/hooks/use-purifiers';
import { FilterStatusBadge } from '@/components/filter/filter-status-badge';
import { Loader2 } from 'lucide-react';

export function DashboardPage() {
  const { t } = useTranslation();
  const { purifiers, loading: purifiersLoading } = usePurifiers();
  const { stats, expiredFilters, warningFilters, loading: filtersLoading } = useAllFilters();

  const loading = purifiersLoading || filtersLoading;

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const needsAttention = expiredFilters.length + warningFilters.length;

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground">
              {t('dashboard.description')}
            </p>
          </div>
          <Link to="/purifiers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('purifier.addPurifier')}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalPurifiers')}
              </CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPurifiers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.totalFilters')}</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFilters}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.needsAttention')}
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {needsAttention}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.expiredFilters} {t('dashboard.expired')}, {stats.warningFilters} {t('dashboard.dueSoon')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.filtersOk')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {stats.okFilters}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {purifiers.length === 0 && (
          <Card className="flex flex-col items-center justify-center py-12">
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
          </Card>
        )}

        {/* Alerts Section */}
        {needsAttention > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('dashboard.filtersNeedingAttention')}</h2>

            {/* Expired Filters */}
            {expiredFilters.length > 0 && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {t('dashboard.expiredFilters')} ({expiredFilters.length})
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {expiredFilters.map((filter) => (
                    <Link
                      key={filter.id}
                      to={`/purifiers/${filter.purifierId}`}
                    >
                      <Card className="hover:bg-accent/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{filter.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {filter.purifierName}
                                {filter.purifierLocation &&
                                  ` - ${filter.purifierLocation}`}
                              </p>
                            </div>
                            <FilterStatusBadge
                              status={filter.status}
                              daysUntilReplacement={filter.daysUntilReplacement}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Warning Filters */}
            {warningFilters.length > 0 && (
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-medium text-yellow-600">
                  <AlertTriangle className="h-4 w-4" />
                  {t('dashboard.warningFilters')} ({warningFilters.length})
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {warningFilters.map((filter) => (
                    <Link
                      key={filter.id}
                      to={`/purifiers/${filter.purifierId}`}
                    >
                      <Card className="hover:bg-accent/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{filter.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {filter.purifierName}
                                {filter.purifierLocation &&
                                  ` - ${filter.purifierLocation}`}
                              </p>
                            </div>
                            <FilterStatusBadge
                              status={filter.status}
                              daysUntilReplacement={filter.daysUntilReplacement}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
