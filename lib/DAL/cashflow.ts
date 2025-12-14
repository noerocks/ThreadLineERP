import { CashFlowSource, CashFlowType } from "@prisma/client";
import { prisma } from "../prisma";
import { unstable_cache } from "next/cache";

export async function createInflow(data: {
  saleId: string;
  amount: number;
  vatAmount: number;
}) {
  const inflow = prisma.cashFlow.create({
    data: {
      type: CashFlowType.INFLOW,
      source: CashFlowSource.SALE,
      sale: {
        connect: {
          id: data.saleId,
        },
      },
      amount: data.amount,
      vatAmount: data.vatAmount,
    },
  });
  return inflow;
}

export async function createOutFlow(data: {
  poId: string;
  amount: number;
  vatAmount: number;
}) {
  const outflow = prisma.cashFlow.create({
    data: {
      type: CashFlowType.OUTFLOW,
      source: CashFlowSource.PURCHASE,
      po: {
        connect: {
          id: data.poId,
        },
      },
      amount: data.amount,
      vatAmount: data.vatAmount,
    },
  });
  return outflow;
}

export const getAllCashFlow = unstable_cache(
  async () => {
    const cashflow = prisma.cashFlow.findMany();
    return cashflow;
  },
  ["getAllCashFlow"],
  {
    tags: ["cashflow"],
  }
);
