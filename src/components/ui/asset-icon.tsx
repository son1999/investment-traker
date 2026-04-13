import { useState } from 'react'
import { getAssetIconUrl } from '@/lib/assetIcon'

interface AssetIconProps {
  code: string
  assetType: string
  fallback?: string
  fallbackBg?: string
  className?: string
  sizeClass?: string
}

export function AssetIcon({
  code,
  assetType,
  fallback,
  fallbackBg,
  className = '',
  sizeClass = 'size-7',
}: AssetIconProps) {
  const url = getAssetIconUrl(code, assetType)
  const [errored, setErrored] = useState(false)

  if (!url || errored) {
    return (
      <div
        className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full text-sm ${className}`}
        style={{ backgroundColor: fallbackBg }}
      >
        {fallback ?? code.slice(0, 1)}
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={code}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`${sizeClass} shrink-0 rounded-full bg-muted object-contain ${className}`}
    />
  )
}
