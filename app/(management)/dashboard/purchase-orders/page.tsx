import ProductsCards from "@/components/management/dashboard/product/products-cards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProducts } from "@/lib/DAL/product";
import { getSuppliers } from "@/lib/DAL/supplier";
import { FileText } from "lucide-react";

const PurchaseOrderPage = async () => {
  const products = await getProducts();
  const suppliers = await getSuppliers();
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
        <TabsContent value="create">
          <ProductsCards products={products} suppliers={suppliers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseOrderPage;
