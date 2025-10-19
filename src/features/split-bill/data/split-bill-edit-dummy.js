// pages/SplitBillList.jsx
import React, { useState } from "react";
import SPLIT_BILL_DUMMY_DATA from "../data/splitbill_dummy";
import SplitBillFormEdit from "../shared/components/SplitBillFormEdit";

export default function SplitBillList() {
    const [items, setItems] = useState(SPLIT_BILL_DUMMY_DATA);
    const [editItem, setEditItem] = useState(null);

    const openEdit = (sb) => setEditItem(sb);
    const closeEdit = () => setEditItem(null);

    const handleSaveEdit = (id, updatedMembers) => {
        setItems((prev) =>
            prev.map((sb) =>
                sb.split_bill_id === id
                    ? {
                        ...sb,
                        members: updatedMembers,
                        remaining_bill: updatedMembers
                            .filter((m) => m.status === "Unpaid")
                            .reduce((s, m) => s + (m.amount || 0), 0),
                    }
                    : sb
            )
        );
        closeEdit();
    };

    return (
        <div className="splitbill-page">
            <h1>Split Bill</h1>

            <div className="cards-grid">
                {items.map((sb) => (
                    <div key={sb.split_bill_id} className="card">
                        <div className="card-header">
                            <h3>{sb.split_bill_title}</h3>
                            <p>Total Bill: Rp {sb.total_bill.toLocaleString("id-ID")}</p>
                        </div>

                        <div className="card-actions">
                            <button className="btn-secondary" onClick={() => {/* navigate */ }}>
                                View Detail
                            </button>
                            <button className="btn-primary" onClick={() => openEdit(sb)}>
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editItem && (
                <SplitBillFormEdit
                    data={editItem}
                    onClose={closeEdit}
                    onSave={(updatedMembers) =>
                        handleSaveEdit(editItem.split_bill_id, updatedMembers)
                    }
                />
            )}
        </div>
    );
}
