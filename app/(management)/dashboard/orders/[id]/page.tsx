import SaleDocument from "@/components/management/dashboard/order/pdf";
import PurchaseOrderDocument from "@/components/management/dashboard/purchase-order/pdf";
import PDFViewer from "@/components/pdf-viewer";
import { getSaleById } from "@/lib/DAL/sale";

const OrderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const sale = await getSaleById(id);
  return <PDFViewer pdfComponent={<SaleDocument sale={sale!} />} />;
};

export default OrderPage;
