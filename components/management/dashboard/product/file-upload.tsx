import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { File, X } from "lucide-react";
import React, { useCallback, useState, useTransition } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>();
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
  const [pending, startTransition] = useTransition();
  return (
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
              <div className="flex items-center gap-2 p-2 border">
                <File size={15} />
                <p>{file.name}</p>
                <span onClick={unattachFile}>
                  <X size={20} />
                </span>
              </div>
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
      <Button>Upload Product Image</Button>
    </>
  );
};

export default FileUpload;
