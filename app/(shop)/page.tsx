import ProductsCards from "@/components/shop/products-cards";
import { getProducts } from "@/lib/DAL/product";
import { getSuppliers } from "@/lib/DAL/supplier";

const Index = async () => {
  const products = await getProducts();
  const suppliers = await getSuppliers();
  return <ProductsCards products={products} suppliers={suppliers} />;
};

export default Index;
