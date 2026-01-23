import { Footer } from '@/components/layouts/Footer'
import { Navigation } from '@/components/ui/navigation'
import { itemMetadata } from '#/config/metadata'

export default function ArticleLayout({ children }) {
  return (
    <div className='flex flex-col justify-center mx-auto w-full'>
      <Navigation />
      {children}
      <Footer />
    </div>
  )
}

export const metadata = { ...itemMetadata }

