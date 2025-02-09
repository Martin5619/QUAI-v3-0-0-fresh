export enum Role_v2414 {
  SUPER_ADMIN = "SUPER_ADMIN",
  TEACHER = "TEACHER",
  LEARNING_MANAGER = "LEARNING_MANAGER",
  STUDENT = "STUDENT",
  CORPORATE_USER = "CORPORATE_USER",
  PERSONAL = "PERSONAL"
}

export interface User_v2414 {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role_v2414: Role_v2414
  userType: "individual" | "organization"
  title?: string | null
  organization?: string | null
  bio?: string | null
  primaryLanguage?: string
  secondaryLanguages?: string[]
  onboardingStep?: string | null
  onboardingCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Project_v2414 {
  id: string
  name: string
  description?: string
  status: "draft" | "in_progress" | "completed" | "archived"
  progress: number
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  ownerId: string
  teamId?: string
}

export interface Activity_v2414 {
  id: string
  type: "translation" | "review" | "comment" | "project"
  description: string
  userId: string
  projectId?: string
  createdAt: Date
}

export interface Stats_v2414 {
  totalProjects: number
  totalTranslations: number
  totalWords: number
  completedProjects: number
  wordsThisMonth: number
  accuracy: number
}
