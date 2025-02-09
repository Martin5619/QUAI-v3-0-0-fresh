import { Role_v3 } from "@prisma/client"

export interface User_v3 {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  avatar: string | null
  password: string | null
  title: string | null
  organization: string | null
  bio: string | null
  primaryLanguage: string
  secondaryLanguages: string[]
  role: Role_v3
  onboarded: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Project_v3 {
  id: string
  name: string
  description: string | null
  status: string
  progress: number
  dueDate: Date | null
  createdAt: Date
  updatedAt: Date
  createdById: string
  createdBy: User_v3
}

export interface Activity_v3 {
  id: string
  type: string
  description: string
  metadata: Record<string, any>
  createdAt: Date
  userId: string
  user: User_v3
}

export interface Stats_v3 {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  totalMembers: number
  totalComments: number
}
