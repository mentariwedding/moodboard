import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart, faGem, faDove, faPalette, faSprout, faLeaf, faPersonDress, faUserTie,
  faUtensils, faEnvelopeOpenText, faCamera, faStar, faBan, faImages, faClock,
  faPenToSquare, faCircleCheck, faClipboardCheck, faCopy, faBell, faImage, faPrint,
  faQrcode, faPlus, faCheck, faXmark, faDownload, faLink, faArrowUpRightFromSquare,
  faWandMagicSparkles, faBookmark, faRotateLeft, faArrowLeft, faArrowRight,
  faTrashCan, faUpload, faCalendarDay, faLocationDot, faUsers, faWallet, faPhone,
  faMusic, faGuitar, faCakeCandles, faGift, faCrown, faArchway, faLightbulb,
  faChair, faSignsPost, faWineGlass, faChampagneGlasses, faBrush, faSignature,
  faEnvelope, faHeartCrack, faVideo, faFeather, faRing, faSeedling, faCameraRetro,
  faCircleInfo, faFaceLaughBeam, faUserGroup, faWandSparkles, faTable, faSheetPlastic,
  faEye, faCirclePlus, faEnvelopeCircleCheck, faLock, faDice, faEyeSlash, faMagnifyingGlassPlus, faComment, faPaperPlane,
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp, faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons'

/**
 * Peta ikon semantik — semua ikon aplikasi dipusatkan di sini.
 * Ganti emoji dengan ikon vektor Font Awesome agar tampilan konsisten & rapi.
 */
export const ICONS = {
  // brand & umum
  brand: faDove,
  heart: faHeart,
  gem: faGem,
  dove: faDove,
  // seksi moodboard
  couple: faHeart,
  vibe: faWandMagicSparkles,
  colors: faPalette,
  decor: faSprout,
  look: faPersonDress,
  ceremony: faRing,
  feast: faUtensils,
  stationery: faEnvelopeOpenText,
  photo: faCamera,
  priorities: faStar,
  avoid: faBan,
  references: faImages,
  // status proyek
  clock: faClock,
  pen: faPenToSquare,
  checkCircle: faCircleCheck,
  clipboardCheck: faClipboardCheck,
  // aksi
  copy: faCopy,
  wa: faWhatsapp,
  bell: faBell,
  image: faImage,
  print: faPrint,
  qrcode: faQrcode,
  plus: faPlus,
  check: faCheck,
  xmark: faXmark,
  download: faDownload,
  link: faLink,
  external: faArrowUpRightFromSquare,
  magic: faWandMagicSparkles,
  bookmark: faBookmark,
  rotate: faRotateLeft,
  arrowLeft: faArrowLeft,
  arrowRight: faArrowRight,
  trash: faTrashCan,
  upload: faUpload,
  // info & detail
  calendar: faCalendarDay,
  location: faLocationDot,
  users: faUsers,
  userGroup: faUserGroup,
  wallet: faWallet,
  phone: faPhone,
  music: faMusic,
  guitar: faGuitar,
  cake: faCakeCandles,
  gift: faGift,
  crown: faCrown,
  archway: faArchway,
  lightbulb: faLightbulb,
  chair: faChair,
  signs: faSignsPost,
  wine: faWineGlass,
  champagne: faChampagneGlasses,
  brush: faBrush,
  signature: faSignature,
  envelope: faEnvelope,
  brokenHeart: faHeartCrack,
  video: faVideo,
  feather: faFeather,
  leaf: faLeaf,
  sprout: faSprout,
  seedling: faSeedling,
  tie: faUserTie,
  dress: faPersonDress,
  cameraRetro: faCameraRetro,
  info: faCircleInfo,
  laugh: faFaceLaughBeam,
  wand: faWandSparkles,
  table: faTable,
  sheet: faSheetPlastic,
  eye: faEye,
  circlePlus: faCirclePlus,
  envelopeCheck: faEnvelopeCircleCheck,
  lock: faLock,
  dice: faDice,
  eyeSlash: faEyeSlash,
  search: faMagnifyingGlassPlus,
  spotify: faSpotify,
  youtube: faYoutube,
  comment: faComment,
  send: faPaperPlane,
}

/** Komponen ikon seragam — warna mengikuti currentColor. */
export default function Icon({ name, className = '', ...rest }) {
  const def = ICONS[name]
  if (!def) return null
  return <FontAwesomeIcon icon={def} className={className} {...rest} />
}

/** Ikon di dalam kotak kecil beraksen — dipakai untuk header seksi & kartu. */
export function IconBadge({ name, className = '', box = 'h-9 w-9', iconCls = 'h-4 w-4' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl ${box} ${className}`}
      style={{ background: 'var(--accent-light, #D6BE93)', color: 'var(--accent-text, #7a5c30)' }}
    >
      <Icon name={name} className={iconCls} />
    </span>
  )
}
