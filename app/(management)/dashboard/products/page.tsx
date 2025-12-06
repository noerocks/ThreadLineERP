import AddProductForm from "@/components/management/dashboard/product/add-product-form";
import { columns } from "@/components/management/dashboard/product/columns";
import { DataTable } from "@/components/management/dashboard/product/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { verifySession } from "@/lib/actions/session";
import { getProducts, getProductsBySupplierId } from "@/lib/DAL/product";
import { Package } from "lucide-react";

const ProductsPage = async () => {
  const { user } = await verifySession();
  const products =
    user.role === "ADMIN"
      ? await getProducts()
      : await getProductsBySupplierId(user.id);
  return (
    <div className="py-10 px-40 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xl flex items-center gap-2 font-semibold">
          <Package />
          Products
        </p>
        <div className="flex items-center gap-2">
          {user.role === "SUPPLIER" && <AddProductForm supplierId={user.id} />}
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
