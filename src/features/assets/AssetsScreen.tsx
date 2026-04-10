import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { useAssets, useCreateAsset, useUpdateAsset, useDeleteAsset } from '@/hooks/useAssets'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import AssetForm from './components/AssetForm'
import { useIsGuest } from '@/hooks/useIsGuest'
import type { Asset, AssetType } from '@/types/api'

const typeLabels: Record<string, string> = { metal: 'common.metal', crypto: 'common.crypto', stock: 'common.stock', savings: 'common.savings' }

export default function AssetsScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isGuest = useIsGuest()
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [deleteCode, setDeleteCode] = useState<string | null>(null)

  const { data: assets, isLoading } = useAssets(typeFilter ? typeFilter as AssetType : undefined)
  const createAsset = useCreateAsset()
  const updateAsset = useUpdateAsset()
  const deleteAsset = useDeleteAsset()

  const items = assets || []

  const handleSave = async (data: { code: string; name: string; type: AssetType; currency?: string; icon: string; iconBg: string; interestRate?: number; termMonths?: number; bankName?: string; maturityDate?: string }) => {
    if (editingAsset) {
      await updateAsset.mutateAsync({ code: editingAsset.code, data: { name: data.name, type: data.type, icon: data.icon, iconBg: data.iconBg, interestRate: data.interestRate, termMonths: data.termMonths, bankName: data.bankName, maturityDate: data.maturityDate } })
    } else {
      await createAsset.mutateAsync(data)
    }
    setFormOpen(false)
    setEditingAsset(null)
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteCode) return
    await deleteAsset.mutateAsync(deleteCode)
    setDeleteCode(null)
  }

  const handleAdd = () => {
    setEditingAsset(null)
    setFormOpen(true)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-heading">{t('assets.title')}</h1>
          <p className="text-sm text-caption">{t('assets.subtitle')}</p>
        </div>
        {!isGuest && (
          <Button onClick={handleAdd} size="lg" className="gap-2">
            <Plus size={14} />
            {t('assets.addAsset')}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={typeFilter} onValueChange={setTypeFilter}>
          <TabsList>
            <TabsTrigger value="">{t('assets.filterAll')}</TabsTrigger>
            <TabsTrigger value="metal">{t('common.metal')}</TabsTrigger>
            <TabsTrigger value="crypto">{t('common.crypto')}</TabsTrigger>
            <TabsTrigger value="stock">{t('common.stock')}</TabsTrigger>
            <TabsTrigger value="savings">{t('common.savings')}</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="text-sm text-muted-foreground">{t('assets.count', { count: items.length })}</span>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
            <Package size={48} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t('assets.noAssets')}</p>
            {!isGuest && (
              <Button onClick={handleAdd} variant="outline" className="gap-2">
                <Plus size={14} />
                {t('assets.addAsset')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-edge">
          <CardHeader className="flex-row items-center justify-between border-b border-edge-subtle">
            <div>
              <CardTitle>{t('assets.title')}</CardTitle>
              <CardDescription>{t('assets.count', { count: items.length })}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">{t('assets.colIcon')}</TableHead>
                  <TableHead>{t('assets.colCode')}</TableHead>
                  <TableHead>{t('assets.colName')}</TableHead>
                  <TableHead>{t('assets.colType')}</TableHead>
                  <TableHead>{t('currencies.code')}</TableHead>
                  <TableHead>{t('assets.colCreated')}</TableHead>
                  {!isGuest && <TableHead className="pr-6 text-right">{t('assets.colActions')}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((asset) => (
                  <TableRow
                    key={asset.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/assets/${asset.code}`)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex size-9 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: asset.iconBg }}>
                        {asset.icon}
                      </div>
                    </TableCell>
                    <TableCell className="font-['JetBrains_Mono'] text-sm font-bold text-heading">{asset.code}</TableCell>
                    <TableCell className="text-sm">{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] uppercase">{t(typeLabels[asset.type])}</Badge>
                    </TableCell>
                    <TableCell className="font-['JetBrains_Mono'] text-xs text-muted-foreground">{asset.currency || 'VND'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{new Date(asset.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    {!isGuest && (
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon-xs" onClick={() => handleEdit(asset)}>
                            <Pencil size={14} />
                          </Button>
                          <Button variant="ghost" size="icon-xs" onClick={() => setDeleteCode(asset.code)}>
                            <Trash2 size={14} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <AssetForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingAsset(null) }}
        asset={editingAsset}
        onSave={handleSave}
        isPending={createAsset.isPending || updateAsset.isPending}
      />

      <ConfirmDialog
        open={!!deleteCode}
        onOpenChange={(open) => { if (!open) setDeleteCode(null) }}
        title={t('assets.deleteAsset')}
        description={t('assets.confirmDelete', { code: deleteCode })}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleDelete}
        isPending={deleteAsset.isPending}
        variant="danger"
      />
    </div>
  )
}
