import AddProductForm from "@/components/management/dashboard/inventory/add-product-form";

const InventoryPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center p-5">
        <p className="text-xl">Inventory</p>
        <AddProductForm />
      </div>
    </div>
  );
};

export default InventoryPage;
