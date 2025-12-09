import { auth } from "@/auth";
import CartItems from "@/components/shop/cart-items";
import { getProducts } from "@/lib/DAL/product";

const CartPage = async () => {
  const session = await auth();
  const variants = (await getProducts()).flatMap((product) => product.variants);
  return <CartItems variants={variants} user={session?.user} />;
};

export default CartPage;
