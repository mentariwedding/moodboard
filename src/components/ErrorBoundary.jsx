import { Component } from 'react'
import Icon from '../lib/icons'
import { logger } from '../lib/debug'

/**
 * Error boundary — kalau ada error tak terduga di dalam aplikasi,
 * tampilkan layar ramah (bukan blank putih) + tombol muat ulang.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    logger.error('ErrorBoundary menangkap error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ivory px-4">
          <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-soft">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose/10 text-rose">
              <Icon name="brokenHeart" className="h-6 w-6" />
            </span>
            <h1 className="mt-4 font-display text-2xl text-ink">Ups, terjadi kesalahan</h1>
            <p className="mt-2 text-sm text-stone">
              Sepertinya ada masalah tak terduga. Coba muat ulang halaman — kalau masih terjadi, hubungi tim
              Mentari Wedding ya.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-ivory transition hover:bg-gold"
            >
              <Icon name="rotate" className="h-4 w-4" /> Muat Ulang
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
