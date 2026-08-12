import { Field, TextInput, Select } from '../ui'
import { BUDGET_RANGES, GUEST_RANGES } from '../../lib/constants'
import { todayISO } from '../../lib/utils'
import Icon from '../../lib/icons'

export default function CoupleSection({ data, update }) {
  const set = (k, v) => update({ [k]: v })
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={<span className="inline-flex items-center gap-1.5"><Icon name="dress" className="h-3.5 w-3.5 text-gold" /> Nama Mempelai Wanita *</span>} hint="Bride's full name">
          <TextInput value={data.brideName || ''} onChange={(e) => set('brideName', e.target.value)} placeholder="cth: Salsabila Putri" />
        </Field>
        <Field label={<span className="inline-flex items-center gap-1.5"><Icon name="tie" className="h-3.5 w-3.5 text-gold" /> Nama Mempelai Pria *</span>} hint="Groom's full name">
          <TextInput value={data.groomName || ''} onChange={(e) => set('groomName', e.target.value)} placeholder="cth: Raka Pratama" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tanggal Pernikahan" hint="Wedding date — kosongkan dulu kalau belum pasti">
          <TextInput type="date" min={todayISO()} value={data.weddingDate || ''} onChange={(e) => set('weddingDate', e.target.value)} />
        </Field>
        <Field label="Kota / Area" hint="City or area">
          <TextInput value={data.city || ''} onChange={(e) => set('city', e.target.value)} placeholder="cth: Bandung" />
        </Field>
      </div>

      <Field label="Venue / Lokasi (jika sudah ada)" hint="Venue (optional — boleh diisi nanti)">
        <TextInput value={data.venue || ''} onChange={(e) => set('venue', e.target.value)} placeholder="cth: The Lodge Maribaya, Hotel X Ballroom" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Perkiraan Jumlah Tamu" hint="Estimated guests">
          <Select value={data.guests || ''} onChange={(e) => set('guests', e.target.value)}>
            <option value="">— pilih —</option>
            {GUEST_RANGES.map((g) => (
              <option key={g} value={g}>{g} orang</option>
            ))}
          </Select>
        </Field>
        <Field label="Range Budget" hint="Budget range (perkiraan)">
          <Select value={data.budget || ''} onChange={(e) => set('budget', e.target.value)}>
            <option value="">— pilih —</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="No. WhatsApp (salah satu dari kalian)" hint="Biar WO bisa kabarin kalau moodboard sudah diterima">
        <TextInput type="tel" value={data.wa || ''} onChange={(e) => set('wa', e.target.value)} placeholder="cth: 0812xxxxxxx" />
      </Field>
    </div>
  )
}
