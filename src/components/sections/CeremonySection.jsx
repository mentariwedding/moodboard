import { CEREMONY_FORMATS, TRADITIONS, ENTERTAINMENT, MUSIC_STYLES } from '../../lib/constants'
import { Field, TextArea, Select, TextInput } from '../ui'
import { ChipGroup, Note } from './common'
import Icon from '../../lib/icons'

export default function CeremonySection({ data, update }) {
  return (
    <div className="space-y-6">
      <Field label="Format acara" hint="Event format">
        <Select value={data.format || ''} onChange={(e) => update({ format: e.target.value })}>
          <option value="">— pilih —</option>
          {CEREMONY_FORMATS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
      </Field>

      <Field label="Perkiraan jam mulai" hint="Estimated start time">
        <TextInput type="time" value={data.time || ''} onChange={(e) => update({ time: e.target.value })} />
      </Field>

      <Field label="Adat / tradisi yang wajib ada" hint="Traditions that must be included">
        <ChipGroup allowMultiple options={TRADITIONS} value={data.traditions || []} onChange={(traditions) => update({ traditions })} />
      </Field>

      <Field label="Hiburan" hint="Entertainment">
        <ChipGroup allowMultiple options={ENTERTAINMENT} value={data.entertainment || []} onChange={(entertainment) => update({ entertainment })} />
      </Field>

      <Field label="Gaya musik yang disukai" hint="Music style preferences">
        <ChipGroup allowMultiple options={MUSIC_STYLES} value={data.music || []} onChange={(music) => update({ music })} />
      </Field>

      <Field label="Catatan acara" hint="Notes about the ceremony flow">
        <TextArea rows={3} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: pengen akadnya khidmat, resepsinya meriah…" />
      </Field>

      <Note><Icon name="ceremony" className="mr-1.5 inline h-3.5 w-3.5" /><b>Info:</b> rangkaian acara final akan disusun WO bersama MC — bagian ini cuma untuk tahu preferensi kalian.</Note>
    </div>
  )
}
