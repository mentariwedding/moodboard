import { STAGE_STYLES, FLOWER_SOURCES, FLOWERS, LIGHTING, SIGNAGE } from '../../lib/constants'
import { Field, TextArea, Select } from '../ui'
import { ChipGroup, Note } from './common'
import Icon from '../../lib/icons'

export default function DecorSection({ data, update }) {
  return (
    <div className="space-y-6">
      <Field label="Gaya pelaminan / backdrop utama" hint="Main stage & backdrop style">
        <Select value={data.stage || ''} onChange={(e) => update({ stage: e.target.value })}>
          <option value="">— pilih gaya —</option>
          {STAGE_STYLES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </Field>

      <Field label="Bunga: asli atau artificial?" hint="Real or artificial flowers">
        <Select value={data.flowersSource || ''} onChange={(e) => update({ flowersSource: e.target.value })}>
          <option value="">— pilih —</option>
          {FLOWER_SOURCES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </Select>
      </Field>

      <Field label="Bunga favorit (boleh pilih beberapa)" hint="Favorite flowers">
        <ChipGroup allowMultiple options={FLOWERS} value={data.flowersLike || []} onChange={(flowersLike) => update({ flowersLike })} />
      </Field>

      <Field label="Pencahayaan yang disukai" hint="Lighting preferences">
        <ChipGroup allowMultiple options={LIGHTING} value={data.lighting || []} onChange={(lighting) => update({ lighting })} />
      </Field>

      <Field label="Penataan meja tamu" hint="Table setting">
        <Select value={data.tables || ''} onChange={(e) => update({ tables: e.target.value })}>
          <option value="">— pilih gaya —</option>
          <option>Meja panjang family style</option>
          <option>Meja bundar klasik</option>
          <option>Campuran</option>
          <option>Belum tahu</option>
        </Select>
      </Field>

      <Field label="Signage / elemen tambahan" hint="Extra décor elements">
        <ChipGroup allowMultiple options={SIGNAGE} value={data.signage || []} onChange={(signage) => update({ signage })} />
      </Field>

      <Field label="Catatan dekorasi lainnya" hint="Anything else about décor">
        <TextArea rows={3} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: pengen ada taman kecil di depan pelaminan…" />
      </Field>

      <Note><Icon name="sprout" className="mr-1.5 inline h-3.5 w-3.5" /><b>Tips:</b> kalau belum tahu, kosongkan dulu — bagian ini bisa didiskusikan saat rapat desain. Yang penting mood-nya.</Note>
    </div>
  )
}
