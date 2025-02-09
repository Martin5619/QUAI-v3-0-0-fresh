"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface MultiSelectComboboxProps {
  options: ComboboxOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
}

export function MultiSelectCombobox({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  emptyMessage = "No items found.",
  className,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options
    const search = searchQuery.toLowerCase()
    return options.filter(
      option => 
        option.label.toLowerCase().includes(search) || 
        option.description?.toLowerCase().includes(search)
    )
  }, [options, searchQuery])

  const selectedLabels = selected
    .map((value) => options.find((opt) => opt.value === value)?.label)
    .filter(Boolean)
    .join(", ")

  const handleSelect = React.useCallback((currentValue: string) => {
    const newSelected = selected.includes(currentValue)
      ? selected.filter((item) => item !== currentValue)
      : [...selected, currentValue]
    onChange(newSelected)
    // Don't close the popover when selecting
    setOpen(true)
  }, [selected, onChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between hover:bg-accent", className)}
        >
          {selected.length > 0 ? (
            <span className="truncate">
              {selected.length === 1 ? selectedLabels : `${selected.length} items selected`}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 shadow-lg bg-white border border-gray-200" 
        align="start"
        sideOffset={4}
      >
        <Command 
          className="w-full" 
          shouldFilter={false}
        >
          <CommandInput 
            placeholder="Search items..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-0 focus:ring-0"
          />
          <div className="max-h-64 overflow-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSelect(option.value)
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSelect(option.value)
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      <div className="h-4 w-4 rounded border border-gray-300 flex items-center justify-center">
                        {selected.includes(option.value) && (
                          <Check className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-gray-500 truncate">{option.description}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
