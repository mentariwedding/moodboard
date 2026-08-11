import { DRESS_STYLES, MAKEUP_STYLES, GROOM_STYLES } from '../../lib/constants'
import { Field, TextArea, Select, PhotoPicker } from '../ui'
import { Note } from './common'
import Icon from '../../lib/icons'

export default function LookSection({ data, update }) {
  return (
    <div className="space-y-6">
      <Field label="Gaya gaun pengantin" hint="Bride's dress style">
        <Select value={data.dress || ''} onChange={(e) => update({ dress: e.target.value })}>
          <option value="">— pilih gaya —</option>
          {DRESS_STYLES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Aksen / detail gaun" hint="Dress accent (warna, brokat, lace, dsb)">
          <Select value={data.dressAccent || ''} onChange={(e) => update({ dressAccent: e.target.value })}>
            <option value="">— pilih —</option>
            <option>Putih polos</option>
            <option>Brokat / payet</option>
            <option>Lace / renda</option>
            <option>Ada warna aksen (tulis di catatan)</option>
            <option>Belum tahu</option>
          </Select>
        </Field>
        <Field label="Gaya riasan" hint="Makeup style">
          <Select value={data.makeup || ''} onChange={(e) => update({ makeup: e.target.value })}>
            <option value="">— pilih —</option>
            {MAKEUP_STYLES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Gaya busana mempelai pria" hint="Groom's outfit">
        <Select value={data.groom || ''} onChange={(e) => update({ groom: e.target.value })}>
          <option value="">— pilih —</option>
          {GROOM_STYLES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </Select>
      </Field>

      <Field label="Foto referensi gaun / rias (opsional)" hint="Upload dress/makeup reference photos">
        <PhotoPicker
          value={data.outfitPhoto || ''}
          onPick={(f) => {
            const reader = new FileReader()
            reader.onload = () => update({ outfitPhoto: reader.result })
            reader.readAsDataURL(f)
          }}
          onRemove={() => update({ outfitPhoto: '' })}
          label="Foto gaun impian / riasan"
        />
      </Field>

      <Field label="Catatan busana & rias" hint="Accessories, veil, kebaya details…">
        <TextArea rows={3} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: pakai veil panjang, sepatu nyaman karena banyak berdiri…" />
      </Field>

      <Note><Icon name="look" className="mr-1.5 inline h-3.5 w-3.5" /><b>Tips:</b> foto referensi lebih membantu daripada deskripsi — kalau ada foto gaun impian, upload di seksi Referensi.</Note>
    </div>
  )
}
