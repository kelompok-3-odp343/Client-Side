import jsPDF from "jspdf";
import logo from "../../../assets/images/wandoor-logo-3.jpg";

export default function generateSplitBillPDF(bill, members, themeColor = "#6dddd0") {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const top = 8;
  const headerLogoW = 46;
  const headerLogoH = 12;
  const headerRightX = pageWidth - margin;
  const theme = hexToRgb(themeColor);
  const lightTheme = lightenRgb(theme, 0.86);

  // Logo
  doc.addImage(logo, "PNG", margin - 2, top, headerLogoW, headerLogoH);

  // Line
  doc.setDrawColor(themeColor);
  doc.setLineWidth(0.8);
  doc.line(headerRightX - 30, top + 2, pageWidth - margin + 2, top + 2);

  // Split Bill Text
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Split Bill", headerRightX, top + 8, { align: "right" });

  // Occasion
  doc.setFontSize(12);
  doc.text("Occasion", margin, top + headerLogoH + 12);
  doc.text(":", margin + 22, top + headerLogoH + 12);
  doc.setTextColor(themeColor);
  doc.setFont("Helvetica", "bold");
  doc.text(bill.split_bill_title || "-", margin + 25, top + headerLogoH + 12);

  // Date & Time
  doc.setFont("Helvetica", "bold");
  doc.setTextColor("#000000");
  doc.setFontSize(10);
  doc.text("Date & Time", margin, top + headerLogoH + 18);
  doc.text(":", margin + 22, top + headerLogoH + 18);
  doc.setFont("Helvetica", "normal");
  const d = new Date(bill.created_time);
  const formattedDate =
    d.getDate() + " " + 
    d.toLocaleString("en-US", { month: "long" }) + " " +
    d.getFullYear() + ", " +
    d.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  doc.text(
    formattedDate,
    margin + 25,
    top + headerLogoH + 18
  );

  // Payment Account
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Payment Account", headerRightX, top + headerLogoH + 12, { align: "right" });
  doc.setTextColor(themeColor);
  doc.setFont("Helvetica", "bold");
  doc.text("BNI 1234567890", headerRightX, top + headerLogoH + 18, { align: "right" });
  doc.setTextColor("#000000");
  doc.setFont("Helvetica", "normal");
  doc.text("a.n. Wandoor User", headerRightX, top + headerLogoH + 24, { align: "right" });

  // Table
  const tableHeaderY = top + headerLogoH + 30;
  const headerHeight = 9;
  doc.setFillColor(themeColor);
  doc.roundedRect(margin, tableHeaderY, contentWidth, headerHeight, 2, 2, "F");
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#000");
  const colNoX = margin + 7;
  const colMemberX = margin + 20;
  const colAmountRight = margin + contentWidth - 16;
  doc.text("No", colNoX, tableHeaderY + 6, { align: "center"});
  doc.text("Bill Member", colMemberX, tableHeaderY + 6);
  doc.text("Amount", colAmountRight, tableHeaderY + 6, { align: "center" });

  const rowStartY = tableHeaderY + headerHeight + 2;
  const rowHeight = 9;
  let cursorY = rowStartY;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    // const isAlt = i % 2 === 0;
    // if (isAlt) {
    //   doc.setFillColor(249, 249, 249);
    //   doc.rect(margin, cursorY - 2, contentWidth, rowHeight, "F");
    // }
    doc.setDrawColor("#D9D9D9");
    doc.setLineWidth(0.3);
    doc.line(margin, cursorY + rowHeight, margin + contentWidth, cursorY + rowHeight);

    const noX = margin + 7;
    const noY = cursorY + rowHeight / 2;
    doc.setTextColor("#000");
    doc.text(String(i + 1), noX, noY, { align: "center" });

    doc.setTextColor("#000");
    const memberX = margin + 20;
    doc.text(String(m.member_name || "-"), memberX, noY);

    const amountText = `Rp${Number(m.amount || 0).toLocaleString("id-ID")}`;
    doc.text(amountText, colAmountRight, noY, { align: "center" });

    cursorY += rowHeight + 2;
    if (cursorY + rowHeight + 40 > doc.internal.pageSize.getHeight()) {
      doc.addPage();
      cursorY = margin + 10;
    }
  }

  const finalY = cursorY;
  // doc.setDrawColor(220, 220, 220);
  // doc.setLineWidth(0.35);
  // doc.line(margin, finalY, margin + contentWidth, finalY);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor("#000000");
  doc.text("Bill Total", colMemberX, finalY + rowHeight / 2);

  doc.setTextColor(themeColor);
  doc.text(
    `Rp${Number(bill.total_bill || 0).toLocaleString("id-ID")}`,
    colAmountRight,
    finalY + rowHeight / 2,
    { align: "center" }
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