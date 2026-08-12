import { Field, TextArea, TextInput } from '../ui'
import { Note } from './common'
import Icon from '../../lib/icons'

export default function AvoidSection({ data, update }) {
  const setAvoidColor = (i, v) => {
    const colors = [...(data.colors || ['', ''])]
    colors[i] = v
    update({ colors })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tema / gaya yang TIDAK diinginkan" hint="Themes you dislike">
          <TextInput value={data.themes || ''} onChange={(e) => update({ themes: e.target.value })} placeholder="cth: tidak mau tema rustic" />
        </Field>
        <Field label="Warna yang TIDAK diinginkan" hint="Colors to avoid">
          <TextInput value={data.colors?.[0] || ''} onChange={(e) => setAvoidColor(0, e.target.value)} placeholder="cth: merah menyala" />
        </Field>
      </div>

      <Field label="Hal-hal lain yang TIDAK diinginkan" hint="Anything else you do NOT want — dekor, musik, makanan, acara…">
        <TextArea rows={4} value={data.notes || ''} onChange={(e) => update({ notes: e.target.value })} placeholder="cth: tidak mau ada kembang api, tidak mau lagu dangdut, tidak mau sambutan terlalu panjang…" />
      </Field>

      <Note><Icon name="avoid" className="mr-1.5 inline h-3.5 w-3.5" /><b>Ini seksi paling berharga!</b> Semakin jujur kalian di sini, semakin sedikit kemungkinan salah paham di hari-H. Tenang, semua jawaban hanya dilihat WO kalian.</Note>
    </div>
  )
}
