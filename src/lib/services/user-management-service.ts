import { prisma } from "@/lib/prisma"
import { Role_v3, type User_v3 } from "@prisma/client"
import { hash } from "bcryptjs"

interface UserCreateInput_v3 {
  email: string
  name: string
  password: string
  role: Role_v3
}

interface UserUpdateInput_v3 {
  name?: string
  email?: string
  password?: string
  role?: Role_v3
}

export async function createUser_v3(data: UserCreateInput_v3) {
  const existingUser = await prisma.user_v3.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await hash(data.password, 10)

  return prisma.user_v3.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  })
}

export async function updateUser_v3(
  userId: string,
  data: UserUpdateInput_v3
) {
  if (data.password) {
    data.password = await hash(data.password, 10)
  }

  return prisma.user_v3.update({
    where: { id: userId },
    data,
  })
}

export async function deleteUser_v3(userId: string) {
  return prisma.user_v3.delete({
    where: { id: userId },
  })
}

export async function getUserByEmail_v3(email: string) {
  return prisma.user_v3.findUnique({
    where: { email },
  })
}

export async function getUserById_v3(id: string) {
  return prisma.user_v3.findUnique({
    where: { id },
  })
}

export async function listUsers_v3(
  page = 1,
  limit = 10,
  role?: Role_v3
) {
  const skip = (page - 1) * limit
  const where = role ? { role } : {}

  const [users, total] = await Promise.all([
    prisma.user_v3.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user_v3.count({ where }),
  ])

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function updateUserRole_v3(
  userId: string,
  role: Role_v3
) {
  return prisma.user_v3.update({
    where: { id: userId },
    data: { role },
  })
}

export async function updateUserProfile_v3(
  userId: string,
  data: {
    name?: string
    title?: string
    organization?: string
    bio?: string
    avatar?: string
    primaryLanguage?: string
    secondaryLanguages?: string[]
  }
) {
  return prisma.user_v3.update({
    where: { id: userId },
    data,
  })
}

export async function completeOnboarding_v3(
  userId: string,
  data: {
    role: Role_v3
    organization?: string
    title?: string
    primaryLanguage: string
    secondaryLanguages: string[]
  }
) {
  return prisma.user_v3.update({
    where: { id: userId },
    data: {
      ...data,
      onboarded: true,
    },
  })
}
