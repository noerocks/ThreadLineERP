import AddSupplierForm from "@/components/management/dashboard/supplier/add-supplier-form";
import { columns } from "@/components/management/dashboard/supplier/columns";
import { DataTable } from "@/components/management/dashboard/supplier/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { getSuppliers } from "@/lib/DAL/supplier";

const SuppliersPage = async () => {
  const suppliers = await getSuppliers();
  return (
    <div className="p-10 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xl">Suppliers</p>
        <AddSupplierForm className="flex flex-col gap-5 px-4" />
      </div>
      <Card className="bg-background">
        <CardContent>
          <DataTable columns={columns} data={suppliers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersPage;
