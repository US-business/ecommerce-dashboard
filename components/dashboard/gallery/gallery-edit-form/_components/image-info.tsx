"use client"

interface ImageInfoProps {
  fileName: string
  width?: number
  height?: number
  fileSize?: number
}

export function ImageInfo({ fileName, width, height, fileSize }: ImageInfoProps) {
  return (
    <div className="text-center">
      <h3 className="font-medium">{fileName}</h3>
      <p className="text-sm text-gray-500">
        {width && height && `${width} × ${height}`}
        {fileSize ? ` • ${(fileSize / 1024 / 1024).toFixed(2)} MB` : ""}
      </p>
    </div>
  )
}
