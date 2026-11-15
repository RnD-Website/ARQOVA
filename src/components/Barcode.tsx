/** Deterministic EAN-style barcode drawn as SVG bars. */
export function Barcode({ code = '9772026010019', className = '' }: { code?: string; className?: string }) {
  const bars: { x: number; w: number }[] = []
  let x = 0
  let seed = 7
  for (let i = 0; i < 46; i++) {
    seed = (seed * 9301 + 49297 + code.charCodeAt(i % code.length)) % 233280
    const w = 1 + (seed % 3)
    if (i % 2 === 0) bars.push({ x, w })
    x += w
  }
  const guard = (gx: number) => [{ x: gx, w: 1 }, { x: gx + 2, w: 1 }]
  const all = [...guard(-4), ...bars, ...guard(x + 1)]
  return (
    <div className={`barcode ${className}`} aria-label={`Barcode ${code}`} role="img">
      <svg viewBox={`-5 0 ${x + 9} 40`} preserveAspectRatio="none">
        {all.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={i < 2 || i >= all.length - 2 ? 40 : 34} fill="currentColor" />
        ))}
      </svg>
      <div className="barcode-num">
        <span>{code[0]}</span>
        <span>{code.slice(1, 7)}</span>
        <span>{code.slice(7)}</span>
      </div>
    </div>
  )
}
