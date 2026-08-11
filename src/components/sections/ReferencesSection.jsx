import { useRef } from 'react'
import { Field, TextInput } from '../ui'
import { compressImage } from '../../lib/utils'
import { Note } from './common'
import Icon from '../../lib/icons'

export default function ReferencesSection({ data, update, uploadRef }) {
  const fileRef = useRef(null)
  const images = data.images || []
  const links = data.links || []

  const onFiles = async (files) => {
    const max = 12
    const room = max - images.length
    if (room <= 0) {
      alert(`Maksimal ${max} foto referensi — hapus beberapa dulu ya.`)
      return
    }
    const picked = files.slice(0, room)
    if (files.length > room) alert(`Hanya ${room} foto lagi yang bisa ditambahkan (maks. ${max}).`)
    for (const f of picked) {
      try {
        const dataUrl = await compressImage(f)
        const ref = await uploadRef(dataUrl)
        update({ images: [...(data.images || []), ref] })
      } catch (e) {
        alert('Gagal memuat foto: ' + e.message)
      }
    }
  }

  const removeImg = (i) => update({ images: images.filter((_, idx) => idx !== i) })

  const addLink = () => {
    const v = (document.getElementById('ref-link-input')?.value || '').trim()
    if (!v) return
    update({ links: [...links, v] })
    const el = document.getElementById('ref-link-input')
    if (el) el.value = ''
  }

  const removeLink = (i) => update({ links: links.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-medium text-ink">Upload foto inspirasi dari galeri HP kalian</p>
        <p className="mb-3 -mt-1.5 text-xs text-stone">Foto otomatis dikompres. Maksimal 12 foto — pilih yang paling mewakili.</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, i) => {
            const src = img.demo ? img.dataUrl : img.publicUrl || ''
            return (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-ink/10">
                <img src={src} alt={`referensi ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
                <button
                  type="button"
                  onClick={() => removeImg(i)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                  title="Hapus"
                >
                  <Icon name="xmark" className="h-3 w-3" />
                </button>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink/20 text-stone transition hover:border-gold hover:text-gold"
          >
            <Icon name="plus" className="h-5 w-5" />
            <span className="text-[11px] font-medium">Tambah foto</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) onFiles(Array.from(e.target.files))
              e.target.value = ''
            }}
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-ink">Tempel link inspirasi (Pinterest, Instagram, TikTok, dll)</p>
        <div className="flex gap-2">
          <TextInput id="ref-link-input" placeholder="cth: https://pin.it/xxxxx" className="flex-1" onKeyDown={(e) => e.key === 'Enter' && addLink()} />
          <button type="button" onClick={addLink} className="rounded-xl bg-ink px-4 text-sm text-ivory transition hover:bg-gold">
            Tambah
          </button>
        </div>
        {links.length > 0 && (
          <ul className="mt-3 space-y-2">
            {links.map((l, i) => (
              <li key={i} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm shadow-card border border-ink/5">
                <Icon name="link" className="h-3.5 w-3.5 text-stone" />
                <a href={l} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-ink underline-offset-2 hover:text-gold hover:underline">
                  {l}
                </a>
                <button type="button" onClick={() => removeLink(i)} className="text-stone hover:text-rose">
                  <Icon name="xmark" className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Note><Icon name="references" className="mr-1.5 inline h-3.5 w-3.5" /><b>Semua foto & link ini</b> akan dikumpulkan jadi satu di dashboard WO — jadi kalian tinggal serahkan "rasanya" ke sini, sisanya beres.</Note>
    </div>
  )
}
