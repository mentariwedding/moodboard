import { TagChip } from '../ui'

export function Note({ children, tone = 'gold' }) {
  const tones = {
    gold: 'bg-goldlight/20 border-gold/30 text-[#7a5c30]',
    soft: 'bg-cream border-ink/10 text-stone',
  }
  return (
    <div className={`rounded-xl border px-4 py-3 text-[13px] leading-relaxed ${tones[tone]}`}>
      {children}
    </div>
  )
}

export function ChipGroup({ options, value, onChange, allowMultiple = false, max = 99 }) {
  const toggle = (opt) => {
    if (!allowMultiple) {
      onChange(opt)
      return
    }
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt))
    else if (value.length < max) onChange([...value, opt])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <TagChip key={o} label={o} active={allowMultiple ? value.includes(o) : value === o} onClick={() => toggle(o)} />
      ))}
    </div>
  )
}

export function SectionTitle({ children }) {
  return <h3 className="font-display text-xl text-ink mb-2">{children}</h3>
}
