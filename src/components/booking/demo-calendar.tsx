"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export const DemoCalendar_v2414 = () => {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState<string>("")

  // Mock available time slots (will be fetched from API)
  const availableSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
  ]

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Schedule a Demo</CardTitle>
        <CardDescription>
          Choose a date and time for your personalized demo (UK timezone)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Calendar */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            disabled={(date) => {
              // Disable weekends and past dates
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return (
                date < today ||
                date.getDay() === 0 ||
                date.getDay() === 6
              )
            }}
          />

          {/* Time Slot Selection */}
          {date && (
            <div className="space-y-4">
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot} (UK)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Contact Information */}
          {timeSlot && (
            <div className="space-y-4">
              <Input placeholder="Your Name" />
              <Input placeholder="Company/School Name" />
              <Input type="email" placeholder="Email Address" />
              <Input placeholder="Phone Number (optional)" />
              <Select defaultValue="education">
                <SelectTrigger>
                  <SelectValue placeholder="Select your sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full" size="lg">
                Book Demo
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
