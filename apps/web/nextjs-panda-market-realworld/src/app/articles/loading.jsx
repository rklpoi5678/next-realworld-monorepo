import React from 'react'

import { Spinner } from '@/components/ui/spinner'

export default function Loading() {
  return (
    <div className='flex min-h-screen'>
      <Spinner />
    </div>
  )
}