import ProductsCards from "@/components/management/dashboard/product/products-cards";
import { columns } from "@/components/management/dashboard/purchase-order/columns";
import { DataTable } from "@/components/management/dashboard/purchase-order/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProducts } from "@/lib/DAL/product";
import { getAllPurchaseOrders } from "@/lib/DAL/purchase-order";
import { getSuppliers } from "@/lib/DAL/supplier";
import { PurchaseOrderDTO } from "@/lib/DTO/purchase-orders";
import { FileText } from "lucide-react";

const PurchaseOrderPage = async () => {
  const products = await getProducts();
  const suppliers = await getSuppliers();
  const purchaseOrders = await getAllPurchaseOrders();
  return (
    <div className="py-10 px-40 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xl flex items-center gap-2 font-semibold">
          <FileText />
          Purchase Order
        </p>
      </div>
      <Tabs defaultValue="create">
        <TabsList className="bg-background border">
          <TabsTrigger value="po">Purchase Orders</TabsTrigger>
          <TabsTrigger value="create">Create Purchase Order</TabsTrigger>
        </TabsList>
        <TabsContent value="po">
          <DataTable columns={columns} data={purchaseOrders} />
        </TabsContent>
        <TabsContent value="create">
          <ProductsCards products={products} suppliers={suppliers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseOrderPage;
