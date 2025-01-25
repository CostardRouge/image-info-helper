import React, {useEffect, useRef, useState} from "react";
import ImageDropzone from "@/components/ImageDropzone";
import ExifInfo from "@/components/ExifInfo";
import { Button } from "@/components/ui/button";
import {Eye, EyeOff } from "lucide-react";
import ExifReader from 'exifreader';
import { ExifData } from "../types/types.ts";

const CanvasWithImage = ({ imageUrl, focalLength, aperture, shutterSpeed, iso }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      const maxCanvasWidth = 1350;
      const maxCanvasHeight = 1080;
      const borderSize = 300;
      const textPadding = 20; // Padding between image and text

      const targetWidth = image.width + borderSize * 2;
      const targetHeight = image.height + borderSize * 2 + 60; // Extra space for text

      const widthRatio = maxCanvasWidth / targetWidth;
      const heightRatio = maxCanvasHeight / targetHeight;
      const scaleRatio = Math.min(widthRatio, heightRatio, 1);

      const canvasWidth = targetWidth * scaleRatio;
      const canvasHeight = targetHeight * scaleRatio;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scaledImageWidth = image.width * scaleRatio;
      const scaledImageHeight = image.height * scaleRatio;

      ctx.drawImage(
          image,
          borderSize * scaleRatio,
          borderSize * scaleRatio,
          scaledImageWidth,
          scaledImageHeight
      );

      // Draw metadata on a single line
      const text = [
        ``,
        ``,
        ``,
        `${focalLength} MM`,
        `ƒ/${aperture}`,
        `${shutterSpeed}s`,
        `ISO ${iso}`,
        ``,
        ``,
        ``,
      ];
      ctx.font = `${128 * scaleRatio}px Arial`;
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';

      // Calculate spacing and positions
      const textY = canvasHeight - textPadding * scaleRatio;
      const totalWidth = canvasWidth - borderSize * scaleRatio * 2;
      const sectionWidth = totalWidth / (text.length - 1);

      text.forEach((line, index) => {
        const textX = borderSize * scaleRatio + index * sectionWidth;
        ctx.fillText(line, textX, textY);
      });
    };
  }, [imageUrl, focalLength, aperture, shutterSpeed, iso]);

  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
  );
};

const Index = () => {
  const [image, setImage] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifData>(null);
  const [showExif, setShowExif] = useState(true);
  // console.log({
  //   exifData
  // })

  const handleImageDrop = (file) => {
    setExifData(null);
    setImage(null);

    ExifReader
        .load(file)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        .then( tags => {
          console.log(tags)

          setExifData({
            iso: tags?.ISOSpeedRatings?.description,
            shutterSpeed: {
              description: tags?.ExposureTime?.description,
              value: tags?.ExposureTime.value
            },
            focalLength: {
              description: tags?.FocalLength?.description,
              value: tags?.FocalLength.value
            },
            // lens: tags?.LensModel?.description,
            lens: tags?.Lens?.description,
            camera: {
              brand: tags?.Make?.description,
              model: tags?.Model.description
            },
            aperture: {
              description: tags?.FNumber?.description,
              value: tags?.FNumber?.value,
            },
            type: tags?.FileType?.description,
            date: new Date(tags?.DateCreated?.description),
            gps: {
              latitude: tags?.GPSLatitude?.description,
              longitude: tags?.GPSLongitude?.description,
            }
          });
        })

    if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setImage(URL.createObjectURL(file));
    }
    else {
      setImage(undefined)
    }
  }

  return (
    <ImageDropzone
      image={image}
      onImageDrop={handleImageDrop}
      onClick={() => setShowExif(!showExif)}
      className="bg-white flex flex-col items-center justify-center py-16 relative"
    >
      {/*{ image && (*/}
      {/*    <CanvasWithImage*/}
      {/*        imageUrl={image}*/}
      {/*        iso={exifData?.iso}*/}
      {/*        aperture={exifData.aperture}*/}
      {/*        shutterSpeed={exifData.shutterSpeed.description}*/}
      {/*        focalLength={exifData.focalLength.description}*/}
      {/*    />*/}
      {/*)}*/}

      {image && (
          <div className="max-w-4xl w-full relative">
            <img
                src={image}
                alt="Uploaded"
                className="max-w-full max-h-[70vh] object-contain mx-auto"
            />
          </div>
      )}

        <div className="absolute bottom-2">
          <ExifInfo exifData={exifData} visible={showExif} />
        </div>
    </ImageDropzone>
  );
};

export default Index;