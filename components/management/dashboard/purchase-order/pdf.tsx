import { PurchaseOrderDTO } from "@/lib/DTO/purchase-orders";
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
    borderBottom: "2pt solid #1a365d",
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a365d",
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
    backgroundColor: "#f7fafc",
    borderBottom: "1pt solid #e2e8f0",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #e2e8f0",
    padding: 8,
  },
  col1: { width: "30%" },
  col2: { width: "15%" },
  col3: { width: "15%" },
  col4: { width: "20%" },
  col5: { width: "20%" },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2d3748",
  },
  tableCell: {
    fontSize: 9,
    color: "#4a5568",
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
    color: "#1a365d",
    borderTop: "1pt solid #e2e8f0",
    paddingTop: 5,
    marginTop: 5,
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

const PurchaseOrderDocument = ({
  purchaseOrder,
}: {
  purchaseOrder: PurchaseOrderDTO;
}) => {
  const subtotal = purchaseOrder.items.reduce(
    (sum, item) => sum + Number(item.lineTotal),
    0
  );
  const totalVAT = purchaseOrder.items.reduce(
    (sum, item) => sum + Number(item.vatAmount),
    0
  );
  const grandTotal = subtotal + totalVAT;

  const formatCurrency = (amount: number) => {
    const formatted = new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
    return `P${formatted.replace(/[^\d.,]/g, "")}`;
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM dd, yyyy");
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>ThreadLine.</Text>
          <Text style={styles.documentTitle}>PURCHASE ORDER</Text>
        </View>
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <Text style={styles.label}>PURCHASE ORDER #</Text>
            <Text style={styles.value}>{purchaseOrder.id.toUpperCase()}</Text>

            <Text style={styles.label}>ORDER DATE</Text>
            <Text style={styles.value}>
              {formatDate(purchaseOrder.createdAt)}
            </Text>

            <Text style={styles.label}>STATUS</Text>
            <Text style={[styles.value, { textTransform: "capitalize" }]}>
              {purchaseOrder.status.toLowerCase()}
            </Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.label}>SUPPLIER</Text>
            <Text style={styles.value}>{purchaseOrder.supplier.name}</Text>

            <Text style={styles.label}>CONTACT PERSON</Text>
            <Text style={styles.value}>
              {purchaseOrder.supplier.contactName || "N/A"}
            </Text>

            <Text style={styles.label}>PHONE</Text>
            <Text style={styles.value}>
              {purchaseOrder.supplier.phone || "N/A"}
            </Text>

            <Text style={styles.label}>EMAIL</Text>
            <Text style={styles.value}>
              {purchaseOrder.supplier.email || "N/A"}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>DELIVERY ADDRESS</Text>
          <Text style={styles.value}>{purchaseOrder.address}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>ORDER ITEMS</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.col1]}>
                PRODUCT DESCRIPTION
              </Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>SIZE</Text>
              <Text style={[styles.tableHeaderText, styles.col3]}>COLOR</Text>
              <Text style={[styles.tableHeaderText, styles.col2]}>QTY</Text>
              <Text style={[styles.tableHeaderText, styles.col4]}>
                UNIT PRICE
              </Text>
              <Text style={[styles.tableHeaderText, styles.col5]}>
                LINE TOTAL
              </Text>
            </View>

            {purchaseOrder.items.map((item, index) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>
                  {item.product.name}
                  {item.product.description && `\n${item.product.description}`}
                </Text>
                <Text style={[styles.tableCell, styles.col2]}>
                  {item.product.size || "N/A"}
                </Text>
                <Text style={[styles.tableCell, styles.col3]}>
                  {item.product.color || "N/A"}
                </Text>
                <Text style={[styles.tableCell, styles.col2]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.col4]}>
                  {formatCurrency(Number(item.unitPrice))}
                </Text>
                <Text style={[styles.tableCell, styles.col5]}>
                  {formatCurrency(Number(item.lineTotal))}
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
            <Text style={styles.totalValue}>{formatCurrency(totalVAT)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotal}>GRAND TOTAL:</Text>
            <Text style={styles.grandTotal}>{formatCurrency(grandTotal)}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>TERMS & CONDITIONS</Text>
          <Text style={[styles.value, { fontSize: 9 }]}>
            1. Goods must be delivered within 15 days from order date{"\n"}
            2. All items must be in perfect condition and properly packaged
            {"\n"}
            3. Invoice must reference this Purchase Order number{"\n"}
            4. Defective items will be returned at supplier's expense{"\n"}
            5. Payment terms: Net 30 days from delivery date
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            This is a computer-generated document. No signature is required.
          </Text>
          <Text>
            FASHION RETAIL CO. • 123 Retail Street, Makati City, Philippines •
            Tel: (02) 8123-4567
          </Text>
          <Text>
            Generated on {format(new Date(), "MMMM dd, yyyy 'at' hh:mm a")}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PurchaseOrderDocument;
