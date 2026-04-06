import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useJournalStore, type Sentiment } from '@/stores/journal'
import JournalForm from './components/JournalForm'
import JournalFilters from './components/JournalFilters'
import JournalCard from './components/JournalCard'
import { Plus } from 'lucide-react'

const sentimentMap: Record<string, Sentiment> = {
  'Lạc quan': 'optimistic',
  'Optimistic': 'optimistic',
  'Lo ngại': 'worried',
  'Worried': 'worried',
  'Trung lập': 'neutral',
  'Neutral': 'neutral',
}

export default function JournalScreen() {
  const { t } = useTranslation()
  const { entries, showForm, setShowForm, sentimentFilter, assetFilter, removeEntry } =
    useJournalStore()

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const allLabel = t('common.all')
      if (sentimentFilter !== allLabel && e.sentiment !== sentimentMap[sentimentFilter]) {
        return false
      }
      if (assetFilter !== allLabel && !e.assets.includes(assetFilter)) {
        return false
      }
      return true
    })
  }, [entries, sentimentFilter, assetFilter, t])

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-8">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-heading">{t('journal.title')}</h1>
          <p className="text-sm text-label">{t('journal.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex cursor-pointer items-center gap-2 rounded bg-btn px-5 py-[10px] text-sm font-semibold text-on-btn transition-colors hover:bg-btn-hover"
        >
          <Plus size={12} />
          {t('journal.newEntry')}
        </button>
      </div>

      {showForm && <JournalForm />}
      <JournalFilters count={filtered.length} />

      <div className="flex flex-col gap-4">
        {filtered.map((entry) => (
          <JournalCard key={entry.id} entry={entry} onDelete={removeEntry} />
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-dim">{t('journal.noEntries')}</div>
        )}
      </div>
    </div>
  )
}
