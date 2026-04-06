import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type JournalEntry } from '@/stores/journal'
import { Calendar, Pencil, Trash2 } from 'lucide-react'

const sentimentConfig = {
  optimistic: {
    labelKey: 'journal.optimisticBadge',
    textColor: 'text-positive',
    bgColor: 'bg-positive/10',
    borderColor: 'border-positive/20',
  },
  worried: {
    labelKey: 'journal.worriedBadge',
    textColor: 'text-negative',
    bgColor: 'bg-negative/10',
    borderColor: 'border-negative/20',
  },
  neutral: {
    labelKey: 'journal.neutralBadge',
    textColor: 'text-label',
    bgColor: 'bg-label/10',
    borderColor: 'border-label/20',
  },
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

interface JournalCardProps {
  entry: JournalEntry
  onDelete?: (id: string) => void
}

export default function JournalCard({ entry, onDelete }: JournalCardProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const config = sentimentConfig[entry.sentiment]

  const shouldTruncate = entry.content.length > 200
  const displayContent = !expanded && shouldTruncate
    ? entry.content.slice(0, 200) + '...'
    : entry.content

  return (
    <div
      className="flex flex-col gap-4 rounded-lg border border-edge bg-panel p-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title row */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-heading">{entry.title}</h3>
            <span
              className={`rounded-sm border px-[11px] py-[3px] text-[10px] font-bold ${config.textColor} ${config.bgColor} ${config.borderColor}`}
            >
              {t(config.labelKey)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={11} className="text-dim" />
            <span className="font-mono text-xs text-dim">
              {formatDate(entry.date)}
            </span>
          </div>
        </div>

        {/* Action buttons (visible on hover) */}
        <div
          className={`flex items-start gap-1 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button className="cursor-pointer rounded p-2 text-dim hover:text-label">
            <Pencil size={11} />
          </button>
          <button
            onClick={() => onDelete?.(entry.id)}
            className="cursor-pointer rounded p-2 text-dim hover:text-negative"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Asset tags */}
      {entry.assets.length > 0 && (
        <div className="flex gap-2">
          {entry.assets.map((asset) => (
            <span
              key={asset}
              className="rounded-sm border border-edge-strong px-[9px] py-[3px] text-[10px] font-semibold uppercase tracking-[1px] text-label"
            >
              {asset}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-edge-subtle" />

      {/* Content */}
      <div className="text-sm leading-6 text-caption">
        {displayContent}
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 cursor-pointer bg-transparent text-sm text-gold hover:underline"
          >
            {expanded ? t('journal.showLess') : t('journal.showMore')}
          </button>
        )}
      </div>
    </div>
  )
}
