"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const FeatureShowcase_v2414 = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Tailored Solutions for Everyone
        </h2>

        <Tabs defaultValue="education" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="corporate">Corporate</TabsTrigger>
            <TabsTrigger value="individual">Individual</TabsTrigger>
          </TabsList>

          {/* Education Features */}
          <TabsContent value="education">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                title="Smart Assessment Creation"
                description="Generate diverse question sets from your curriculum materials using AI"
                icon="📚"
              />
              <FeatureCard
                title="Learning Management"
                description="Comprehensive tools for course creation, student tracking, and grading"
                icon="📊"
              />
              <FeatureCard
                title="Student Analytics"
                description="Track progress and identify areas for improvement with detailed insights"
                icon="📈"
              />
            </div>
          </TabsContent>

          {/* Corporate Features */}
          <TabsContent value="corporate">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                title="Training Development"
                description="Create engaging training materials and assessments for your team"
                icon="💼"
              />
              <FeatureCard
                title="Performance Tracking"
                description="Monitor employee progress and identify skill gaps"
                icon="📋"
              />
              <FeatureCard
                title="Compliance Training"
                description="Ensure regulatory compliance with automated assessments"
                icon="✓"
              />
            </div>
          </TabsContent>

          {/* Individual Features */}
          <TabsContent value="individual">
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                title="Personal Learning"
                description="Create custom quizzes from your study materials"
                icon="📝"
              />
              <FeatureCard
                title="Progress Tracking"
                description="Monitor your learning journey with detailed analytics"
                icon="🎯"
              />
              <FeatureCard
                title="Flexible Practice"
                description="Generate unlimited practice questions to master any subject"
                icon="🔄"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Live Demo Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-8">See it in Action</h3>
          <div className="bg-secondary/20 rounded-xl p-8">
            {/* Interactive demo component will be added here */}
          </div>
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="text-4xl mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Feature details will be added here */}
      </CardContent>
    </Card>
  )
}
