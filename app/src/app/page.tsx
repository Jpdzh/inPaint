'use client';

import { Button, Divider, Image } from '@nextui-org/react';
import { useRef, useState } from 'react';
import { UploadIcon } from 'lucide-react';
import Link from 'next/link';

function SectionOne() {
  return (
    <div className='grid grid-cols-2 mb-16'>
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
    <div className='grid grid-cols-2 mt-16'>
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
  return (
    <main className='container min-w-16 mx-auto max-w-8xl flex-grow'>
      <section className='flex flex-col justify-center items-center bg-[url("/assets/butterfly.png")] bg-[right_5rem_top_5rem] bg-[length:40%] bg-no-repeat'>
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

          </>
        )} */}
        </div>

        <Divider className='my-4' />
      </section>
      <UploadPage />
    </main>
  );
}

function UploadPage() {
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
    <div className='flex items-center justify-evenly my-16 bg-[url("/assets/butterfly.png")] bg-[right_5rem_top_5rem] bg-[length:40%] bg-no-repeat'>
      <div className='flex relative w-[50%] aspect-square items-center justify-center'>
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
        {selectedImage ? (
          <Image
            src={URL.createObjectURL(selectedImage)}
            className='w-[80%] h-[80%] aspect-square object-contain'
            removeWrapper
          />
        ) : (
          <p>暂未选择图片</p>
        )}
      </div>
      <div className='flex flex-col gap-36'>
        <div className='flex justify-center items-center'>
          <Image
            src='/assets/按键1.png'
            width={48}
            radius='none'
            className='-rotate-90'
          />
          <Button
            variant='light'
            endContent={<UploadIcon size={16} />}
            onPress={handleButtonClick}
          >
            请选择图片
          </Button>
          <Image
            src='/assets/按键1.png'
            width={48}
            radius='none'
            className='rotate-90'
          />

          <input
            type='file'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept='image/*'
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
            as={Link}
            isDisabled={selectedImage === undefined}
            href={`/edit?url=${
              selectedImage ? URL.createObjectURL(selectedImage) : ''
            }`}
          >
            确认
          </Button>

          <Image
            src='/assets/按键1.png'
            width={48}
            radius='none'
            className='rotate-90'
          />
        </div>
      </div>
    </div>
  );
}
