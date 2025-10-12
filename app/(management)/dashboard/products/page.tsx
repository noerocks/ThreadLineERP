import AddProductForm from "@/components/management/dashboard/product/add-product-form";
import { columns } from "@/components/management/dashboard/product/columns";
import { DataTable } from "@/components/management/dashboard/product/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts } from "@/lib/DAL/product";

const ProductsPage = async () => {
  const products = await getProducts();
  return (
    <div className="p-10 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xl">Products</p>
        <AddProductForm className="flex flex-col gap-5 px-4" />
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
