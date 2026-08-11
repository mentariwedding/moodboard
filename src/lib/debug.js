/**
 * Sistem logging terpusat untuk debugging.
 *
 * - Semua log (info/warn/error) dikumpulkan dengan timestamp & level.
 * - Tersimpan di memory + localStorage (max 200 entri) supaya bisa
 *   diperiksa setelah error terjadi.
 * - Bisa ditampilkan lewat panel debug (tekan Ctrl+Shift+D atau
 *   tambahkan ?debug=1 di URL).
 * - Di production, console.log ditekan (kecuali warn/error).
 */

const MAX_LOGS = 200
const LS_KEY = 'mw_debug_logs'
const isProd = import.meta.env.PROD

const logs = []
let listeners = []

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(logs.slice(-MAX_LOGS)))
  } catch {}
}

function push(level, args) {
  const entry = {
    t: new Date().toISOString(),
    level,
    msg: args
      .map((a) => {
        if (a instanceof Error) return a.message
        try {
          return typeof a === 'object' ? JSON.stringify(a) : String(a)
        } catch {
          return String(a)
        }
      })
      .join(' '),
  }
  logs.push(entry)
  if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS)
  persist()
  listeners.forEach((l) => l(entry))
}

export const logger = {
  info: (...args) => {
    if (!isProd) console.info('[mw]', ...args)
    push('info', args)
  },
  warn: (...args) => {
    console.warn('[mw]', ...args)
    push('warn', args)
  },
  error: (...args) => {
    console.error('[mw]', ...args)
    push('error', args)
  },
  getAll: () => [...logs],
  subscribe: (fn) => {
    listeners.push(fn)
    return () => {
      listeners = listeners.filter((l) => l !== fn)
    }
  },
  clear: () => {
    logs.length = 0
    try {
      localStorage.removeItem(LS_KEY)
    } catch {}
  },
}

// Muat log lama dari localStorage (jika ada)
try {
  const prev = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  if (Array.isArray(prev)) logs.push(...prev.slice(-MAX_LOGS))
} catch {}

// Tangkap error global yang tidak tertangkap (hanya di browser)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    push('error', [`Uncaught: ${e.message || e.type}`])
  })
  window.addEventListener('unhandledrejection', (e) => {
    push('error', [`Unhandled rejection: ${e.reason?.message || e.reason}`])
  })
}

/**
 * Panel debug — overlay kecil yang menampilkan log terbaru.
 * Dibuka dengan: Ctrl+Shift+D (atau Cmd+Shift+D di Mac), atau ?debug=1 di URL.
 */
export function initDebugPanel() {
  if (typeof document === 'undefined') return

  const urlDebug = new URLSearchParams(window.location.search).get('debug') === '1'
  let open = urlDebug

  // Buat elemen panel
  const panel = document.createElement('div')
  panel.id = 'mw-debug-panel'
  Object.assign(panel.style, {
    position: 'fixed',
    right: '12px',
    bottom: '12px',
    zIndex: '99999',
    width: 'min(420px, calc(100vw - 24px))',
    maxHeight: '60vh',
    background: 'rgba(20,18,16,0.94)',
    color: '#e8e4de',
    borderRadius: '12px',
    fontFamily: 'monospace',
    fontSize: '11px',
    lineHeight: '1.5',
    padding: '10px',
    display: open ? 'block' : 'none',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    overflowY: 'auto',
  })

  const render = () => {
    panel.innerHTML = ''
    const head = document.createElement('div')
    Object.assign(head.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px',
      fontWeight: 'bold',
      color: '#d6be93',
    })
    head.innerHTML = '<span>🐞 Debug — ' + logs.length + ' log</span>'
    const actions = document.createElement('div')
    actions.style.display = 'flex'
    actions.style.gap = '8px'
    const btnClear = document.createElement('button')
    btnClear.textContent = 'Bersihkan'
    btnClear.onclick = () => { logger.clear(); render() }
    const btnClose = document.createElement('button')
    btnClose.textContent = 'Tutup'
    btnClose.onclick = () => { open = false; panel.style.display = 'none' }
    for (const b of [btnClear, btnClose]) {
      Object.assign(b.style, {
        background: 'rgba(255,255,255,0.12)',
        border: 'none',
        color: '#e8e4de',
        borderRadius: '6px',
        padding: '2px 8px',
        fontSize: '10px',
        cursor: 'pointer',
      })
    }
    actions.appendChild(btnClear)
    actions.appendChild(btnClose)
    head.appendChild(actions)
    panel.appendChild(head)

    const body = document.createElement('div')
    if (!logs.length) {
      body.innerHTML = '<span style="opacity:.5">Belum ada log.</span>'
    } else {
      logs.slice(-60).forEach((l) => {
        const line = document.createElement('div')
        const color = l.level === 'error' ? '#ff8f8f' : l.level === 'warn' ? '#ffd27d' : '#9fd8a8'
        const time = new Date(l.t).toLocaleTimeString('id-ID')
        line.innerHTML = `<span style="opacity:.5">${time}</span> <b style="color:${color}">${l.level.toUpperCase()}</b> ${escapeHtml(l.msg)}`
        body.appendChild(line)
      })
    }
    panel.appendChild(body)
  }

  const escapeHtml = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  document.body.appendChild(panel)
  logger.subscribe(() => { if (open) render() })
  render()

  // Shortcut Ctrl+Shift+D
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault()
      open = !open
      panel.style.display = open ? 'block' : 'none'
      if (open) render()
    }
  })
}
