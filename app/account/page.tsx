import type { Metadata } from 'next'
import AccountClient from './AccountClient'

export const metadata: Metadata = {
  title: 'Your IconSearch Account',
  description: 'Manage IconSearch product access and connected extension sessions.',
  robots: { index: false, follow: false },
}

export default function AccountPage() {
  return <AccountClient />
}
