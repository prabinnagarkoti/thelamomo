import jsPDF from "jspdf";

interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

interface OrderData {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export function generateOrderPdf(order: OrderData, restaurantName?: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const brandName = restaurantName || "BizMenu Builder";

  // ── Header with brand gradient bar ──
  doc.setFillColor(245, 158, 11); // Amber-400
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setFillColor(225, 29, 72); // Rose-600
  doc.rect(pageWidth * 0.6, 0, pageWidth * 0.4, 40, "F");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(brandName, margin, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Order Receipt", margin, 28);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`#${order._id.slice(-8).toUpperCase()}`, pageWidth - margin, 18, { align: "right" });
  doc.text(new Date(order.createdAt).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }), pageWidth - margin, 28, { align: "right" });

  y = 52;

  // ── Status Badge ──
  doc.setFontSize(9);
  const statusColors: Record<string, [number, number, number]> = {
    "In Process": [245, 158, 11],
    "Delivered": [34, 197, 94],
    "Cancelled": [239, 68, 68]
  };
  const statusColor = statusColors[order.status] || [148, 163, 184];
  doc.setFillColor(...statusColor);
  const statusText = `  ${order.status.toUpperCase()}  `;
  const statusWidth = doc.getTextWidth(statusText) + 8;
  doc.roundedRect(margin, y - 5, statusWidth, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(statusText, margin + 4, y + 1);

  y += 14;

  // ── Customer Details ──
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("CUSTOMER DETAILS", margin, y);
  y += 7;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y - 2, pageWidth - margin, y - 2);

  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const details = [
    { label: "Name:", value: order.customerName },
    { label: "Email:", value: order.customerEmail },
    { label: "Phone:", value: order.customerPhone }
  ];

  if (order.customerAddress) {
    details.push({ label: "Address:", value: order.customerAddress });
  }

  details.forEach((d) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9);
    doc.text(d.label, margin, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    // Handle long text wrapping for address
    const lines = doc.splitTextToSize(d.value, contentWidth - 35);
    doc.text(lines, margin + 35, y + 4);
    y += 6 * lines.length + 2;
  });

  y += 6;

  // ── Items Table ──
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("ORDER ITEMS", margin, y);
  y += 5;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  // Table header
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, y - 3, contentWidth, 8, "F");
  doc.setTextColor(71, 85, 105); // slate-600
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Item", margin + 3, y + 2);
  doc.text("Qty", margin + contentWidth * 0.55, y + 2);
  doc.text("Price", margin + contentWidth * 0.7, y + 2);
  doc.text("Subtotal", pageWidth - margin - 3, y + 2, { align: "right" });
  y += 10;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  order.items.forEach((item, index) => {
    const subtotal = (item.price * item.qty).toFixed(2);

    // Alternate row backgrounds
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 4, contentWidth, 8, "F");
    }

    doc.setTextColor(30, 41, 59);
    doc.text(item.name, margin + 3, y);
    doc.text(String(item.qty), margin + contentWidth * 0.55, y);
    doc.text(`$${item.price.toFixed(2)}`, margin + contentWidth * 0.7, y);
    doc.text(`$${subtotal}`, pageWidth - margin - 3, y, { align: "right" });
    y += 8;
  });

  // Total row
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;

  doc.setFillColor(245, 158, 11);
  doc.rect(margin + contentWidth * 0.55, y - 5, contentWidth * 0.45, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", margin + contentWidth * 0.58, y + 2);
  doc.text(`$${order.total.toFixed(2)}`, pageWidth - margin - 5, y + 2, { align: "right" });

  y += 18;

  // ── Payment & Notes ──
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Payment:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text("Cash on Delivery (COD)", margin + 35, y);
  y += 8;

  if (order.notes) {
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Notes:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    const noteLines = doc.splitTextToSize(order.notes, contentWidth - 35);
    doc.text(noteLines, margin + 35, y);
    y += 6 * noteLines.length;
  }

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated by ${brandName} • Powered by BizMenu Builder`, margin, footerY);
  doc.text(`Order ID: ${order._id}`, pageWidth - margin, footerY, { align: "right" });

  // Download
  doc.save(`order-${order._id.slice(-6)}.pdf`);
}
