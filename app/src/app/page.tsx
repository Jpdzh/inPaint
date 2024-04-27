"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import ReactImageEditor from "./components/react-img-editor";
import axios, { AxiosResponse } from "axios";

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
    if (!file) return;
    setSelectedImage(file);
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

interface SubmitRequest {
  model: string;
  img: string;
  masked_img: string;
}

interface SubmitResponse {
  model: string; // 'ddpm',  #模型
  original_img: string; // img_base64,  #原图
  masked_img: string; // masked_base64,  #masked
  inpainted_img: string; // inpainted_img_base64,  #修复后
  psnr: number; // psnr_score,  #指标
  ssmi: number; // ssim_score,
  lpips: number; // lpips_score
}

function Editor({ src, clearSrc }: DoodleCanvasProps) {
  const [submitResponse, setSubmitResponse] = useState<SubmitResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
          isLoading={isLoading}
          onPress={() => {
            const current = stageRef.current;
            if (current === undefined) return;
            const canvas = current.clearAndToCanvas({
              pixelRatio: current._pixelRatio,
            });
            canvas.toBlob(async (blob: any) => {
              setIsLoading(true);

              const submitRequest: SubmitRequest = {
                model: "fmm",
                img: src,
                masked_img: blob,
              };

              try {
                const _submitResponse = await axios.post<SubmitResponse>(
                  "http://localhost:5000/api/submit",
                  submitRequest
                );

                setSubmitResponse(() => _submitResponse.data);
              } catch (e) {
                alert(`提交失败 ${e}`);
              } finally {
                setIsLoading(false);
              }
            }, "image/*");
          }}
        >
          开始修复
        </Button>
      </CardFooter>
    </Card>
  );
}
