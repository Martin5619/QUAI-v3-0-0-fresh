"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, X } from "lucide-react"

interface Item {
  value: string
  label: string
}

interface MultiSelectComboboxProps {
  items: Item[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function MultiSelectCombobox({
  items,
  selectedValues,
  onChange,
  placeholder = "Select items...",
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const selectedItems = items.filter((item) => selectedValues.includes(item.value))
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-h-[40px] h-auto w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="mr-1 mb-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(selectedValues.filter((value) => value !== item.value))
                  }}
                >
                  {item.label}
                  <Button
                    asChild
                    variant="ghost"
                    className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-[300px]">
        <Command shouldFilter={false} className="border-0">
          <CommandInput 
            placeholder="Search..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-0 focus:ring-0"
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {filteredItems.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={() => {
                  onChange(
                    selectedValues.includes(item.value)
                      ? selectedValues.filter((value) => value !== item.value)
                      : [...selectedValues, item.value]
                  )
                }}
                className="flex items-center gap-2"
              >
                <div className="flex items-center flex-1">
                  <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                    {selectedValues.includes(item.value) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span>{item.label}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
