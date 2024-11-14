'use client';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Code,
  Image,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from '@nextui-org/react';
import { useRef, useState } from 'react';
import ReactImageEditor from './components/react-img-editor';
import axios from 'axios';

function SectionOne() {
  return (
    <div className='grid grid-cols-2'>
      <Image
        src='/assets/上方瓷盘.png'
        className='w-screen grid-cols-2 aspect-[2/1] object-cover object-bottom'
        removeWrapper
      />
      <div className='flex flex-col items-center m-8'>
        <div className='flex h-16 items-center m-4 '>
          <Image
            src='/assets/按键1.png'
            width={64}
            radius='none'
            className='-rotate-90'
          />
          <p className='font-serif font-bold text-4xl text-nowrap'>
            人工智能数字化修复
          </p>

          <Image
            src='/assets/按键1.png'
            width={64}
            radius='none'
            className='rotate-90'
          />
        </div>

        <p className='w-[80%] font-serif'>
          　　随着深度学习算法的发展，我们探索了将深度学习技术应用于陶瓷修复领域的可能性，并制作了本瓷盘纹样修复系统。本系统能将用户上传的图像通过深度学习算法中的如
          DDPM（Denosing Diffusion Probabilistic
          Models）对图像进行修复，并展示修复前后的对比图。通过该算法的应用，能够显著提高文物修复效率和质量，减轻修复工作的压力。
        </p>
      </div>
    </div>
  );
}

function SectionTwo() {
  return (
    <div className='grid grid-cols-2'>
      <div className='flex flex-col items-center m-8'>
        <div className='flex h-16 items-center m-4 '>
          <Image
            src='/assets/按键1.png'
            width={64}
            radius='none'
            className='-rotate-90'
          />
          <p className='font-serif font-bold text-4xl text-nowrap'>
            传统手工修复
          </p>

          <Image
            src='/assets/按键1.png'
            width={64}
            radius='none'
            className='rotate-90'
          />
        </div>

        <p className='w-[80%] font-serif'>
          　　瓷器材料的易碎导致许多瓷器上的精美图案发生破损，失去了原本的艺术精髓和美学价值。传统的人工修复瓷器是一项复杂且精细的工作，需要专业人员评估破损情况、清洁处理、接合和填补缺损等流程，技术含量高且修复难度大。
        </p>
      </div>
      <Image
        src='/assets/下方.png'
        className='w-screen grid-cols-2 aspect-[2/1] object-cover object-top'
        removeWrapper
      />
    </div>
  );
}

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
    <main className='container min-w-16 mx-auto max-w-8xl flex-grow'>
      <section className='flex flex-col justify-center items-center h-screen bg-[url("/assets/butterfly.png")] bg-[right_5rem_top_5rem] bg-[length:40%] bg-no-repeat'>
        <div className='flex flex-col justify-between w-full h-full bg-[url("/assets/cloud.png")] bg-[left_5rem_bottom_5rem] bg-[length:40%] bg-no-repeat'>
          <SectionOne />
          <SectionTwo />

          {/* {selectedImage !== undefined ? (
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
        )} */}
        </div>
      </section>
    </main>
  );
}
interface DoodleCanvasProps {
  src: string;
  clearSrc: () => void;
}

enum Model {
  fmm = 'fmm',
  ddpm = 'ddpm',
}

interface SubmitRequest {
  model: Model;
  img: string;
  masked_img: string;
}

interface SubmitResponse {
  model: Model; // 'ddpm',  #模型
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
  const [selectedModel, setSelectedModel] = useState(Model.fmm);
  const stageRef = useRef<any>();

  const models = Object.entries(Model).map(([_, value]) => value);

  return !submitResponse ? (
    <Card>
      <CardHeader className='flex justify-between items-start'>
        <div className='flex flex-col gap-1'>
          <h4 className='font-medium text-large'>编辑器</h4>
          <p className='text-tiny text-foreground-600 uppercase font-bold'>
            请在图片上进行涂鸦
          </p>
        </div>
        <RadioGroup
          label='选择模型'
          size='sm'
          defaultValue={selectedModel}
          onValueChange={(value) =>
            setSelectedModel(models.find((e) => e == value)!)
          }
        >
          {models.map((key) => (
            <Radio value={key}>{key}</Radio>
          ))}
        </RadioGroup>
      </CardHeader>
      <CardBody>
        <ReactImageEditor
          src={src}
          getStage={(stage) => (stageRef.current = stage)}
          defaultPluginName='pen'
          toolbar={{ items: [] }}
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            height: 'auto',
            width: 'auto',
            overflow: 'auto',
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
              try {
                setIsLoading(true);

                const imgBase64 = await getImageBase64(src);

                const submitRequest: SubmitRequest = {
                  model: selectedModel,
                  img: imgBase64!,
                  masked_img: await blobToBase64(blob),
                };

                const response = await axios.post<SubmitResponse>(
                  'http://localhost:5000/api/submit',
                  submitRequest
                );

                setSubmitResponse(() => response.data);
              } catch (e) {
                console.log(e);
                alert(`提交失败 ${e}`);
              } finally {
                setIsLoading(false);
              }
            }, 'image/*');
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
  console.log(submitResponse);

  return (
    <Card>
      <CardHeader>
        <h4 className='font-medium text-large'>修复结果分析</h4>
      </CardHeader>
      <CardBody className='flex gap-8'>
        <div className='flex gap-8 px-4'>
          <div className='flex flex-col justify-center items-center gap-2'>
            <Image
              src={'data:image/png;base64,' + submitResponse.original_img}
            />
            <Code>原图</Code>
          </div>
          <div className='flex flex-col justify-center items-center gap-2'>
            <Image src={'data:image/png;base64,' + submitResponse.masked_img} />
            <Code color='secondary'>编辑后</Code>
          </div>
          <div className='flex flex-col justify-center items-center gap-2'>
            <Image
              src={'data:image/png;base64,' + submitResponse.inpainted_img}
            />
            <Code color='success'>修复后</Code>
          </div>
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
          defaultValue='SSIM (Structural Similarity Index)：结构相似性指数，通过比较图像的结构信息和亮度信息来评估两张图像之间的相似度。PSNR (Peak Signal to Noise Ratio)：峰值信噪比，通过计算图像的均方误差（MSE）来衡量两张图像之间的差异度，然后将 MSE 转换为对数尺度。LPIPS (Learned Perceptual Image Patch Similarity)：学习感知图像块相似度，通过预训练神经网络模型提取图像的高级特征，并比较这些特征的差异，从而更准确地反映人类的视觉感知。'
        />
      </CardFooter>
    </Card>
  );
}

async function fetchBlobImage(src: string): Promise<Blob> {
  const response = await fetch(src);
  const blob = await response.blob();
  return blob;
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result?.toString().split(',')[1] || '';
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function getImageBase64(src: string): Promise<string | null> {
  try {
    const blob = await fetchBlobImage(src);
    const base64String = await blobToBase64(blob);
    return base64String;
  } catch (error) {
    console.error('Error getting base64 image:', error);
    return null;
  }
}
