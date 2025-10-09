import AddProductSheet from "@/components/management/dashboard/products/add-product-sheet";

const ProductsPage = () => {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <p className="text-xl">Products</p>
        <AddProductSheet />
      </div>
    </div>
  );
};

export default ProductsPage;
