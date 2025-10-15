export async function fetchNotifications() {
  return [
    {
      id: 1,
      title: "October Special Promo!",
      message: "Enjoy up to 20% cashback for transactions at selected merchants.",
      type: "promo",
    },
    {
      id: 2,
      title: "Weekend Deals",
      message: "Use your debit card at the mall and enjoy discounts up to IDR 300,000.",
      type: "info",
    },
    {
      id: 3,
      title: "Free Interbank Transfers",
      message: "Enjoy free interbank transfer fees until 20 May 2027.",
      type: "alert",
    },
  ];
}