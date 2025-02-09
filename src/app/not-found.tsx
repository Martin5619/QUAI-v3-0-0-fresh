import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        <h2 className="mt-4 text-2xl font-bold">Page not found</h2>
        <p className="mb-4 mt-2 text-muted-foreground">
          We couldn't find the page you were looking for.
        </p>
        <Button asChild>
          <Link href="/">
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}
