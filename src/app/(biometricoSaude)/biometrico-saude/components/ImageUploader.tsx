"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (file: File) => void
  initialImage?: string
}

export default function ImageUploader({ onImageUpload, initialImage }: ImageUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(initialImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Criar URL para preview da imagem
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      onImageUpload(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      onClick={handleClick}
      className="border-2 border-dashed border-gray-300 rounded-lg w-64 h-48 flex flex-col items-center justify-center bg-gray-50 cursor-pointer overflow-hidden relative"
    >
      {previewImage ? (
        <Image src={previewImage || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
      ) : (
        <div className="text-center">
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Clique para fazer upload da imagem</p>
          <p className="text-gray-400 text-sm">PNG, JPG, GIF até 10MB</p>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
    </div>
  )
}

