import type { Metadata } from 'next'
import ConnectClient from './ConnectClient'

export const metadata: Metadata = {
  title: 'Connect IconSearch',
  description: 'Securely connect your IconSearch account to the VS Code extension or Figma plugin.',
  robots: { index: false, follow: false },
}

type ConnectPageProps = {
  searchParams: Promise<{
    product?: string | string[]
    code?: string | string[]
    authError?: string | string[]
  }>
}

export default async function ConnectPage({ searchParams }: ConnectPageProps) {
  const params = await searchParams
  return (
    <ConnectClient
      product={typeof params.product === 'string' ? params.product : ''}
      code={typeof params.code === 'string' ? params.code : ''}
      authError={typeof params.authError === 'string' ? params.authError : ''}
    />
  )
}
