import { PHOTO_STYLES, MUST_SHOTS } from '../../lib/constants'
import { Field, TextArea } from '../ui'
import { ChipGroup, Note } from './common'
import Icon from '../../lib/icons'

export default function PhotoSection({ data, update }) {
  return (
    <div className="space-y-6">
      <Field label="Gaya foto yang disukai" hint="Photography style">
        <ChipGroup allowMultiple options={PHOTO_STYLES} value={data.styles || []} onChange={(styles) => update({ styles })} />
      </Field>

      <Field label="Momen yang WAJIB diabadikan" hint="Must-have shots — tim foto & video akan memastikan ini ada">
        <ChipGroup allowMultiple options={MUST_SHOTS} value={data.mustShots || []} onChange={(mustShots) => update({ mustShots })} />
      </Field>

      <Field label="Catatan foto & video" hint="Anything else: videography style, drone, dll">
        <TextArea rows={3} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: pengen ada video cinematic 3 menit, dan foto keluarga wajib…" />
      </Field>

      <Note><Icon name="photo" className="mr-1.5 inline h-3.5 w-3.5" /><b>Tips:</b> kalau ada foto gaya dari IG/Pinterest, tempel link-nya di seksi Referensi — itu lebih jelas daripada deskripsi.</Note>
    </div>
  )
}
