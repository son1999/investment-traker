import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useImportCSV } from '@/hooks/useTransactions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, FileText, X, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { CSVImportResult } from '@/types/api'

export default function CSVImport({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const importCSV = useImportCSV()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<CSVImportResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) return
    const data = await importCSV.mutateAsync(file)
    setResult(data)
  }

  return (
    <Card className="border-edge-subtle shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('transactions.csvImportTitle')}</CardTitle>
            <CardDescription className="mt-1">{t('transactions.csvImportDesc')}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Drop zone */}
        <div
          className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed border-edge px-6 py-8 transition-colors hover:border-teal hover:bg-muted/30"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={32} className="text-caption" />
          <p className="text-sm text-caption">{t('transactions.csvDropzone')}</p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Selected file */}
        {file && (
          <div className="flex items-center gap-3 rounded-lg border border-edge bg-muted/30 px-4 py-3">
            <FileText size={18} className="text-teal" />
            <span className="flex-1 text-sm font-medium text-heading">{file.name}</span>
            <span className="text-xs text-caption">{(file.size / 1024).toFixed(1)} KB</span>
            <Button variant="ghost" size="sm" onClick={() => { setFile(null); setResult(null) }}>
              <X size={14} />
            </Button>
          </div>
        )}

        {/* CSV format hint */}
        <div className="rounded-lg bg-muted/30 px-4 py-3">
          <p className="text-xs font-medium text-caption">{t('transactions.csvFormat')}</p>
          <code className="mt-1 block text-[11px] text-dim">
            date,assetType,assetCode,action,quantity,unitPrice,note
          </code>
        </div>

        {/* Result */}
        {result && (
          <div className="flex flex-col gap-2 rounded-lg border border-edge px-4 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-positive" />
              <span className="text-sm text-heading">
                {t('transactions.csvResultSuccess', { count: result.successCount })}
              </span>
            </div>
            {result.errorCount > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-negative" />
                  <span className="text-sm text-negative">
                    {t('transactions.csvResultError', { count: result.errorCount })}
                  </span>
                </div>
                <div className="mt-1 max-h-32 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-xs text-caption">
                      {t('transactions.csvRowError', { row: err.row })}: {err.message}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <Button onClick={handleImport} disabled={!file || importCSV.isPending} size="lg" className="gap-2">
            <Upload size={14} />
            {importCSV.isPending ? '...' : t('transactions.csvImport')}
          </Button>
          <Button variant="outline" size="lg" onClick={onClose}>
            {t('transactions.cancel')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
