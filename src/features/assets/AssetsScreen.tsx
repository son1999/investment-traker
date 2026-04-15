import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Package, Pencil, Plus, Trash2 } from 'lucide-react'

import { DataTableCard, EmptyState, PageHeader } from '@/components/app'
import { AssetIcon } from '@/components/ui/asset-icon'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAssets, useCreateAsset, useDeleteAsset, useUpdateAsset } from '@/hooks/useAssets'
import { useIsGuest } from '@/hooks/useIsGuest'
import type { Asset, AssetType } from '@/types/api'

import AssetForm from './components/AssetForm'

const typeLabels: Record<string, string> = {
  metal: 'common.metal',
  crypto: 'common.crypto',
  stock: 'common.stock',
  savings: 'common.savings',
}

export default function AssetsScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isGuest = useIsGuest()
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [deleteCode, setDeleteCode] = useState<string | null>(null)

  const { data: assets, isLoading } = useAssets(typeFilter ? (typeFilter as AssetType) : undefined)
  const createAsset = useCreateAsset()
  const updateAsset = useUpdateAsset()
  const deleteAsset = useDeleteAsset()

  const items = assets || []

  const handleSave = async (data: {
    code: string
    name: string
    type: AssetType
    currency?: string
    icon: string
    iconBg: string
    interestRate?: number
    termMonths?: number
    bankName?: string
    maturityDate?: string
  }) => {
    if (editingAsset) {
      await updateAsset.mutateAsync({
        code: editingAsset.code,
        data: {
          name: data.name,
          type: data.type,
          icon: data.icon,
          iconBg: data.iconBg,
          interestRate: data.interestRate,
          termMonths: data.termMonths,
          bankName: data.bankName,
          maturityDate: data.maturityDate,
        },
      })
    } else {
      await createAsset.mutateAsync(data)
    }
    setFormOpen(false)
    setEditingAsset(null)
  }

  const handleAdd = () => {
    setEditingAsset(null)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteCode) return
    await deleteAsset.mutateAsync(deleteCode)
    setDeleteCode(null)
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-[1400px] flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <PageHeader
        title={t('assets.title')}
        description={t('assets.subtitle')}
        actions={
          !isGuest ? (
            <Button onClick={handleAdd} size="lg" className="gap-2">
              <Plus size={14} />
              {t('assets.addAsset')}
            </Button>
          ) : undefined
        }
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Tabs value={typeFilter} onValueChange={setTypeFilter}>
          <TabsList className="h-auto flex-wrap">
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
        <EmptyState
          icon={<Package size={48} />}
          description={t('assets.noAssets')}
          action={
            !isGuest ? (
              <Button onClick={handleAdd} variant="outline" className="gap-2">
                <Plus size={14} />
                {t('assets.addAsset')}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <DataTableCard
          title={t('assets.title')}
          description={t('assets.count', { count: items.length })}
        >
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">{t('assets.colIcon')}</TableHead>
                <TableHead>{t('assets.colCode')}</TableHead>
                <TableHead>{t('assets.colName')}</TableHead>
                <TableHead>{t('assets.colType')}</TableHead>
                <TableHead>{t('currencies.code')}</TableHead>
                <TableHead>{t('assets.colCreated')}</TableHead>
                {!isGuest ? <TableHead className="pr-6 text-right">{t('assets.colActions')}</TableHead> : null}
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
                    <AssetIcon
                      code={asset.code}
                      assetType={asset.type}
                      fallback={asset.icon}
                      fallbackBg={asset.iconBg}
                      sizeClass="size-9"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm font-semibold">{asset.code}</TableCell>
                  <TableCell className="text-sm">{asset.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="uppercase">
                      {t(typeLabels[asset.type])}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {asset.currency || 'VND'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(asset.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>
                  {!isGuest ? (
                    <TableCell className="pr-6 text-right">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            setEditingAsset(asset)
                            setFormOpen(true)
                          }}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setDeleteCode(asset.code)}
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataTableCard>
      )}

      <AssetForm
        key={`${editingAsset?.code ?? 'new'}-${formOpen ? 'open' : 'closed'}`}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditingAsset(null)
        }}
        asset={editingAsset}
        onSave={handleSave}
        isPending={createAsset.isPending || updateAsset.isPending}
      />

      <ConfirmDialog
        open={!!deleteCode}
        onOpenChange={(open) => {
          if (!open) setDeleteCode(null)
        }}
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
