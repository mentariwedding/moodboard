import { Field, TextArea, TextInput } from '../ui'
import { Note } from './common'
import Icon from '../../lib/icons'
import { linkType, fetchLinkMeta } from '../../lib/utils'

const MOMENTS = ['Akad / Prosesi', 'Resepsi / Party', 'First Dance', 'Foto & Video', 'Lainnya']

function SongRow({ song, index, onChange, onRemove }) {
  const type = linkType(song.url)
  const set = (patch) => onChange(index, { ...song, ...patch })

  // Saat link di-paste, coba ambil judul otomatis via oEmbed (Spotify/YouTube)
  const handleUrl = async (url) => {
    const clean = url.trim()
    if (!song.title?.trim() && clean) {
      const meta = await fetchLinkMeta(clean)
      if (meta.title) set({ url: clean, title: meta.title })
      else set({ url: clean })
    } else {
      set({ url: clean })
    }
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {MOMENTS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => set({ moment: m })}
              className={`rounded-full border px-3 py-1 text-[11px] transition-all ${
                song.moment === m ? 'border-ink bg-ink text-ivory' : 'border-ink/15 text-stone hover:border-gold hover:text-gold'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="shrink-0 rounded-full p-2 text-stone transition hover:text-rose"
          title="Hapus lagu"
        >
          <Icon name="trash" className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <TextInput value={song.title} onChange={(e) => set({ title: e.target.value })} placeholder="Judul lagu / artis" />
        <div className="relative">
          <TextInput
            value={song.url}
            onChange={(e) => set({ url: e.target.value })}
            onBlur={(e) => handleUrl(e.target.value)}
            placeholder="Link Spotify / YouTube (opsional)"
            className="pr-9"
          />
          {type !== 'link' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone">
              <Icon name={type} className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PlaylistSection({ data, update }) {
  const songs = data.songs || []
  const onChange = (i, patch) => {
    const next = [...songs]
    next[i] = patch
    update({ songs: next })
  }
  const addSong = () => update({ songs: [...songs, { moment: MOMENTS[0], title: '', url: '' }] })
  const removeSong = (i) => update({ songs: songs.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink">Lagu-lagu untuk momen spesial kalian</p>
        <p className="mb-3 -mt-1 text-xs text-stone">
          Tempel link Spotify / YouTube — judulnya otomatis terisi. Videografer & tim musik sangat terbantu dengan ini!
        </p>
        {songs.length > 0 && <div className="space-y-3">{songs.map((s, i) => <SongRow key={i} song={s} index={i} onChange={onChange} onRemove={removeSong} />)}</div>}
        <button
          type="button"
          onClick={addSong}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-ink/25 px-4 py-2 text-sm text-stone transition hover:border-gold hover:text-gold"
        >
          <Icon name="plus" className="h-3.5 w-3.5" /> Tambah lagu
        </button>
      </div>

      <Field label="Lagu yang TIDAK boleh diputar" hint="Sangat membantu tim musik & MC">
        <TextArea rows={2} value={data.doNotPlay || ''} onChange={(e) => update({ doNotPlay: e.target.value })} placeholder="cth: lagu dangdut, lagu sedih…" />
      </Field>

      <Field label="Catatan musik lainnya">
        <TextArea rows={2} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: first dance pakai lagu …" />
      </Field>

      <Note><Icon name="music" className="mr-1.5 inline h-3.5 w-3.5" /><b>Tips:</b> link Spotify/YouTube paling membantu — tim bisa langsung dengar lagunya. Tanpa link juga tidak apa-apa, judul saja sudah cukup.</Note>
    </div>
  )
}
