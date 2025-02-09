import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-600">
      <Loader2 className="h-8 w-8 animate-spin mb-2" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
