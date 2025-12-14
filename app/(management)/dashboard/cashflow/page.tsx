import { columns } from "@/components/management/dashboard/cashflow/columns";
import { DataTable } from "@/components/management/dashboard/cashflow/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllCashFlow } from "@/lib/DAL/cashflow";
import { DollarSign } from "lucide-react";

const CashflowPage = async () => {
  const cashflow = await getAllCashFlow();
  return (
    <div className="py-10 px-40 flex flex-col gap-5">
      <p className="text-xl flex items-center gap-2 font-semibold">
        <DollarSign />
        Cashflow
      </p>
      <Tabs defaultValue="inflow">
        <TabsList className="bg-background border">
          <TabsTrigger value="inflow">Inflow</TabsTrigger>
          <TabsTrigger value="outflow">Outflow</TabsTrigger>
        </TabsList>
        <TabsContent value="inflow">
          <Card className="bg-background">
            <CardContent>
              <DataTable
                columns={columns}
                data={cashflow.filter((cf) => cf.type === "INFLOW")}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="outflow">
          <Card className="bg-background">
            <CardContent>
              <DataTable
                columns={columns}
                data={cashflow.filter((cf) => cf.type === "OUTFLOW")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CashflowPage;
