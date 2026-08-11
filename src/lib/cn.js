export default function join(...cls) {
  return cls.filter(Boolean).join(' ')
}
