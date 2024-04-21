"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  user,
  useSelect,
} from "@nextui-org/react";
import { UploadIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactImageEditor from "react-img-editor";
import { useFilePicker } from "use-file-picker";
import { FileContent } from "use-file-picker/types";

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File>();

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <main className='container mx-auto max-w-7xl px-6 flex-grow'>
      <section className='flex justify-center items-center h-screen'>
        {selectedImage !== undefined ? (
          <Editor
            src={URL.createObjectURL(selectedImage)}
            clearSrc={() => setSelectedImage(undefined)}
          />
        ) : (
          <>
            <Button
              isDisabled={selectedImage !== undefined}
              color='primary'
              endContent={<UploadIcon size={16} />}
              onPress={handleButtonClick}
            >
              选择图片
            </Button>
            <input
              type='file'
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept='image/*'
            />
          </>
        )}
      </section>
    </main>
  );
}
interface DoodleCanvasProps {
  src: string;
  clearSrc: () => void;
}

function Editor({ src, clearSrc }: DoodleCanvasProps) {
  const stageRef = useRef<any>();

  return (
    <Card>
      <CardHeader className='flex flex-col items-start gap-1'>
        <h4 className='font-medium text-large'>编辑器</h4>
        <p className='text-tiny text-white/60 uppercase font-bold'>
          请在图片上进行涂鸦
        </p>
      </CardHeader>
      <CardBody>
        <ReactImageEditor
          src={src}
          getStage={(stage) => (stageRef.current = stage)}
          defaultPluginName='pen'
          toolbar={{ items: [] }}
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            height: "auto",
            width: "auto",
            overflow: "auto",
          }}
        />
      </CardBody>
      <CardFooter className='flex justify-end gap-2'>
        <Button onPress={clearSrc}>取消选择</Button>
        <Button
          color='primary'
          onPress={() => {
            const current = stageRef.current;
            if (current === undefined) return;
            const canvas = current.clearAndToCanvas({
              pixelRatio: current._pixelRatio,
            });
            canvas.toBlob((blob: any) => {
              const link = document.createElement("a");
              link.download = "";
              link.href = URL.createObjectURL(blob);
              link.click();
            }, "image/*");
          }}
        >
          开始修复
        </Button>
      </CardFooter>
    </Card>
  );
}
