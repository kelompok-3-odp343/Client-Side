// shared/components/SplitBillFormEdit.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../styles/components/split-bill-form.css";
import { Plus, Minus } from "lucide-react";

export default function SplitBillFormEdit({ data, onClose, onSave }) {
    const totalBill = data?.total_bill ?? 0;

    const [participants, setParticipants] = useState(() =>
        (data?.members || []).map((m, idx) => ({
            id: `${Date.now()}-${idx}`,
            participantName: m.member_name,
            participantAmount: String(m.amount),
            _status: m.status || "Unpaid",
        }))
    );

    const inputRefs = useRef({});
    const lastAddedId = useRef(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    useEffect(() => {
        const last = participants[participants.length - 1];
        if (lastAddedId.current && last && lastAddedId.current === last.id) {
            const el = inputRefs.current[last.id];
            if (el && typeof el.focus === "function") el.focus();
            lastAddedId.current = null;
        }
    }, [participants]);

    const totalParticipantAmount = useMemo(
        () =>
            participants.reduce(
                (sum, p) => sum + parseInt(p.participantAmount || "0", 10),
                0
            ),
        [participants]
    );
    const remainingAmount = totalBill - totalParticipantAmount;

    function handleAddRow() {
        const newId = `${Date.now()}-${Math.random()}`;
        lastAddedId.current = newId;
        setParticipants((prev) => [
            ...prev,
            { id: newId, participantName: "", participantAmount: "", _status: "Unpaid" },
        ]);
    }

    function handleDeleteRow(id) {
        setParticipants((prev) => (prev.length === 1 ? prev : prev.filter((p) => p.id !== id)));
    }

    function handleChangeName(id, value) {
        setErrorMessage("");
        setParticipants((prev) =>
            prev.map((p) => (p.id === id ? { ...p, participantName: value } : p))
        );
    }

    function handleChangeAmount(id, value) {
        const sanitized = value.replace(/[^\d]/g, "");
        setParticipants((prev) => {
            const upd = prev.map((p) =>
                p.id === id ? { ...p, participantAmount: sanitized } : p
            );
            const newTotal = upd.reduce(
                (s, p) => s + parseInt(p.participantAmount || "0", 10),
                0
            );
            if (newTotal > totalBill) {
                setErrorMessage(`Unsplit amount exceeds the total bill (${formatRp(String(totalBill))}).`);
                return prev;
            }
            setErrorMessage("");
            return upd;
        });
    }

    const hasEmptyFields = participants.some(
        (p) => !p.participantName.trim() || !p.participantAmount.trim()
    );

    function formatRp(val) {
        if (!val) return "Rp 0";
        return "Rp " + val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function formatAmount(val) {
        if (!val) return "";
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage("");
        if (hasEmptyFields) {
            setErrorMessage("Please fill in name and amount fields before saving.");
            return;
        }
        if (totalParticipantAmount !== totalBill) {
            setErrorMessage("Split amount doesn't match the total bill.");
            return;
        }

        setIsSaving(true);
        try {
            const updatedMembers = participants.map((p, idx) => ({
                member_name: p.participantName.trim(),
                amount: Number(p.participantAmount),
                status: data?.members?.[idx]?.status ?? p._status ?? "Unpaid",
            }));
            onSave(updatedMembers);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="splitbill-modal" role="dialog" aria-modal="true">
            <div className="splitbill-container">
                <h2 className="title">Edit Split Bill</h2>
                <hr />

                <div className="transaction-info">
                    <div className="transaction-info-left-panel">
                        <p><strong>Split Bill ID :</strong> {data?.split_bill_id}</p>
                    </div>
                    <div className="transaction-info-right-panel">
                        <p>
                            <strong>Created :</strong>{" "}
                            {data?.created_time ? new Date(data.created_time).toLocaleDateString("id-ID") : "-"}
                        </p>
                    </div>
                </div>

                <div className="bill-info-container">
                    <div className="bill-info">
                        <p><strong>Bill Name :</strong> {data?.split_bill_title}</p>
                        <p><strong>Total Bill :</strong> {formatRp(String(totalBill))}</p>
                        <p><strong>Split Amount :</strong> {formatRp(String(totalParticipantAmount))}</p>
                        {remainingAmount > 0 && (
                            <p style={{ color: "#c00f0c", fontWeight: 600 }}>
                                Unsplit Amount : {formatRp(String(remainingAmount))}
                            </p>
                        )}
                        {remainingAmount === 0 && (
                            <p style={{ color: "#00a05a", fontWeight: 600 }}>
                                All amounts match the total bill.
                            </p>
                        )}
                    </div>
                </div>

                <div className="participant-section-container">
                    <div className="participant-section">
                        <div className="participant-header">
                            <span>No</span>
                            <span>Bill Member</span>
                            <span>Amount Per Member</span>
                            <span></span>
                        </div>

                        {participants.map((p, i) => (
                            <div key={p.id} className="participant-row">
                                <span className="member-index">{i + 1}</span>
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    ref={(el) => (inputRefs.current[p.id] = el)}
                                    value={p.participantName}
                                    onChange={(e) => handleChangeName(p.id, e.target.value)}
                                />
                                <div className="col-amount">
                                    <span className="rp-prefix">Rp</span>
                                    <input
                                        inputMode="numeric"
                                        type="text"
                                        placeholder="0"
                                        value={formatAmount(p.participantAmount)}
                                        onChange={(e) => handleChangeAmount(p.id, e.target.value)}
                                    />
                                </div>
                                <div className="row-actions">
                                    {participants.length > 1 && (
                                        <button type="button" className="rmv-btn" onClick={() => handleDeleteRow(p.id)}>
                                            <Minus />
                                        </button>
                                    )}
                                    {i === participants.length - 1 && (
                                        <button
                                            type="button"
                                            className="add-btn"
                                            onClick={handleAddRow}
                                            disabled={hasEmptyFields}
                                            style={{
                                                opacity: hasEmptyFields ? 0.4 : 1,
                                                cursor: hasEmptyFields ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            <Plus />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="add-participant-btn-container">
                    <button className="cancel-add-participant" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="add-participant-btn"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        style={{ opacity: isSaving ? 0.6 : 1, cursor: isSaving ? "not-allowed" : "pointer" }}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
