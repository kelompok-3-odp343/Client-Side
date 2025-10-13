import React, { useState } from "react";
import { Filter, Bell, User } from "lucide-react";

export default function DetailFitur () {
  const [activeMonth, setActiveMonth] = useState("May");

  const months = ["May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

  const transactions = [
    {
      date: "31 May 2025",
      items: [
        { title: "Jangka Panjang", subtitle: "Biaya Administrasi", amount: "-Rp1.000" },
        { title: "Jangka Pendek", subtitle: "Biaya pengelolaan", amount: "-Rp7" },
      ],
    },
    {
      date: "30 May 2025",
      items: [{ title: "Jangka Pendek", subtitle: "Iuran", amount: "-Rp3.500" }],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-8 py-4">
        <h1 className="text-2xl font-bold">Wandoor</h1>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 cursor-pointer" />
          <User className="w-5 h-5 cursor-pointer" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col md:flex-row px-8 py-6 gap-8">
        {/* Left: Deposito Info */}
        <section className="md:w-1/2 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold">Deposito Information</h2>
            <p className="text-sm text-gray-500">
              Track your transaction history and payment information
            </p>
          </div>

          <div className="flex items-center rounded-xl border shadow-sm overflow-hidden">
            <div className="bg-yellow-100 flex items-center justify-center w-1/3 h-40">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="money bag"
                className="w-20 h-20"
              />
            </div>
            <div className="p-4 w-2/3">
              <h3 className="font-semibold text-lg">Time Deposit</h3>
              <p className="text-sm text-gray-500 mt-1">Total Balance</p>
              <p className="text-3xl font-bold mt-1">Rp5.000.000</p>
              <p className="text-sm text-gray-600 mt-2">You have 2 Time Deposits</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3">Your Time Deposit</h3>
            <div className="flex gap-4">
              <div className="bg-white border shadow-sm rounded-xl p-4 w-40 text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2">
                  <span className="text-xs text-purple-700 font-semibold">28 Nov 2025</span>
                </div>
                <p className="font-medium text-sm">Jangka Pendek</p>
                <p className="text-gray-500 text-xs mt-1">Balance:</p>
                <p className="font-semibold">Rp2.000.000</p>
              </div>

              <div className="bg-white border shadow-sm rounded-xl p-4 w-40 text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-2">
                  <span className="text-xs text-purple-700 font-semibold">28 Nov 2025</span>
                </div>
                <p className="font-medium text-sm">Jangka Panjang</p>
                <p className="text-gray-500 text-xs mt-1">Balance:</p>
                <p className="font-semibold">Rp3.000.000</p>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-6">
              Interest &nbsp;|&nbsp; Opening date &nbsp;|&nbsp; Periode
            </div>
          </div>
        </section>

        {/* Right: Transaction History */}
        <section className="md:w-1/2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Transaction History</h2>
            <Filter className="w-5 h-5 cursor-pointer" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {months.map((month) => (
              <button
                key={month}
                onClick={() => setActiveMonth(month)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeMonth === month
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {month}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            {transactions.map((tx, i) => (
              <div key={i}>
                <p className="text-sm font-semibold mb-2">{tx.date}</p>
                <div className="flex flex-col gap-3">
                  {tx.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="border rounded-full w-6 h-6 flex items-center justify-center">
                          <span className="text-xs">★</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-gray-400">{item.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-800">{item.amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
