import PurchaseOrderDocument from "@/components/management/dashboard/purchase-order/pdf";
import PDFViewer from "@/components/pdf-viewer";
import { getPurchaseOrderById } from "@/lib/DAL/purchase-order";

const PurchaseOrderPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const purchaseOrder = await getPurchaseOrderById(id);
  return (
    <PDFViewer
      pdfComponent={<PurchaseOrderDocument purchaseOrder={purchaseOrder!} />}
    />
  );
};

export default PurchaseOrderPage;
