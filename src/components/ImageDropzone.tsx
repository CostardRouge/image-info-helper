import { useState } from "react";
import EXIF from "exif-js";
import { Upload } from "lucide-react";

interface ImageDropzoneProps {
  setImage: (image: string) => void;
  setExifData: (data: any) => void;
}

const ImageDropzone = ({ setImage, setExifData }: ImageDropzoneProps) => {
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

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        
        // Create an image element to properly load the image for EXIF extraction
        const img = new Image();
        img.onload = function() {
          EXIF.getData(img as any, function(this: any) {
            const exifData = {
              iso: EXIF.getTag(this, "ISOSpeedRatings"),
              shutterSpeed: EXIF.getTag(this, "ExposureTime"),
              aperture: EXIF.getTag(this, "FNumber"),
            };
            setExifData(exifData);
          });
        };
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`w-full max-w-2xl aspect-video rounded-lg border-2 border-dashed transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              Drop your image here
            </p>
            <p className="text-sm text-gray-500">or click to upload</p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ImageDropzone;