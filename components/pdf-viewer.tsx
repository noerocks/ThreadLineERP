"use client";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useTheme } from "next-themes";
import { JSX, useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";

const PDFViewer = ({ pdfComponent }: { pdfComponent: JSX.Element }) => {
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [pdfTheme, setPdfTheme] = useState<string>();
  const { theme } = useTheme();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const onDocumentLoad = () => {
    setPdfTheme(theme);
  };

  useEffect(() => {
    setPdfTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (pdfComponent) {
      const generatePdf = async () => {
        const blob = await pdf(pdfComponent)?.toBlob();
        setPdfUrl(URL.createObjectURL(blob));
      };
      generatePdf();
    }
  }, [pdfComponent]);

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="h-full p-3">
        {pdfUrl && (
          <Viewer
            fileUrl={pdfUrl}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1.3}
            onDocumentLoad={onDocumentLoad}
            theme={pdfTheme}
          />
        )}
      </div>
    </Worker>
  );
};

export default PDFViewer;
