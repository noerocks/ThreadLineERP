import AddSupplierForm from "@/components/management/dashboard/supplier/add-supplier-form";

const SuppliersPage = () => {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <p className="text-xl">Suppliers</p>
        <AddSupplierForm className="flex flex-col gap-5 px-4" />
      </div>
    </div>
  );
};

export default SuppliersPage;
