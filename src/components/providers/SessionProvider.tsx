'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { createContext, useContext, useState } from 'react'

interface UserImageContextType {
  userImage: string | null
  setUserImage: (image: string | null) => void
}

const UserImageContext = createContext<UserImageContextType>({
  userImage: null,
  setUserImage: () => {},
})

export function useUserImage() {
  return useContext(UserImageContext)
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [userImage, setUserImage] = useState<string | null>(null)

  return (
    <NextAuthSessionProvider>
      <UserImageContext.Provider value={{ userImage, setUserImage }}>
        {children}
      </UserImageContext.Provider>
    </NextAuthSessionProvider>
  )
}
