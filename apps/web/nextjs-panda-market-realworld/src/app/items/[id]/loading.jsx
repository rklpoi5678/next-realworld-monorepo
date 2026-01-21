import React from 'react'

import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className='container mx-auto flex min-h-screen items-center justify-between'>
      <Spinner size="loading" />
    </div>
  )
}