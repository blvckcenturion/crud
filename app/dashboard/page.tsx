import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex py-5 px-5 flex-col items-center justify-between">
        <Button asChild>
            <Link href="/dashboard/product">
                Go to Product Page
            </Link>
        </Button>
    </div>
  )
}
