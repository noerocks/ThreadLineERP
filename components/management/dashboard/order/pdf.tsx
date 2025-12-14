import { SaleDTO, SaleItemDTO } from "@/lib/DTO/sale";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #059669",
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 5,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  twoColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  column: {
    width: "48%",
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4a5568",
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    color: "#2d3748",
    marginBottom: 5,
  },
  table: {
    marginTop: 10,
    border: "1pt solid #e2e8f0",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0fdf4",
    borderBottom: "1pt solid #e2e8f0",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #e2e8f0",
    padding: 8,
    alignItems: "flex-start",
  },
  col1: { width: "35%", paddingRight: 5 },
  col2: { width: "10%", textAlign: "center" },
  col3: { width: "10%", textAlign: "center" },
  col4: { width: "10%", textAlign: "center" },
  col5: { width: "15%", textAlign: "right" },
  col6: { width: "20%", textAlign: "right" },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#2d3748",
  },
  tableCell: {
    fontSize: 9,
    color: "#4a5568",
  },
  productName: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 2,
  },
  productDetails: {
    fontSize: 8,
    color: "#718096",
    lineHeight: 1.2,
  },
  skuText: {
    fontSize: 7,
    color: "#a0aec0",
    fontStyle: "italic",
    marginTop: 2,
  },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#4a5568",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2d3748",
  },
  grandTotal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#059669",
    borderTop: "1pt solid #e2e8f0",
    paddingTop: 5,
    marginTop: 5,
  },
  paymentStatus: {
    fontSize: 10,
    fontWeight: "bold",
    padding: "4px 8px",
    borderRadius: 3,
    textAlign: "center",
    marginTop: 5,
    width: "auto",
    minWidth: "60px",
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: "1pt solid #e2e8f0",
    fontSize: 9,
    color: "#718096",
    textAlign: "center",
  },
});

const SaleDocument = ({ sale }: { sale: SaleDTO }) => {
  const lineTotal = sale.items.reduce((sum, item) => sum + item.lineTotal, 0);
  const vatTotal = sale.items.reduce((sum, item) => sum + item.vatAmount, 0);
  const subtotal = lineTotal - vatTotal;
  const grandTotal = lineTotal;
  const itemsTotal = sale.items.reduce((sum, item) => sum + item.quantity, 0);

  const formatCurrency = (amount: number) => {
    return `P${new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM dd, yyyy hh:mm a");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return { backgroundColor: "#dcfce7", color: "#166534" };
      case "pending":
        return { backgroundColor: "#fef3c7", color: "#92400e" };
      case "cancelled":
        return { backgroundColor: "#fee2e2", color: "#991b1b" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#4b5563" };
    }
  };

  const getSizeDisplay = (item: SaleItemDTO) => {
    if (item.productVariant.shoeSize)
      return item.productVariant.shoeSize.toString();
    if (item.productVariant.size) return item.productVariant.size;
    return "N/A";
  };

  const getColorDisplay = (item: SaleItemDTO) => {
    if (item.productVariant.color) {
      const colorStr = item.productVariant.color;
      return colorStr.charAt(0) + colorStr.slice(1).toLowerCase();
    }
    return "N/A";
  };

  const statusStyle = getStatusColor(sale.status);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>ThreadLine.</Text>
          <Text style={styles.documentTitle}>SALES INVOICE</Text>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.label}>INVOICE #</Text>
            <Text style={styles.value}>{sale.id.toUpperCase()}</Text>
            <Text style={styles.label}>INVOICE DATE</Text>
            <Text style={styles.value}>{formatDate(sale.createdAt)}</Text>
            <Text style={styles.label}>STATUS</Text>
            <View
              style={[
                styles.paymentStatus,
                { backgroundColor: statusStyle.backgroundColor },
              ]}
            >
              <Text
                style={{ color: statusStyle.color, textTransform: "uppercase" }}
              >
                {sale.status.toLowerCase()}
              </Text>
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>CUSTOMER</Text>
            <Text style={styles.value}>
              {sale.customer.name || "Walk-in Customer"}
            </Text>
            <Text style={styles.label}>EMAIL</Text>
            <Text style={styles.value}>{sale.customer.email || "N/A"}</Text>
            <Text style={styles.label}>CONTACT NUMBER</Text>
            <Text style={styles.value}>
              {sale.customer.contactNumber || "N/A"}
            </Text>
            {sale.customer.address && (
              <>
                <Text style={styles.label}>ADDRESS</Text>
                <Text style={styles.value}>{sale.customer.address}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>PAYMENT DETAILS</Text>
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <Text style={styles.label}>PAYMENT DATE</Text>
              <Text style={styles.value}>
                {sale.paidAt ? formatDate(sale.paidAt) : "Not paid yet"}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>TOTAL ITEMS</Text>
              <Text style={styles.value}>{itemsTotal} items</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>SALE ITEMS</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>PRODUCT</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>SIZE</Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>COLOR</Text>
              <Text style={[styles.tableHeaderText, styles.col4]}>QTY</Text>
              <Text style={[styles.tableHeaderText, styles.col5]}>
                UNIT PRICE
              </Text>
              <Text style={[styles.tableHeaderText, styles.col6]}>
                LINE TOTAL
              </Text>
            </View>

            {sale.items.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <View style={styles.col1}>
                  <Text style={styles.productName}>
                    {item.productVariant.product?.name || "Product"}
                  </Text>
                  {item.productVariant.product?.description && (
                    <Text style={styles.productDetails}>
                      {item.productVariant.product.description}
                    </Text>
                  )}
                  <Text style={styles.skuText}>
                    SKU: {item.productVariant.sku}
                  </Text>
                </View>
                <Text style={[styles.tableCell, styles.col2]}>
                  {getSizeDisplay(item)}
                </Text>
                <Text style={[styles.tableCell, styles.col3]}>
                  {getColorDisplay(item)}
                </Text>
                <Text style={[styles.tableCell, styles.col4]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.col5]}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={[styles.tableCell, styles.col6]}>
                  {formatCurrency(item.lineTotal)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT (12%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(vatTotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotal}>GRAND TOTAL:</Text>
            <Text style={styles.grandTotal}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>TERMS & CONDITIONS</Text>
          <Text style={[styles.value, { fontSize: 9 }]}>
            1. All sales are final unless defective{"\n"}
            2. Defective items must be returned within 7 days with receipt{"\n"}
            3. Items must be in original condition with tags attached{"\n"}
            4. Store credit or exchange only, no cash refunds{"\n"}
            5. Prices are inclusive of 12% VAT where applicable{"\n"}
            6. Receipt must be presented for any returns or exchanges
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for your purchase! We appreciate your business.</Text>
          <Text>
            ThreadLine. • 123 Retail Street, Makati City, Philippines • Tel:
            (02) 8123-4567
          </Text>
          <Text>
            Business Hours: Mon-Sat 10AM-9PM, Sun 11AM-7PM • Email:
            info@threadline.ph
          </Text>
          <Text>
            Generated on {format(new Date(), "MMMM dd, yyyy 'at' hh:mm a")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default SaleDocument;
