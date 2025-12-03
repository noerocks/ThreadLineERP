import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSignedURL } from "@/lib/actions/s3";
import { cn } from "@/lib/utils";
import { File, Loader2, X } from "lucide-react";
import React, { useCallback, useState, useTransition } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { ProductDTO } from "@/lib/DTO/product";
import { updateProductPhotoURL } from "@/lib/actions/product";

const FileUpload = ({ product }: { product: ProductDTO }) => {
  const [productFile, setPRoductFile] = useState<string | null>(
    product.photoURL
  );
  const [file, setFile] = useState<File | null>();
  const [pending, startTransition] = useTransition();
  const [progress, setProgress] = useState<number>(0);
  const [open, setOPen] = useState<boolean>();
  const unattachFile = () => {
    setFile(null);
  };
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const tooManyFiles = fileRejections.find(
        (fileRejection) => fileRejection.errors[0].code === "too-many-files"
      );
      const fileTooLarge = fileRejections.find(
        (fileRejection) => fileRejection.errors[0].code === "file-too-large"
      );
      if (tooManyFiles) {
        toast.error("You can only upload a single file");
      }
      if (fileTooLarge) {
        toast.error("File size is too large");
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxSize: 1024 * 1024 * 10,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
  });
  const uploadFile = async () => {
    startTransition(async () => {
      if (!file) {
        toast.error("Please attach a file.");
        return;
      }
      const { name, type, size } = file;
      const signedURL = await getSignedURL(name, type, size);
      if (signedURL.failure) {
        toast.error(signedURL.failure.message);
        return;
      }
      const url = signedURL.success.url;
      const response = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
          );
          setProgress(percent);
        },
      });
      if (response.status !== 200) {
        toast.error("Failed to upload file");
        return;
      }
      const objectURL = url.split("?")[0];
      setPRoductFile(objectURL);
      const result = await updateProductPhotoURL(product.id, objectURL);
      if (result.failure) {
        toast.error(result.failure.error);
      } else {
        toast.success(result.success.message);
        setOPen(false);
      }
    });
  };
  return (
    <>
      {productFile && !open ? (
        <div className="flex flex-col gap-5">
          <div className="h-50 overflow-hidden">
            <img src={productFile} className="object-center" />
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setOPen(true);
            }}
          >
            Change Product Image
          </Button>
        </div>
      ) : (
        <>
          <Card
            className={cn(
              "relative border-2 border-dashed h-30 transition-colors duration-200 ease-in-out w-full",
              isDragActive
                ? "border-primary bg-primary/10 border-solid"
                : "border-border hover:border-primary"
            )}
            {...getRootProps()}
          >
            <CardContent className="flex items-center justify-center h-full w-full">
              {file ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-2 border">
                      <File size={15} />
                      <p>{file.name}</p>
                      <span onClick={unattachFile}>
                        <X size={20} />
                      </span>
                    </div>
                  </div>
                  {pending && (
                    <div className="flex flex-col items-center gap-2">
                      <Progress
                        value={progress}
                        className="border animate-pulse"
                      />
                      <p className="text-sm">{`${progress}% Uploaded`}</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-center">Drop the file here ...</p>
                  ) : (
                    <div className="flex flex-col items-center gap-y-3">
                      <p className="text-sm">
                        Drag and drop a file here, or click to select file
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          <Button onClick={uploadFile} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Product Image"
            )}
          </Button>
        </>
      )}
    </>
  );
};

export default FileUpload;
