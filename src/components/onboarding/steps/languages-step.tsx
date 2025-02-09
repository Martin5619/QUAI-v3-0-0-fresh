"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { OnboardingStepProps } from "../onboarding-wizard"
import { Icons } from "@/components/icons"

const LANGUAGES = [
  {
    id: "en",
    name: "English",
    description: "English (US)",
    popular: true,
  },
  {
    id: "es",
    name: "Español",
    description: "Spanish",
    popular: true,
  },
  {
    id: "fr",
    name: "Français",
    description: "French",
    popular: true,
  },
  {
    id: "de",
    name: "Deutsch",
    description: "German",
    popular: true,
  },
  {
    id: "zh_hans",
    name: "简体中文",
    description: "Chinese (Simplified)",
    popular: true,
  },
  {
    id: "zh_hant",
    name: "繁體中文",
    description: "Chinese (Traditional)",
    popular: false,
  },
  {
    id: "ja",
    name: "日本語",
    description: "Japanese",
    popular: true,
  },
  {
    id: "ko",
    name: "한국어",
    description: "Korean",
    popular: true,
  },
  {
    id: "hi",
    name: "हिन्दी",
    description: "Hindi",
    popular: true,
  },
  {
    id: "ar",
    name: "العربية",
    description: "Arabic",
    popular: true,
  },
  {
    id: "ru",
    name: "Русский",
    description: "Russian",
    popular: true,
  },
  {
    id: "pt",
    name: "Português",
    description: "Portuguese",
    popular: true,
  },
  {
    id: "tr",
    name: "Türkçe",
    description: "Turkish",
    popular: false,
  },
  {
    id: "vi",
    name: "Tiếng Việt",
    description: "Vietnamese",
    popular: false,
  },
  {
    id: "id",
    name: "Bahasa Indonesia",
    description: "Indonesian",
    popular: false,
  }
]

export function LanguagesStep({ onNext, onBack }: OnboardingStepProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      await onNext({ primaryLanguage: selectedLanguage })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Choose Your Language</h2>
        <p className="text-muted-foreground mt-2">
          Select your preferred language for the QUAi interface. You can always change this later.
        </p>
      </div>

      <RadioGroup 
        value={selectedLanguage} 
        onValueChange={setSelectedLanguage}
        className="grid gap-4 md:grid-cols-2"
      >
        {LANGUAGES.map((language) => (
          <div key={language.id}>
            <RadioGroupItem
              value={language.id}
              id={language.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={language.id}
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div className="flex w-full items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{language.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {language.description}
                  </div>
                </div>
                {language.popular && (
                  <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Popular
                  </div>
                )}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
        </Button>
      </div>
    </div>
  )
}
