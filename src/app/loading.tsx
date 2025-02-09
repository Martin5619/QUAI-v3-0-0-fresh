import { Icons } from "@/components/icons"

export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <Icons.spinner className="h-10 w-10 animate-spin" />
      <h2 className="mt-4 text-2xl font-bold">Loading...</h2>
    </div>
  )
}
