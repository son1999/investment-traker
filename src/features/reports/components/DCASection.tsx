import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePortfolioSummary } from '@/hooks/usePortfolio'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { TrendingUp } from 'lucide-react'
import DCAHeroChart from './DCAHeroChart'
import DCAHistory from './DCAHistory'
import DCAComparison from './DCAComparison'

export default function DCASection() {
  const { t } = useTranslation()
  const { data: summary } = usePortfolioSummary()
  const [selectedCode, setSelectedCode] = useState('')

  const assetCodes = summary?.assetCodes || []

  // Auto-select first asset if none selected
  if (!selectedCode && assetCodes.length > 0 && assetCodes[0] !== selectedCode) {
    setSelectedCode(assetCodes[0])
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Section header with asset selector */}
      <Card className="border-edge">
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp size={18} className="text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{t('reports.dca')}</CardTitle>
              <CardDescription>{t('reports.dcaSub')}</CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{t('reports.asset')}:</span>
            <Select value={selectedCode} onValueChange={(v) => v && setSelectedCode(v)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder={t('reports.asset')} />
              </SelectTrigger>
              <SelectContent>
                {assetCodes.map((code) => (
                  <SelectItem key={code} value={code}>{code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {selectedCode ? (
        <>
          <DCAHeroChart code={selectedCode} />
          <DCAComparison code={selectedCode} />

          <Separator />

          <DCAHistory code={selectedCode} />
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              {assetCodes.length === 0
                ? t('assets.noAssets')
                : t('reports.asset')
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
