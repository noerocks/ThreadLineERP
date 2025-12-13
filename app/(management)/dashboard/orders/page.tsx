import { columns } from "@/components/management/dashboard/order/columns";
import { DataTable } from "@/components/management/dashboard/order/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { getAllSales } from "@/lib/DAL/sale";
import { ShoppingBag } from "lucide-react";

const OrdersPage = async () => {
  const orders = await getAllSales();
  console.log(orders);
  return (
    <div className="py-10 px-40 flex flex-col gap-5">
      <p className="text-xl flex items-center gap-2 font-semibold">
        <ShoppingBag />
        Online Orders
      </p>
      <Card className="bg-background">
        <CardContent>
          <DataTable columns={columns} data={orders} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
