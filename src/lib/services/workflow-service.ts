import { prisma } from "@/lib/prisma"
import { type Locale } from "@/i18n.config"
import { LanguageCode_v2414, type User_v2414 } from "@prisma/client"
import { type User_v3 } from "@/lib/types-v3"

interface ProjectCreateInput_v2414 {
  name: string
  description?: string
  sourceLocale: Locale
  targetLocales: Locale[]
  dueDate?: Date
  teamMembers: {
    userId: string
    role: "translator" | "reviewer" | "manager"
  }[]
}

interface TaskCreateInput_v2414 {
  projectId: string
  sourceText: string
  translation?: string
  targetLocale: Locale
  priority?: number
  assignedTo?: string
  dueDate?: Date
}

interface ProjectCreateInput_v3 {
  name: string
  description?: string
  sourceLocale: string
  targetLocales: string[]
  createdById: string
}

interface TaskCreateInput_v3 {
  title: string
  description?: string
  projectId: string
  targetLocale: string
  assigneeId?: string
  dueDate?: Date
}

export async function createProject_v2414(
  data: ProjectCreateInput_v2414,
  userId: string
) {
  const sourceLanguage = LanguageCode_v2414[data.sourceLocale.toUpperCase()]
  const targetLanguages = data.targetLocales.map(
    (locale) => LanguageCode_v2414[locale.toUpperCase()]
  )

  return prisma.translationProject_v2414.create({
    data: {
      name: data.name,
      description: data.description,
      sourceLocale: sourceLanguage,
      targetLocales: targetLanguages,
      status: "draft",
      dueDate: data.dueDate,
      createdBy: userId,
      teamMembers: {
        create: data.teamMembers.map((member) => ({
          userId: member.userId,
          role: member.role,
        })),
      },
    },
    include: {
      teamMembers: {
        include: {
          user: true,
        },
      },
    },
  })
}

export async function createTask_v2414(
  data: TaskCreateInput_v2414,
  userId: string
) {
  const project = await prisma.translationProject_v2414.findUnique({
    where: { id: data.projectId },
  })

  if (!project) {
    throw new Error("Project not found")
  }

  const task = await prisma.translationTask_v2414.create({
    data: {
      projectId: data.projectId,
      sourceText: data.sourceText,
      translation: data.translation,
      sourceLocale: project.sourceLocale,
      targetLocale: LanguageCode_v2414[data.targetLocale.toUpperCase()],
      status: "pending",
      priority: data.priority || 0,
      assignedTo: data.assignedTo,
      dueDate: data.dueDate,
    },
  })

  // Create task history
  await prisma.taskHistory_v2414.create({
    data: {
      taskId: task.id,
      userId,
      action: "created",
      details: { status: "pending" },
    },
  })

  return task
}

export async function updateTaskStatus_v2414(
  taskId: string,
  status: string,
  userId: string,
  comment?: string
) {
  const task = await prisma.translationTask_v2414.findUnique({
    where: { id: taskId },
    include: {
      project: true,
    },
  })

  if (!task) {
    throw new Error("Task not found")
  }

  // Update task status
  const updatedTask = await prisma.translationTask_v2414.update({
    where: { id: taskId },
    data: {
      status,
      reviewedBy: status === "approved" || status === "rejected" ? userId : undefined,
    },
  })

  // Create task history
  await prisma.taskHistory_v2414.create({
    data: {
      taskId,
      userId,
      action: "status-changed",
      details: { from: task.status, to: status },
    },
  })

  // Add comment if provided
  if (comment) {
    await prisma.taskComment_v2414.create({
      data: {
        taskId,
        userId,
        content: comment,
      },
    })
  }

  // Update project progress
  await updateProjectProgress_v2414(task.projectId)

  return updatedTask
}

export async function assignTask_v2414(
  taskId: string,
  assigneeId: string,
  userId: string
) {
  const task = await prisma.translationTask_v2414.update({
    where: { id: taskId },
    data: {
      assignedTo: assigneeId,
      status: "in-progress",
    },
  })

  await prisma.taskHistory_v2414.create({
    data: {
      taskId,
      userId,
      action: "assigned",
      details: { assigneeId },
    },
  })

  return task
}

export async function addTaskComment_v2414(
  taskId: string,
  userId: string,
  content: string
) {
  return prisma.taskComment_v2414.create({
    data: {
      taskId,
      userId,
      content,
    },
    include: {
      user: true,
    },
  })
}

async function updateProjectProgress_v2414(projectId: string) {
  const tasks = await prisma.translationTask_v2414.findMany({
    where: { projectId },
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(
    (task) => task.status === "approved"
  ).length

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  await prisma.translationProject_v2414.update({
    where: { id: projectId },
    data: {
      progress,
      status:
        progress === 100
          ? "completed"
          : progress > 0
          ? "in-progress"
          : "draft",
    },
  })
}

export async function getProjectStats_v2414(projectId: string) {
  const [tasks, teamMembers, comments] = await Promise.all([
    prisma.translationTask_v2414.findMany({
      where: { projectId },
    }),
    prisma.projectMember_v2414.findMany({
      where: { projectId },
      include: {
        user: true,
      },
    }),
    prisma.taskComment_v2414.findMany({
      where: {
        task: {
          projectId,
        },
      },
    }),
  ])

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    inReview: tasks.filter((t) => t.status === "review").length,
    approved: tasks.filter((t) => t.status === "approved").length,
    rejected: tasks.filter((t) => t.status === "rejected").length,
  }

  const teamStats = teamMembers.reduce(
    (acc, member) => ({
      ...acc,
      [member.role]: (acc[member.role] || 0) + 1,
    }),
    {} as Record<string, number>
  )

  return {
    taskStats,
    teamStats,
    totalComments: comments.length,
  }
}

export async function createProject_v3(
  data: ProjectCreateInput_v3,
  user: User_v3
) {
  const project = await prisma.project_v3.create({
    data: {
      name: data.name,
      description: data.description,
      status: "active",
      progress: 0,
      sourceLocale: data.sourceLocale,
      targetLocales: data.targetLocales,
      createdById: user.id,
    },
  })

  return project
}

export async function createTask_v3(
  data: TaskCreateInput_v3,
  user: User_v3
) {
  const project = await prisma.project_v3.findUnique({
    where: { id: data.projectId },
  })

  if (!project) {
    throw new Error("Project not found")
  }

  const task = await prisma.task_v3.create({
    data: {
      title: data.title,
      description: data.description,
      status: "pending",
      projectId: data.projectId,
      targetLocale: data.targetLocale,
      assigneeId: data.assigneeId,
      dueDate: data.dueDate,
      createdById: user.id,
    },
  })

  await prisma.activity_v3.create({
    data: {
      type: "task.created",
      description: `Task "${task.title}" created`,
      metadata: {
        taskId: task.id,
        projectId: task.projectId,
      },
      userId: user.id,
    },
  })

  return task
}

export async function updateTaskStatus_v3(
  taskId: string,
  status: string,
  comment?: string,
  user: User_v3
) {
  const task = await prisma.task_v3.findUnique({
    where: { id: taskId },
  })

  if (!task) {
    throw new Error("Task not found")
  }

  if (task.status === status) {
    return task
  }

  const updatedTask = await prisma.task_v3.update({
    where: { id: taskId },
    data: { status },
  })

  await prisma.activity_v3.create({
    data: {
      type: "task.status_updated",
      description: `Task status updated to "${status}"`,
      metadata: {
        taskId: task.id,
        projectId: task.projectId,
        oldStatus: task.status,
        newStatus: status,
      },
      userId: user.id,
    },
  })

  if (comment) {
    await prisma.comment_v3.create({
      data: {
        content: comment,
        taskId: task.id,
        userId: user.id,
      },
    })
  }

  await updateProjectProgress_v3(task.projectId)

  return updatedTask
}

export async function assignTask_v3(
  taskId: string,
  assigneeId: string,
  user: User_v3
) {
  const task = await prisma.task_v3.update({
    where: { id: taskId },
    data: { assigneeId },
  })

  await prisma.activity_v3.create({
    data: {
      type: "task.assigned",
      description: `Task assigned to user`,
      metadata: {
        taskId: task.id,
        projectId: task.projectId,
        assigneeId,
      },
      userId: user.id,
    },
  })

  return task
}

export async function addTaskComment_v3(
  taskId: string,
  content: string,
  user: User_v3
) {
  return prisma.comment_v3.create({
    data: {
      content,
      taskId,
      userId: user.id,
    },
  })
}

async function updateProjectProgress_v3(projectId: string) {
  const tasks = await prisma.task_v3.findMany({
    where: { projectId },
  })

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  await prisma.project_v3.update({
    where: { id: projectId },
    data: { progress },
  })
}

export async function getProjectStats_v3(projectId: string) {
  const [tasks, members, comments] = await Promise.all([
    prisma.task_v3.findMany({
      where: { projectId },
    }),
    prisma.projectMember_v3.findMany({
      where: { projectId },
    }),
    prisma.comment_v3.findMany({
      where: { task: { projectId } },
    }),
  ])

  return {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((task) => task.status === "completed").length,
    inProgressTasks: tasks.filter((task) => task.status === "in_progress").length,
    totalMembers: members.length,
    totalComments: comments.length,
  }
}
