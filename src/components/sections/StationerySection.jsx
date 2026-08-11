import { STATIONERY_TYPES, STATIONERY_STYLES, MONOGRAM_STYLES } from '../../lib/constants'
import FontPicker from '../FontPicker'
import { Field, TextArea, Select } from '../ui'
import { ChipGroup, Note } from './common'
import Icon from '../../lib/icons'

export default function StationerySection({ data, update }) {
  return (
    <div className="space-y-6">
      <Field label="Jenis undangan" hint="Invitation type">
        <Select value={data.type || ''} onChange={(e) => update({ type: e.target.value })}>
          <option value="">— pilih —</option>
          {STATIONERY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
      </Field>

      <Field label="Gaya huruf (font) undangan" hint="Pilih font yang paling mewakili — contoh memakai nama kalian">
        <FontPicker value={data.fontStyle || ''} onChange={(fontStyle) => update({ fontStyle })} coupleName="Salsabila & Raka" />
      </Field>

      <Field label="Gaya desain undangan" hint="Design style">
        <ChipGroup allowMultiple options={STATIONERY_STYLES} value={data.style || []} onChange={(style) => update({ style })} />
      </Field>

      <Field label="Monogram / logo pasangan" hint="Monogram preference">
        <Select value={data.monogram || ''} onChange={(e) => update({ monogram: e.target.value })}>
          <option value="">— pilih —</option>
          {MONOGRAM_STYLES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </Select>
      </Field>

      <Field label="Catatan undangan & branding" hint="Notes: fonts, motif, bahasa undangan…">
        <TextArea rows={3} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: undangan bilingual ID-EN, ada motif bunga…" />
      </Field>

      <Note><Icon name="stationery" className="mr-1.5 inline h-3.5 w-3.5" /><b>Info:</b> kalau masih belum kepikiran, boleh dikosongkan — desain undangan dibahas setelah konsep besar disetujui.</Note>
    </div>
  )
}
