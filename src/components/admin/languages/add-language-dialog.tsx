"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"

interface LanguageFormData_v2414 {
  name: string
  code: string
  direction: "ltr" | "rtl"
  fallbackLocale: string
  autoTranslate: boolean
}

export const AddLanguageDialog_v2414 = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<LanguageFormData_v2414>({
    name: "",
    code: "",
    direction: "ltr",
    fallbackLocale: "en",
    autoTranslate: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement language addition logic
    console.log("Adding language:", formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Language</DialogTitle>
          <DialogDescription>
            Add a new language to the platform. This will create the necessary
            translation files and configuration.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g. French"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g. fr"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direction" className="text-right">
                Direction
              </Label>
              <Select
                value={formData.direction}
                onValueChange={(value: "ltr" | "rtl") =>
                  setFormData({ ...formData, direction: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                  <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fallback" className="text-right">
                Fallback
              </Label>
              <Select
                value={formData.fallbackLocale}
                onValueChange={(value) =>
                  setFormData({ ...formData, fallbackLocale: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select fallback language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="autoTranslate" className="text-right">
                Auto-translate
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="autoTranslate"
                  checked={formData.autoTranslate}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, autoTranslate: checked })
                  }
                />
                <Label htmlFor="autoTranslate">
                  Use AI to generate initial translations
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Language</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
