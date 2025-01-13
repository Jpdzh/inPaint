'use client';

import { Button, Divider, Image } from '@nextui-org/react';
import { UploadIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

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
            Artificial Intelligence Digital Restoration
          </p>

          <Image
            src='/assets/按键1.png'
            width={64}
            radius='none'
            className='rotate-90'
          />
        </div>

        <p className='w-[80%] font-serif'>
          　　With the development of deep learning algorithms, we have explored
          the possibility of applying deep learning technology to the field of
          ceramic restoration and have developed a porcelain pattern restoration
          system. This system can repair images uploaded by users through the
          DDPM algorithm in deep learning and display the comparison between the
          before and after restoration. The application of this algorithm can
          significantly improve the efficiency and quality of cultural relic
          restoration and reduce the pressure of restoration work.
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
            Traditional Manual Restoration
          </p>

          <Image
            src='/assets/按键1.png'
            width={64}
            radius='none'
            className='rotate-90'
          />
        </div>

        <p className='w-[80%] font-serif'>
          　　The fragility of porcelain materials leads to the damage of many
          exquisite patterns on porcelain, causing them to lose their original
          artistic essence and aesthetic value. Traditional manual restoration
          of porcelain is a complex and delicate task that requires
          professionals to assess the damage, clean, join, and fill in the
          missing parts. This process is highly technical and challenge to
          perform.
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
    <div className='bg-[url("/assets/蓝布背景.png")]'>
      <main className='container min-w-16 mx-auto max-w-8xl flex-grow'>
        <section className='flex flex-col justify-center items-center bg-[url("/assets/butterfly.png")] bg-[right_5rem_top_5rem] bg-[length:40%] bg-no-repeat'>
          <div className='flex flex-col justify-between w-full h-full bg-[url("/assets/cloud.png")] bg-[left_5rem_bottom_5rem] bg-[length:40%] bg-no-repeat'>
            <SectionOne />
            <SectionTwo />
          </div>

          <Divider className='my-4' />
        </section>
        <UploadPage />
      </main>
    </div>
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
          <p>No Selected Image</p>
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
            Please Select an Image
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
            Confirm
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
