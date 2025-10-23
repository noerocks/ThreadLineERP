import AddSupplierForm from "@/components/management/dashboard/supplier/add-supplier-form";
import { columns } from "@/components/management/dashboard/supplier/columns";
import { DataTable } from "@/components/management/dashboard/supplier/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { getSuppliers } from "@/lib/DAL/supplier";
import { Truck } from "lucide-react";

const SuppliersPage = async () => {
  const suppliers = await getSuppliers();
  return (
    <div className="py-10 px-40 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xl flex items-center gap-2 font-semibold">
          <Truck />
          Suppliers
        </p>
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
