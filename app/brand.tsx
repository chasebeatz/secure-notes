import Link from 'next/link'

export default function Brand() {
  return <Link href="/" className="brand" aria-label="Secure Notes home"><span className="brand-mark" aria-hidden="true">&#8801;</span>Secure Notes<span className="sr-only"> home</span></Link>
}
