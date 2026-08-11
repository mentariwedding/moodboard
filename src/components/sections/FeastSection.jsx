import { FOOD_STYLES, CAKE_STYLES } from '../../lib/constants'
import { Field, TextArea, Select } from '../ui'
import { Note } from './common'
import Icon from '../../lib/icons'

export default function FeastSection({ data, update }) {
  return (
    <div className="space-y-6">
      <Field label="Gaya penyajian" hint="Serving style">
        <Select value={data.style || ''} onChange={(e) => update({ style: e.target.value })}>
          <option value="">— pilih —</option>
          {FOOD_STYLES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
      </Field>

      <Field label="Menu wajib / favorit kalian" hint="Must-have dishes">
        <TextArea rows={2} value={data.mustHave || ''} onChange={(e) => update({ mustHave: e.target.value })} placeholder="cth: rendang, sate, es dawet…" />
      </Field>

      <Field label="Alergi / menu yang TIDAK boleh ada" hint="Allergies & foods to avoid — penting untuk katering">
        <TextArea rows={2} value={data.allergies || ''} onChange={(e) => update({ allergies: e.target.value })} placeholder="cth: seafood, kacang…" />
      </Field>

      <Field label="Gaya kue pengantin" hint="Wedding cake style">
        <Select value={data.cake || ''} onChange={(e) => update({ cake: e.target.value })}>
          <option value="">— pilih —</option>
          {CAKE_STYLES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
      </Field>

      <Field label="Catatan makanan" hint="Anything else about food">
        <TextArea rows={2} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: sebagian tamu vegetarian…" />
      </Field>

      <Note><Icon name="feast" className="mr-1.5 inline h-3.5 w-3.5" /><b>Tips:</b> menu lengkap biasanya disesuaikan budget saat rapat — tapi tulis alergi di sini, itu wajib!</Note>
    </div>
  )
}
