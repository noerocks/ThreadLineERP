import AddToCart from "@/components/shop/add-to-cart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProductById } from "@/lib/DAL/product";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await getProductById(id);
  return product && <AddToCart product={product!} />;
};

export default ProductPage;
