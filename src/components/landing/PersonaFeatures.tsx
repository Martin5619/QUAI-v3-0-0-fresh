'use client'

import { Button } from '@/components/ui/button'
import { GraduationCap, Users, UserCircle, ArrowRight } from 'lucide-react'

const personas = [
  {
    title: "Personal Learning Journey",
    description: "Transform your learning experience with AI-powered question generation. Perfect for self-study, exam preparation, and continuous learning.",
    icon: UserCircle,
    features: [
      "Personalized learning paths",
      "Adaptive question generation",
      "Progress tracking",
      "Study analytics"
    ],
    cta: "Start Learning",
    href: "/auth/signup?type=personal"
  },
  {
    title: "Empower Your Teaching",
    description: "Create engaging assessments and track student progress effortlessly. Ideal for educators looking to enhance their teaching methods.",
    icon: GraduationCap,
    features: [
      "Automated question creation",
      "Student performance insights",
      "Customizable assessments",
      "Class management"
    ],
    cta: "Enhance Teaching",
    href: "/auth/signup?type=teacher"
  },
  {
    title: "Corporate Learning Solutions",
    description: "Scale your organization's learning programs with intelligent assessment tools. Perfect for training managers and L&D professionals.",
    icon: Users,
    features: [
      "Team learning paths",
      "Progress monitoring",
      "Compliance tracking",
      "Performance analytics"
    ],
    cta: "Transform Learning",
    href: "/auth/signup?type=corporate"
  }
]

export function PersonaFeatures() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Learning Path
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover how QUAi can transform your learning experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => {
            const Icon = persona.icon
            return (
              <div
                key={persona.title}
                className="relative flex flex-col bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {persona.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {persona.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {persona.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-gray-600 dark:text-gray-300"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  className="mt-auto bg-purple-600 hover:bg-purple-700 text-white"
                  asChild
                >
                  <a href={persona.href}>
                    {persona.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
