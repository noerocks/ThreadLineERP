import AddProductForm from "@/components/management/dashboard/product/add-product-form";

const ProductsPage = () => {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <p className="text-xl">Products</p>
        <AddProductForm className="flex flex-col gap-5 px-4" />
      </div>
    </div>
  );
};

export default ProductsPage;
