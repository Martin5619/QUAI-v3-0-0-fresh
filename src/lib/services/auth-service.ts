import { prisma } from "@/lib/prisma"
import { Role_v2414 } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getCurrentUser_v2414() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null

  return prisma.user_v2414.findUnique({
    where: { email: session.user.email },
  })
}

export async function getUserRole_v2414(userId: string) {
  const user = await prisma.user_v2414.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return user?.role
}

export async function isAdmin_v2414(userId: string) {
  const role = await getUserRole_v2414(userId)
  return role === Role_v2414.ADMIN || role === Role_v2414.SUPER_ADMIN
}

export async function canManageProject_v2414(userId: string, projectId: string) {
  const [userRole, projectMember] = await Promise.all([
    getUserRole_v2414(userId),
    prisma.projectMember_v2414.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    }),
  ])

  return (
    userRole === Role_v2414.ADMIN ||
    userRole === Role_v2414.SUPER_ADMIN ||
    projectMember?.role === "manager"
  )
}

export async function canEditTranslation_v2414(userId: string, taskId: string) {
  const [userRole, task] = await Promise.all([
    getUserRole_v2414(userId),
    prisma.translationTask_v2414.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            teamMembers: true,
          },
        },
      },
    }),
  ])

  if (!task) return false

  if (userRole === Role_v2414.ADMIN || userRole === Role_v2414.SUPER_ADMIN) {
    return true
  }

  const projectMember = task.project.teamMembers.find(
    (member) => member.userId === userId
  )

  return (
    projectMember?.role === "translator" ||
    projectMember?.role === "manager" ||
    task.assignedTo === userId
  )
}

export async function canReviewTranslation_v2414(userId: string, taskId: string) {
  const [userRole, task] = await Promise.all([
    getUserRole_v2414(userId),
    prisma.translationTask_v2414.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            teamMembers: true,
          },
        },
      },
    }),
  ])

  if (!task) return false

  if (userRole === Role_v2414.ADMIN || userRole === Role_v2414.SUPER_ADMIN) {
    return true
  }

  const projectMember = task.project.teamMembers.find(
    (member) => member.userId === userId
  )

  return projectMember?.role === "reviewer" || projectMember?.role === "manager"
}

export async function getUserPermissions_v2414(userId: string) {
  const [user, projectMemberships] = await Promise.all([
    prisma.user_v2414.findUnique({
      where: { id: userId },
    }),
    prisma.projectMember_v2414.findMany({
      where: { userId },
      include: {
        project: true,
      },
    }),
  ])

  if (!user) return null

  const isAdmin = user.role === Role_v2414.ADMIN || user.role === Role_v2414.SUPER_ADMIN
  const isSuperAdmin = user.role === Role_v2414.SUPER_ADMIN

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    permissions: {
      canManageUsers: isAdmin,
      canCreateProjects: isAdmin,
      canManageSettings: isSuperAdmin,
      canViewAnalytics: isAdmin,
      canRunQAJobs: isAdmin,
      projects: projectMemberships.map((membership) => ({
        projectId: membership.projectId,
        projectName: membership.project.name,
        role: membership.role,
        canEdit: membership.role === "translator" || membership.role === "manager",
        canReview: membership.role === "reviewer" || membership.role === "manager",
        canManage: membership.role === "manager",
      })),
    },
  }
}

import { prisma } from "@/lib/prisma"
import { User_v3 } from "@prisma/client"

export async function getUserById_v3(id: string) {
  const user = await prisma.user_v3.findUnique({
    where: { id },
  })
  return user
}

export async function getUserByEmail_v3(email: string) {
  const user = await prisma.user_v3.findUnique({
    where: { email },
  })
  return user
}

export async function updateUser_v3(id: string, data: Partial<User_v3>) {
  const user = await prisma.user_v3.update({
    where: { id },
    data,
  })
  return user
}
