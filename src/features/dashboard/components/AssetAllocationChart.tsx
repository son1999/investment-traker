import { useRef, useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface Slice {
  label: string
  value: number
  amount: string
  color: string
  darkColor: string
  icon: string
}

const TILT = 0.78 // subtle vertical squish
const DEPTH = 14
const CUTOUT = 0.64
const POP = 8 // how far a hovered slice pops out

function lighten(hex: string, pct: number): string {
  const num = parseInt(hex.slice(1), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + pct)
  const g = Math.min(255, ((num >> 8) & 0xff) + pct)
  const b = Math.min(255, (num & 0xff) + pct)
  return `rgb(${r},${g},${b})`
}

function getSliceAngles(slices: Slice[]) {
  const total = slices.reduce((s, sl) => s + sl.value, 0)
  const angles: { start: number; end: number }[] = []
  let a = -Math.PI / 2
  for (const sl of slices) {
    const sweep = (sl.value / total) * Math.PI * 2
    angles.push({ start: a, end: a + sweep })
    a += sweep
  }
  return angles
}

function hitTest(
  mx: number,
  my: number,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  slices: Slice[],
): number {
  // un-tilt the y coordinate
  const dy = (my - cy) / TILT
  const dx = mx - cx
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < innerR || dist > outerR) return -1

  let angle = Math.atan2(dy, dx)
  if (angle < -Math.PI / 2) angle += Math.PI * 2

  const angles = getSliceAngles(slices)
  for (let i = 0; i < angles.length; i++) {
    let { start, end } = angles[i]
    // normalize
    if (start < -Math.PI / 2) start += Math.PI * 2
    if (end < -Math.PI / 2) end += Math.PI * 2
    if (angle >= start && angle < end) return i
  }
  return -1
}

function drawEllipseArc(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  startAngle: number,
  endAngle: number,
  ccw = false,
) {
  ctx.ellipse(cx, cy, rx, ry, 0, startAngle, endAngle, ccw)
}

function drawDonut3D(
  canvas: HTMLCanvasElement,
  slices: Slice[],
  hoveredIndex: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const w = rect.width
  const h = rect.height
  const cx = w / 2
  const cy = h / 2 - DEPTH / 2 + 4
  const outerR = Math.min(w, h) / 2 - 20
  const innerR = outerR * CUTOUT
  const ryOuter = outerR * TILT
  const ryInner = innerR * TILT

  const angles = getSliceAngles(slices)

  // Helper: get pop offset for a slice
  function getPopOffset(i: number) {
    if (i !== hoveredIndex) return { dx: 0, dy: 0 }
    const mid = (angles[i].start + angles[i].end) / 2
    return { dx: Math.cos(mid) * POP, dy: Math.sin(mid) * TILT * POP }
  }

  // --- Draw shadow ---
  ctx.beginPath()
  ctx.ellipse(cx, cy + DEPTH + 8, outerR + 4, ryOuter + 4, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fill()

  // --- Draw 3D sides (only bottom half visible) ---
  for (let d = DEPTH; d > 0; d -= 1) {
    for (let i = 0; i < slices.length; i++) {
      const { start, end } = angles[i]
      const pop = getPopOffset(i)

      // Only draw sides for arcs that face "down" (between 0 and PI)
      const sideStart = Math.max(start, 0)
      const sideEnd = Math.min(end, Math.PI)
      if (sideStart >= sideEnd) continue

      ctx.beginPath()
      drawEllipseArc(ctx, cx + pop.dx, cy + d + pop.dy, outerR, ryOuter, sideStart, sideEnd)
      ctx.lineTo(
        cx + pop.dx + Math.cos(sideEnd) * outerR,
        cy + pop.dy + Math.sin(sideEnd) * ryOuter,
      )
      drawEllipseArc(ctx, cx + pop.dx, cy + d + pop.dy, innerR, ryInner, sideEnd, sideStart, true)
      ctx.closePath()

      ctx.fillStyle = slices[i].darkColor
      ctx.globalAlpha = d === DEPTH ? 0.7 : 0.08
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1

  // --- Draw top face ---
  for (let i = 0; i < slices.length; i++) {
    const { start, end } = angles[i]
    const pop = getPopOffset(i)
    const isHovered = i === hoveredIndex

    ctx.beginPath()
    drawEllipseArc(ctx, cx + pop.dx, cy + pop.dy, outerR, ryOuter, start, end)
    drawEllipseArc(ctx, cx + pop.dx, cy + pop.dy, innerR, ryInner, end, start, true)
    ctx.closePath()

    // Gradient fill
    const mid = (start + end) / 2
    const gx1 = cx + pop.dx + Math.cos(mid) * innerR
    const gy1 = cy + pop.dy + Math.sin(mid) * ryInner
    const gx2 = cx + pop.dx + Math.cos(mid) * outerR
    const gy2 = cy + pop.dy + Math.sin(mid) * ryOuter
    const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2)
    grad.addColorStop(0, isHovered ? lighten(slices[i].color, 30) : slices[i].color)
    grad.addColorStop(1, isHovered ? lighten(slices[i].color, 50) : lighten(slices[i].color, 15))
    ctx.fillStyle = grad
    ctx.fill()

    // Highlight overlay
    ctx.beginPath()
    drawEllipseArc(ctx, cx + pop.dx, cy + pop.dy, outerR, ryOuter, start, end)
    drawEllipseArc(ctx, cx + pop.dx, cy + pop.dy, innerR, ryInner, end, start, true)
    ctx.closePath()
    const hlGrad = ctx.createLinearGradient(cx, cy - ryOuter, cx, cy + ryOuter)
    hlGrad.addColorStop(0, 'rgba(255,255,255,0.18)')
    hlGrad.addColorStop(0.5, 'rgba(255,255,255,0)')
    hlGrad.addColorStop(1, 'rgba(0,0,0,0.06)')
    ctx.fillStyle = hlGrad
    ctx.fill()

    // Hover ring highlight
    if (isHovered) {
      ctx.beginPath()
      drawEllipseArc(ctx, cx + pop.dx, cy + pop.dy, outerR, ryOuter, start, end)
      drawEllipseArc(ctx, cx + pop.dx, cy + pop.dy, innerR, ryInner, end, start, true)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  // --- Gap lines ---
  for (let i = 0; i < slices.length; i++) {
    const { end } = angles[i]
    const pop = getPopOffset(i)

    ctx.beginPath()
    ctx.moveTo(cx + pop.dx + Math.cos(end) * innerR, cy + pop.dy + Math.sin(end) * ryInner)
    ctx.lineTo(cx + pop.dx + Math.cos(end) * outerR, cy + pop.dy + Math.sin(end) * ryOuter)
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

export default function AssetAllocationChart() {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState(-1)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; idx: number } | null>(null)

  const allocationData: Slice[] = [
    { label: t('common.metal'), value: 50, amount: '625.0M ₫', color: '#eab308', darkColor: '#a16207', icon: '📀' },
    { label: t('common.crypto'), value: 30, amount: '375.0M ₫', color: '#a855f7', darkColor: '#7e22ce', icon: '₿' },
    { label: t('common.stock'), value: 20, amount: '250.0M ₫', color: '#06b6d4', darkColor: '#0e7490', icon: '📈' },
  ]

  const dataRef = useRef(allocationData)
  dataRef.current = allocationData

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDonut3D(canvas, dataRef.current, hovered)
  }, [hovered])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawDonut3D(canvas, dataRef.current, hovered)

    const handleResize = () => drawDonut3D(canvas, dataRef.current, hovered)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return
      // offsetX/offsetY maps correctly even with CSS 3D transforms
      const mx = e.nativeEvent.offsetX
      const my = e.nativeEvent.offsetY
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const cx = w / 2
      const cy = h / 2 - DEPTH / 2 + 4
      const outerR = Math.min(w, h) / 2 - 20
      const innerR = outerR * CUTOUT

      const idx = hitTest(mx, my, cx, cy, outerR, innerR, dataRef.current)
      setHovered(idx)
      if (idx >= 0) {
        setTooltip({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, idx })
      } else {
        setTooltip(null)
      }
    },
    [],
  )

  const handleMouseLeave = useCallback(() => {
    setHovered(-1)
    setTooltip(null)
  }, [])

  return (
    <div className="flex h-full flex-col rounded-2xl border border-edge bg-panel p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-heading">{t('dashboard.allocation')}</h3>
      </div>

      {/* Content: Chart (top) + Legend (bottom) */}
      <div className="flex flex-1 flex-col items-center gap-0">
        {/* 3D Chart */}
        <div className="relative shrink-0 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="h-[260px] w-[260px] cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          {/* Center text */}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            style={{ marginTop: '-7px' }}
          >
            <span className="font-['JetBrains_Mono'] text-[26px] font-bold tracking-tight text-heading">
              1.25
            </span>
            <span className="mt-0.5 text-xs font-medium text-caption">tỷ ₫</span>
          </div>

          {/* Tooltip */}
          {tooltip && tooltip.idx >= 0 && (
            <div
              className="pointer-events-none absolute z-50 rounded-lg border border-edge-strong bg-panel-alt px-4 py-3 shadow-xl"
              style={{
                left: Math.min(tooltip.x + 12, 120),
                top: Math.max(tooltip.y - 50, 0),
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: allocationData[tooltip.idx].color }}
                />
                <span className="text-sm font-semibold text-heading">
                  {allocationData[tooltip.idx].label}
                </span>
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="font-['JetBrains_Mono'] text-lg font-bold text-heading">
                  {allocationData[tooltip.idx].value}%
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-caption">
                  {allocationData[tooltip.idx].amount}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-1">
          {allocationData.map((item, i) => (
            <div
              key={item.label}
              className={`group flex items-center gap-4 rounded-xl px-3 py-2 transition-colors ${
                hovered === i ? 'bg-field/60' : 'hover:bg-field/50'
              }`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => { setHovered(-1); setTooltip(null) }}
            >
              {/* Dot */}
              <div
                className="size-2.5 shrink-0 rounded-full transition-transform"
                style={{
                  backgroundColor: item.color,
                  transform: hovered === i ? 'scale(1.4)' : 'scale(1)',
                }}
              />

              {/* Label */}
              <span className="flex-1 text-sm font-medium text-body">{item.label}</span>

              {/* Amount */}
              <span className="font-['JetBrains_Mono'] text-xs text-caption">
                {item.amount}
              </span>

              {/* Percentage */}
              <span
                className="w-12 text-right font-['JetBrains_Mono'] text-sm font-bold"
                style={{ color: item.color }}
              >
                {item.value}%
              </span>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
