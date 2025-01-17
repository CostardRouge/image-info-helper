import { useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import ExifInfo from "@/components/ExifInfo";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

import ExifReader from 'exifreader';

import { ExifData } from "../types/types.ts"

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData>(null);
  const [showExif, setShowExif] = useState(true);

  console.log({
    exifData
  })

  const handleImageDrop = (file) => {
    ExifReader
        .load(file)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .then( tags => {
          setExifData({
            iso: tags?.ISOSpeedRatings.description,
            shutterSpeed: tags?.ExposureTime.description,
            focalLength: tags?.FocalLength.description,
            lens: tags?.LensModel.description,
            model: `${tags?.Make.description} ${tags?.Model.description}`,
            // aperture: tags?.ApertureValue.description,
            aperture: tags?.FNumber.description.replace("f/", ""),
            type: tags?.FileType.description,
            date: new Date(tags?.DateCreated.description),
            gps: {
              latitude: tags?.GPSLatitude.description,
              longitude: tags?.GPSLongitude.description,
            }
          });
        })



    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
      {!image && <ImageDropzone onImageDrop={handleImageDrop} />}
      
      {image && (
        <>
          <div className="max-w-4xl w-full relative">
            <img
              src={image}
              alt="Uploaded"
              className="max-w-full max-h-[70vh] object-contain mx-auto shadow-lg"
            />
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center p-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowExif(!showExif)}
              className="absolute right-6 bottom-6"
            >
              {showExif ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
            
            <ExifInfo exifData={exifData} visible={showExif} />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;