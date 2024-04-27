"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import { Table, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import ReactImageEditor from "./components/react-img-editor";
import axios, { AxiosError, AxiosResponse } from "axios";

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

  return !submitResponse ? (
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
            canvas.toBlob(async (blob: Blob) => {
              const submitRequest: SubmitRequest = {
                model: "fmm",
                img: src,
                masked_img: await blob.text(),
              };

              try {
                setIsLoading(true);

                const response = await fetch("http://localhost:5000/api/submit", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(submitRequest),
                });

                const _submitResponse:SubmitResponse =  await response.json();

                setSubmitResponse(() => _submitResponse);
              } catch (e) {
                console.log(e)
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
  ) : (
    <ResultView submitResponse={submitResponse} />
  );
}

function ResultView({ submitResponse }: { submitResponse: SubmitResponse }) {
  return (
    <Card>
      <CardHeader>
        <h4 className='font-medium text-large'>修复结果分析</h4>
      </CardHeader>
      <CardBody className='flex gap-8'>
        <div>
          <Image src={submitResponse.original_img} />
          <Image src={submitResponse.masked_img} />
          <Image src={submitResponse.inpainted_img} />
        </div>
        <Table aria-label='result table'>
          <TableHeader>
            <TableColumn>模型名称</TableColumn>
            <TableColumn>SSIM</TableColumn>
            <TableColumn>PSNR</TableColumn>
            <TableColumn>LPIPS</TableColumn>
          </TableHeader>
          <TableBody>
            <TableRow key='1'>
              <TableCell>{submitResponse.model}</TableCell>
              <TableCell>{submitResponse.ssmi}</TableCell>
              <TableCell>{submitResponse.psnr}</TableCell>
              <TableCell>{submitResponse.lpips}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
      <CardFooter>
        <Textarea
          isDisabled
          label='评估指标说明'
          labelPlacement='outside'
          defaultValue='SSIM (Structural Similarity Index)：结构相似性指数，通过比较图像的结构信息和亮度信息来评估两张图像之间的相似度。
          PSNR (Peak Signal to Noise Ratio)：峰值信噪比，通过计算图像的均方误差（MSE）来衡量两张图像之间的差异度，然后将 MSE 转换为对数尺度。
          LPIPS (Learned Perceptual Image Patch Similarity)：学习感知图像块相似度，通过预训练神经网络模型提取图像的高级特征，并比较这些特征的差异，从而更准确地反映人类的视觉感知。'
          className='max-w-xs'
        />
      </CardFooter>
    </Card>
  );
}
