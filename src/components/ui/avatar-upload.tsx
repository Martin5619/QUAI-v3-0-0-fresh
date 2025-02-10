"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserIcon } from "@/components/ui/icons"

interface AvatarUploadProps {
  value?: string
  onChange?: (value: string) => void
  className?: string
  userId?: string
}

export const AvatarUpload = ({ value, onChange, className, userId }: AvatarUploadProps) => {
  const [preview, setPreview] = useState(value)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setPreview(base64String)
          onChange?.(base64String)
        }
        reader.readAsDataURL(file)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
  })

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className="relative flex items-center justify-center"
      >
        <input {...getInputProps()} />
        <Avatar className="h-24 w-24 cursor-pointer hover:opacity-75 transition-opacity">
          <AvatarImage src={preview} alt="Profile picture" />
          <AvatarFallback>
            <UserIcon className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        {isDragActive && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
            <UserIcon className="h-8 w-8 text-muted-foreground animate-pulse" />
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-center text-muted-foreground">
        Click or drag to upload
      </p>
    </div>
  )
}

AvatarUpload.displayName = "AvatarUpload"
