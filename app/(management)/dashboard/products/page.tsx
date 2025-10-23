import AddProductForm from "@/components/management/dashboard/product/add-product-form";
import { columns } from "@/components/management/dashboard/product/columns";
import { DataTable } from "@/components/management/dashboard/product/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts } from "@/lib/DAL/product";
import { Package } from "lucide-react";

const ProductsPage = async () => {
  const products = await getProducts();
  return (
    <div className="py-10 px-40 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xl flex items-center gap-2 font-semibold">
          <Package />
          Products
        </p>
        <div className="flex items-center gap-2">
          <AddProductForm className="flex flex-col gap-5 px-4" />
        </div>
      </div>
      <Card className="bg-background">
        <CardContent>
          <DataTable columns={columns} data={products} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
