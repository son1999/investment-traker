import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle2, FileText, Upload, X } from 'lucide-react'

import { SectionCard } from '@/components/app'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useImportCSV } from '@/hooks/useTransactions'
import type { CSVImportResult } from '@/types/api'

export default function CSVImport({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const importCSV = useImportCSV()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<CSVImportResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = e.target.files?.[0]
    if (nextFile) {
      setFile(nextFile)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return
    const data = await importCSV.mutateAsync(file)
    setResult(data)
  }

  return (
    <SectionCard
      title={t('transactions.csvImportTitle')}
      description={t('transactions.csvImportDesc')}
      action={
        <Button variant="ghost" size="icon-xs" onClick={onClose}>
          <X size={14} />
        </Button>
      }
      className="shadow-sm"
      contentClassName="space-y-4"
    >
      <Button
        type="button"
        variant="outline"
        className="h-auto w-full flex-col gap-3 border-dashed bg-muted/20 px-6 py-8 text-center hover:bg-muted/40"
        onClick={() => fileRef.current?.click()}
      >
        <Upload size={32} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t('transactions.csvDropzone')}</p>
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {file ? (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3">
          <FileText size={18} className="text-muted-foreground" />
          <span className="flex-1 text-sm font-medium">{file.name}</span>
          <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => {
              setFile(null)
              setResult(null)
            }}
          >
            <X size={14} />
          </Button>
        </div>
      ) : null}

      <div className="rounded-lg border bg-muted/20 px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">{t('transactions.csvFormat')}</p>
        <code className="mt-1 block text-[11px] text-muted-foreground">
          date,assetType,assetCode,action,quantity,unitPrice,note
        </code>
      </div>

      {result ? (
        <div className="space-y-3">
          <Alert>
            <CheckCircle2 size={16} className="text-positive" />
            <AlertTitle>{t('transactions.csvImport')}</AlertTitle>
            <AlertDescription>
              {t('transactions.csvResultSuccess', { count: result.successCount })}
            </AlertDescription>
          </Alert>
          {result.errorCount > 0 ? (
            <Alert variant="destructive">
              <AlertTriangle size={16} />
              <AlertTitle>{t('transactions.csvResultError', { count: result.errorCount })}</AlertTitle>
              <AlertDescription>
                <div className="mt-2 max-h-32 space-y-1 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <p key={i}>
                      {t('transactions.csvRowError', { row: err.row })}: {err.message}
                    </p>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button
          onClick={handleImport}
          disabled={!file || importCSV.isPending}
          size="lg"
          className="gap-2"
        >
          <Upload size={14} />
          {importCSV.isPending ? '...' : t('transactions.csvImport')}
        </Button>
        <Button variant="outline" size="lg" onClick={onClose}>
          {t('transactions.cancel')}
        </Button>
      </div>
    </SectionCard>
  )
}
