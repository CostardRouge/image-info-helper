import React, { useState } from "react";
import { Upload } from "lucide-react";

interface ImageDropzoneProps {
  onImageDrop: (data: File) => void;
  children: React.ReactNode;
  className?: string;
}

const ImageDropzone = ({ onImageDrop, className, children }: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    onImageDrop(file);
  };

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={className}
    >
      {children ? children : (
          <div
            className={
              `w-full max-w-2xl aspect-video border-2 border-dashed transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`
            }
          >
            <label
              htmlFor="file-input"
              className="cursor-pointer"
            >
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-12 h-12 text-gray-400"/>
                {/*<div className="text-center">*/}
                {/*  <p className="text-lg font-medium text-gray-700">*/}
                {/*    Drop your image here*/}
                {/*  </p>*/}
                {/*  <p className="text-sm text-gray-500">or click to upload</p>*/}
                {/*</div>*/}
              </div>
            </label>
          </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="file-input"
      />
    </div>
  );
};

export default ImageDropzone;