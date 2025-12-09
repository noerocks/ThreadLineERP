import ProductsCards from "@/components/shop/products-cards";
import { getProductsByCategory } from "@/lib/DAL/product";
import { getSuppliers } from "@/lib/DAL/supplier";
import { Category } from "@prisma/client";

const CategoryProducts = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}) => {
  const { name } = await params;
  const products = await getProductsByCategory(name as Category);
  const suppliers = await getSuppliers();
  return <ProductsCards products={products} suppliers={suppliers} />;
};

export default CategoryProducts;
