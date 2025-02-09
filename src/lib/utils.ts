import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Define supported MIME types and their friendly names
export const SUPPORTED_MIME_TYPES = {
  // PDF
  'application/pdf': 'PDF',
  
  // Microsoft Office Formats
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.ms-powerpoint.presentation.macroEnabled.12': 'PPTM',
  'application/vnd.ms-powerpoint.template.macroEnabled.12': 'POTM',
  'application/vnd.openxmlformats-officedocument.presentationml.template': 'POTX',
  'application/vnd.ms-powerpoint.slideshow.macroEnabled.12': 'PPSM',
  'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'PPSX',
  'application/vnd.ms-excel.sheet.macroEnabled.12': 'XLSM',
  'application/vnd.ms-excel.template.macroEnabled.12': 'XLTM',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'XLTX',
  'application/vnd.ms-excel.addin.macroEnabled.12': 'XLAM',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12': 'XLSB',
  'application/vnd.ms-word.document.macroEnabled.12': 'DOCM',
  'application/vnd.ms-word.template.macroEnabled.12': 'DOTM',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'DOTX',

  // Google Workspace Formats
  'application/vnd.google-apps.document': 'Google Doc',
  'application/vnd.google-apps.spreadsheet': 'Google Sheet',
  'application/vnd.google-apps.presentation': 'Google Slides',
  'application/vnd.google-apps.form': 'Google Form',
  'application/vnd.google-apps.drawing': 'Google Drawing',
  'application/vnd.google-apps.script': 'Google Apps Script',
  'application/vnd.google-apps.site': 'Google Site',
  'application/vnd.google-apps.folder': 'Google Drive Folder',
  'application/vnd.google-apps.shortcut': 'Google Drive Shortcut',
  'application/vnd.google-apps.jam': 'Google Jamboard',

  // Plain Text
  'text/plain': 'TXT',
  'text/csv': 'CSV',
  'text/markdown': 'MD',
  'text/rtf': 'RTF',
  'application/json': 'JSON',
  'application/xml': 'XML',
  'text/xml': 'XML',
  'application/zip': 'ZIP',
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/gif': 'GIF',
} as const

export type SupportedMimeType = keyof typeof SUPPORTED_MIME_TYPES

// Get a user-friendly file type name from a MIME type
export function getReadableFileType(mimeType: string): string {
  return SUPPORTED_MIME_TYPES[mimeType as SupportedMimeType] || 'Unknown'
}

// Check if a MIME type is supported
export function isSupportedFileType(mimeType: string): boolean {
  return mimeType in SUPPORTED_MIME_TYPES
}

// Get a list of supported file extensions for display
export function getSupportedFileExtensions(): string[] {
  return Object.values(SUPPORTED_MIME_TYPES)
}

// Format file size in a human-readable way
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export const getFileExtension = (fileType: string): string => {
  const typeToExtension: { [key: string]: string } = {
    'application/pdf': 'PDF',
    'pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'docx': 'DOCX',
    'text/plain': 'TXT',
    'txt': 'TXT',
    'application/msword': 'DOC',
    'doc': 'DOC'
  }
  return typeToExtension[fileType.toLowerCase()] || fileType.toUpperCase()
}
