import jsPDF from "jspdf";
import logo from "../../../assets/images/wandoor-logo-2.png";

export default function generateSplitBillPDF(bill, members, themeColor = "#6dddd0") {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const top = 12;
  const headerLogoW = 46;
  const headerLogoH = 16;
  const headerRightX = pageWidth - margin;
  const theme = hexToRgb(themeColor);
  const lightTheme = lightenRgb(theme, 0.86);

  doc.addImage(logo, "PNG", margin, top, headerLogoW, headerLogoH);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Split Bill", headerRightX, top + 6, { align: "right" });

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.35);
  doc.line(margin, top + headerLogoH + 6, pageWidth - margin, top + headerLogoH + 6);

  doc.setFontSize(12);
  doc.text("Occasion:", margin, top + headerLogoH + 16);
  doc.setTextColor(themeColor);
  doc.setFont("Helvetica", "bold");
  doc.text(bill.split_bill_title || "-", margin + 26, top + headerLogoH + 16);
  doc.setFont("Helvetica", "normal");
  doc.setTextColor("#000000");
  doc.setFontSize(9);
  doc.text("Date & Time :", margin, top + headerLogoH + 24);
  doc.text(
    new Date(bill.created_time).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    margin + 26,
    top + headerLogoH + 24
  );

  doc.setFont("Helvetica", "bold");
  doc.text("Payment Account", headerRightX, top + headerLogoH + 16, { align: "right" });
  doc.setTextColor(themeColor);
  doc.setFont("Helvetica", "bold");
  doc.text("BNI 1234567890", headerRightX, top + headerLogoH + 24, { align: "right" });
  doc.setTextColor("#000000");
  doc.setFont("Helvetica", "normal");
  doc.text("a.n. Wandoor User", headerRightX, top + headerLogoH + 30, { align: "right" });

  const tableHeaderY = top + headerLogoH + 42;
  const headerHeight = 12;
  doc.setFillColor(lightTheme[0], lightTheme[1], lightTheme[2]);
  doc.roundedRect(margin, tableHeaderY, contentWidth, headerHeight, 6, 6, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#ffffff");
  const colNoX = margin + 8;
  const colMemberX = margin + 26;
  const colAmountRight = margin + contentWidth - 8;
  doc.text("No", colNoX, tableHeaderY + 8);
  doc.text("Bill Member", colMemberX, tableHeaderY + 8);
  doc.text("Amount", colAmountRight, tableHeaderY + 8, { align: "right" });

  const rowStartY = tableHeaderY + headerHeight + 6;
  const rowHeight = 16;
  let cursorY = rowStartY;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    const isAlt = i % 2 === 0;
    if (isAlt) {
      doc.setFillColor(249, 249, 249);
      doc.rect(margin, cursorY - 2, contentWidth, rowHeight, "F");
    }
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(margin, cursorY + rowHeight - 2, margin + contentWidth, cursorY + rowHeight - 2);

    const noX = margin + 14;
    const noY = cursorY + rowHeight / 2 + 2;
    doc.setTextColor("#6b7280");
    doc.text(String(i + 1), noX, noY, { align: "center" });

    doc.setTextColor("#111827");
    const memberX = margin + 32;
    doc.text(String(m.member_name || "-"), memberX, noY);

    const amountText = `Rp${Number(m.amount || 0).toLocaleString("id-ID")}`;
    doc.text(amountText, colAmountRight, noY, { align: "right" });

    cursorY += rowHeight + 2;
    if (cursorY + rowHeight + 40 > doc.internal.pageSize.getHeight()) {
      doc.addPage();
      cursorY = margin + 10;
    }
  }

  const finalY = cursorY + 8;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.35);
  doc.line(margin, finalY, margin + contentWidth, finalY);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#000000");
  doc.text("Bill Total", margin, finalY + 12);

  doc.setTextColor(themeColor);
  doc.text(
    `Rp${Number(bill.total_bill || 0).toLocaleString("id-ID")}`,
    margin + contentWidth,
    finalY + 12,
    { align: "right" }
  );

  return doc;
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const num = parseInt(hex, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function lightenRgb(rgbArr, factor) {
  return rgbArr.map((c) => Math.round(c + (255 - c) * (1 - factor)));
}