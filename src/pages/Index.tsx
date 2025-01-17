import { useState } from "react";
import ImageDropzone from "@/components/ImageDropzone";
import ExifInfo from "@/components/ExifInfo";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [exifData, setExifData] = useState<any>(null);
  const [showExif, setShowExif] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative">
      {!image && <ImageDropzone setImage={setImage} setExifData={setExifData} />}
      
      {image && (
        <>
          <div className="max-w-4xl w-full relative">
            <img
              src={image}
              alt="Uploaded"
              className="max-w-full max-h-[70vh] object-contain mx-auto shadow-lg rounded-lg"
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