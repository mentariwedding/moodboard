import { useState, useRef, useEffect } from 'react'
import join from '../lib/cn'
import Icon from '../lib/icons'

export function Btn({ children, onClick, kind = 'primary', size = 'md', className = '', disabled, type = 'button', title }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed'
  const kinds = {
    primary: 'bg-ink text-ivory hover:bg-gold hover:shadow-soft',
    gold: 'bg-gold text-white hover:bg-[#9A7745] shadow-soft',
    outline: 'border border-ink/25 text-ink hover:border-gold hover:text-gold bg-white/60',
    ghost: 'text-stone hover:text-ink',
    soft: 'bg-cream text-ink hover:bg-goldlight/40',
    danger: 'bg-white border border-rose/40 text-rose hover:bg-rose/5',
    white: 'bg-white text-ink border border-ink/10 hover:shadow-soft',
  }
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-sm',
  }
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={join(base, kinds[kind], sizes[size], className)}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={join('min-w-0 bg-white rounded-2xl shadow-card border border-ink/5 p-5', className)}>
      {children}
    </div>
  )
}

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={join('block', className)}>
      <span className="block text-[13px] font-medium text-ink mb-1.5">{label}</span>
      {hint && <span className="block text-xs text-stone mb-1.5 -mt-0.5">{hint}</span>}
      {children}
    </label>
  )
}

export const inputCls =
  'w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-stone/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition'

export function TextInput(props) {
  return <input {...props} className={join(inputCls, props.className)} />
}

export function TextArea(props) {
  return <textarea rows={props.rows || 3} {...props} className={join(inputCls, 'resize-none', props.className)} />
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={join(inputCls, 'appearance-none pr-8 bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%238A8178%27 stroke-width=%272%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.9rem_center]')}>
      {children}
    </select>
  )
}

export function Badge({ children, color = 'gold' }) {
  const map = {
    gold: 'bg-goldlight/30 text-[#8a6a3a]',
    green: 'bg-emerald-100 text-emerald-700',
    gray: 'bg-cream text-stone',
    red: 'bg-rose/10 text-rose',
  }
  return (
    <span className={join('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium', map[color])}>
      {children}
    </span>
  )
}

export function TagChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={join(
        'rounded-full border px-3.5 py-1.5 text-[13px] transition-all',
        active
          ? 'border-ink bg-ink text-ivory shadow-sm'
          : 'border-ink/15 bg-white text-ink/80 hover:border-gold hover:text-gold',
      )}
    >
      {label}
    </button>
  )
}

export function ProgressBar({ value, className = '', accent }) {
  const w = `${Math.min(100, Math.max(0, value))}%`
  return (
    <div className={join('h-1.5 w-full rounded-full bg-ink/10 overflow-hidden', className)}>
      <div
        className={join('h-full rounded-full transition-all duration-500', !accent && 'bg-gradient-to-r from-gold to-goldlight')}
        style={accent ? { width: w, background: `linear-gradient(90deg, ${accent}, ${accent}cc)` } : { width: w }}
      />
    </div>
  )
}

export function CheckIcon({ checked, className = '' }) {
  return (
    <span
      className={join(
        'inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold transition-all',
        checked ? 'bg-gold border-gold text-white' : 'border-ink/25 text-transparent',
        className,
      )}
    >
      <Icon name="check" className="h-2.5 w-2.5" />
    </span>
  )
}

export function PhotoPicker({ value, onPick, onRemove, label }) {
  const inputRef = useRef(null)
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-ink/25 bg-cream/50 text-stone hover:border-gold hover:text-gold transition"
      >
        {value ? (
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <Icon name="cameraRetro" className="h-4 w-4" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-ink">{label}</p>
        {value && (
          <button type="button" onClick={onRemove} className="text-xs text-rose hover:underline mt-0.5">
            Hapus foto
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onPick(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-white/50 px-6 py-14 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-display text-xl text-ink">{title}</p>
      {desc && <p className="mt-1 max-w-sm text-sm text-stone">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={join('animate-pulse rounded-xl bg-ink/5', className)} />
}

export function Spinner({ className = '' }) {
  return (
    <span
      className={join(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-ink/20 border-t-gold',
        className,
      )}
    />
  )
}

export function Toast({ toasts, remove }) {
  useEffect(() => {
    if (!toasts.length) return
    const t = setTimeout(() => remove(toasts[0].id), toasts[0].duration || 2600)
    return () => clearTimeout(t)
  }, [toasts, remove])

  return (
    <div className="fixed left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2" style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 rounded-full bg-ink text-ivory px-5 py-2.5 text-sm shadow-soft animate-[fadeUp_.25s_ease]"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
            <Icon name={t.icon || 'check'} className="h-3 w-3" />
          </span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)
  const add = (msg, icon) => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, msg, icon }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }
  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id))
  return { toasts, add, remove }
}
