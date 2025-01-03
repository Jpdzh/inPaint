'use client';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Code,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from '@nextui-org/react';
import axios from 'axios';
import { redirect, useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import ReactImageEditor from '../components/react-img-editor';

export default function EditPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  if (url === null) redirect('404');

  const [submitResponse, setSubmitResponse] = useState<SubmitResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState(Model.fmm);
  const models = Object.entries(Model).map(([_, value]) => value);

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const stageRef = useRef<any>();

  return isConfirmed ? (
    <ResultView submitResponse={submitResponse!} />
  ) : (
    <div className='h-full bg-[url("/assets/蓝布背景.png")]'>
      <section className='container h-full min-w-16 mx-auto max-w-8xl flex-grow bg-[url("/assets/butterfly-2.png")] bg-[right_5rem_top_5rem] bg-[length:40%] bg-no-repeat'>
        <div className='flex h-full items-center justify-between bg-[url("/assets/phoenix.png")] bg-[left_5rem_bottom_5rem] bg-[length:40%] bg-no-repeat'>
          <div className='flex  relative w-[50%] aspect-square items-center justify-center'>
            <Image
              src='/assets/图片框.png'
              className='absolute top-0 left-0 rotate-90 w-[30%]  aspect-square'
              radius='none'
              removeWrapper
            />
            <Image
              src='/assets/图片框.png'
              className='absolute bottom-0 right-0 -rotate-90 w-[30%]  aspect-square'
              radius='none'
              removeWrapper
            />
            {submitResponse ? (
              <Image
                src={'data:image/png;base64,' + submitResponse.inpainted_img}
                width={256 * 1.5}
              />
            ) : (
              <ReactImageEditor
                src={url}
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
                  overflow: 'hidden',
                }}
              />
            )}
          </div>
          <div className='flex flex-col gap-36'>
            {submitResponse ? (
              <>
                <div className='flex justify-center items-center'>
                  <Image
                    src='/assets/按键1.png'
                    width={48}
                    radius='none'
                    className='-rotate-90'
                  />
                  <Button
                    variant='light'
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href =
                        'data:image/png;base64,' + submitResponse.inpainted_img;
                      link.download = '修复后.png';
                      link.click();
                    }}
                  >
                    保存图片
                  </Button>

                  <Image
                    src='/assets/按键1.png'
                    width={48}
                    radius='none'
                    className='rotate-90'
                  />
                </div>
                <div className='flex justify-center items-center'>
                  <Image
                    src='/assets/按键1.png'
                    width={48}
                    radius='none'
                    className='-rotate-90'
                  />
                  <Button variant='light' onClick={() => setIsConfirmed(true)}>
                    确认
                  </Button>
                  <Image
                    src='/assets/按键1.png'
                    width={48}
                    radius='none'
                    className='rotate-90'
                  />
                </div>
              </>
            ) : (
              <>
                <div className='flex justify-center items-center'>
                  <Image
                    src='/assets/按键1.png'
                    width={48}
                    radius='none'
                    className='-rotate-90'
                  />
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant='light'>{`请选择模型：${selectedModel}`}</Button>
                    </DropdownTrigger>
                    <DropdownMenu<Model>
                      selectionMode='single'
                      onAction={(key) => setSelectedModel(key as Model)}
                    >
                      {models.map((key) => (
                        <DropdownItem key={key}>{key}</DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>

                  <Image
                    src='/assets/按键1.png'
                    width={48}
                    radius='none'
                    className='rotate-90'
                  />
                </div>
                <div className='flex justify-center items-center'>
                  <Image
                    src='/assets/按键1.png'
                    width={48}
                    radius='none'
                    className='-rotate-90'
                  />

                  <Button
                    variant='light'
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

                          const imgBase64 = await getImageBase64(url);

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

                  <Image
                    src='/assets/按键1.png'
                    width={48}
                    radius='none'
                    className='rotate-90'
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

enum Model {
  fmm = 'fmm',
  ddpm = 'ddpm',
  gan = 'gan',
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

function ResultView({ submitResponse }: { submitResponse: SubmitResponse }) {
  const classNames = useMemo(
    () => ({
      th: ['bg-transparent', 'text-default-200', 'border-b', 'border-divider'],
      td: [
        // changing the rows border radius
        // first
        'group-data-[first=true]/tr:first:before:rounded-none',
        'group-data-[first=true]/tr:last:before:rounded-none',
        // middle
        'group-data-[middle=true]/tr:before:rounded-none',
        // last
        'group-data-[last=true]/tr:first:before:rounded-none',
        'group-data-[last=true]/tr:last:before:rounded-none',
      ],
    }),
    []
  );
  return (
    <div className='h-full flex flex-col items-center justify-center bg-gradient-to-r from-white via-blue-500 to-white'>
      <h4 className='font-medium w-full text-2xl text-blue-800 p-8 font-serif'>
        修复结果分析
      </h4>
      <section className='h-full flex flex-col gap-4 items-center justify-center container'>
        <Card className='border-none bg-transparent'>
          <CardBody>
            <div className='flex justify-center items-center gap-12 w-full px-4'>
              <div className='flex flex-col justify-center items-center gap-2'>
                <Image
                  src={'data:image/png;base64,' + submitResponse.original_img}
                  width={256 * 1.5}
                />
                <Code>原图</Code>
              </div>
              <div className='flex flex-col justify-center items-center gap-2'>
                <Image
                  src={'data:image/png;base64,' + submitResponse.masked_img}
                  width={256 * 1.5}
                />
                <Code color='warning'>编辑后</Code>
              </div>
              <div className='flex flex-col justify-center items-center gap-2'>
                <Image
                  src={'data:image/png;base64,' + submitResponse.inpainted_img}
                  width={256 * 1.5}
                />
                <Code color='success'>修复后</Code>
              </div>
            </div>
            <div>
              <Table
                aria-label='result table'
                removeWrapper
                classNames={classNames}
              >
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
            </div>
          </CardBody>
          <CardFooter>
            <Textarea
              isDisabled
              label='评估指标说明'
              fullWidth
              defaultValue='SSIM (Structural Similarity Index)：结构相似性指数，通过比较图像的结构信息和亮度信息来评估两张图像之间的相似度。PSNR (Peak Signal to Noise Ratio)：峰值信噪比，通过计算图像的均方误差（MSE）来衡量两张图像之间的差异度，然后将 MSE 转换为对数尺度。LPIPS (Learned Perceptual Image Patch Similarity)：学习感知图像块相似度，通过预训练神经网络模型提取图像的高级特征，并比较这些特征的差异，从而更准确地反映人类的视觉感知。'
            />
          </CardFooter>
        </Card>
      </section>
    </div>
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
