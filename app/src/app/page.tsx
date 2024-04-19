"use client";

import { Button, Card, Image, useSelect } from "@nextui-org/react";
import { UploadIcon } from "lucide-react";
import { useFilePicker } from "use-file-picker";
import { FileContent } from "use-file-picker/types";

export default function HomePage() {
  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: ".png,.jpg",
    multiple: false,
  });

  console.log(filesContent);

  return (
    <main className='container mx-auto max-w-7xl px-6 flex-grow'>
      <section className='flex justify-center  items-center h-screen content-center'>
        {filesContent.length > 0 ? (
          <EditView path={filesContent[0]} />
        ) : (
          <Button
            isLoading={loading}
            isDisabled={filesContent.length > 0}
            color='primary'
            endContent={<UploadIcon size={16} />}
            onPress={openFilePicker}
          >
            上传图片
          </Button>
        )}
      </section>
    </main>
  );
}

function EditView({ path }: { path: FileContent<string> }) {
  return <Image alt={path.name} src={path.content} width={300}></Image>;
}
