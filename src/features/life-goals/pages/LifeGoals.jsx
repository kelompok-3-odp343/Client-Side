import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../../shared/components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/life-goals.css";
import { fetchLifeGoalsRevamp } from "../api/life-goals.api";
import LIFE_GOALS_META from "../constants/life-goals.meta"; // pakai hanya desc + base color (untuk gradient subcard)

export default function LifeGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState({});
  const [loading, setLoading] = useState(false);

  // --- helpers ---
  const formatRupiah = (n) => {
    if (n === null || n === undefined) return "Rp 0";
    const s = Number(n).toLocaleString("id-ID");
    return `Rp ${s}`;
  };

  const calcPercent = (current, target) => {
    if (!target || target <= 0) return 0;
    const pct = Math.round((Number(current || 0) / Number(target)) * 100);
    return Math.max(0, Math.min(100, pct));
  };

  const normKey = (name = "") =>
    String(name).trim().toLowerCase().replace(/\s+/g, "_");

  const CATEGORY_COLOR_FIX = {
    vacations: "#ffd367",
    vehicles: "#ffed9c",
    marriage: "#9c7edc",
    home: "#c3aff1",
    education: "#71d9d0",
    gadget: "#b6efe9",
  };

  const getMeta = (category = "") => {
    const key = normKey(category);
    const map = {
      vacation: "vacation",
      vacation: "vacation",
      education: "education",
      marriage: "marriage",
      home: "home",
      gadget: "gadget",
      gadgets: "gadget",
      vehicle: "vehicles",
      vehicles: "vehicles",
    };
    const metaKey = map[key] || key;
    const meta = CATEGORY_COLOR_FIX[metaKey] || {};

    return {
      desc: meta?.desc || "",
      color: CATEGORY_COLOR_FIX[metaKey] || meta?.color || "#9fb4ff",
    };
  };

  // bikin gradient lembut dari hex
  const hexToRgb = (hex) => {
    const h = hex.replace("#", "");
    const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const makeSoftGradient = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    // warna sangat soft (alpha kecil) agar tetap netral seperti mockup
    return `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, 0.22) 0%, rgba(${r}, ${g}, ${b}, 0.10) 100%)`;
  };

  useEffect(() => {
    async function loadGoals() {
      setLoading(true);
      const data = await fetchLifeGoalsRevamp("USER001");
      setGoals(data || {});
      setLoading(false);
    }
    loadGoals();
  }, []);

  const hasData = useMemo(() => Object.keys(goals || {}).length > 0, [goals]);

  if (loading) return <div className="loading">Loading Life Goals...</div>;

  return (
    <div className="life-goals-page">
      <Navbar />
      <h2 className="section-title">Life Goals Information</h2>
      <p className="section-subtitle">Small saves fuel big dreams</p>

      <div className="goals-sections">
        {!hasData && (
          <div className="empty-state">
            <p>Tidak ada data Life Goals.</p>
          </div>
        )}

        {hasData &&
          Object.entries(goals).map(([category, obj]) => {
            const totalTarget = obj?.totalTarget ?? 0;
            const currentBalance = obj?.currentBalance ?? 0;
            const bigPct = calcPercent(currentBalance, totalTarget);
            const meta = getMeta(category);
            console.log('zxczxc', meta);


            return (
              <section key={category} className="category-block">
                {/* Header kategori FLAT */}
                <header className="category-header">
                  <h3 className="category-title">{category}</h3>
                  {meta.desc ? <p className="category-subtitle">{meta.desc}</p> : null}
                </header>

                {/* Big total row */}
                <div className="category-total-row">
                  <div className="total-amounts">
                    <span className="amount-current">{formatRupiah(currentBalance)}</span>
                    <span className="amount-sep">/</span>
                    <span className="amount-target">{formatRupiah(totalTarget)}</span>
                  </div>
                </div>

                {/* Big progress */}
                <div className="big-progress">
                  <div className="big-progress-fill" style={{ width: `${bigPct}%` }} />
                </div>
                <div className="big-progress-meta">
                  <span>{bigPct}% achieved</span>
                </div>

                {/* Grid sub-cards 3 kolom */}
                <div className="subcards-grid">
                  {(obj?.lifeGoalsList || []).map((item) => {
                    const miniPct = calcPercent(item?.currentBalance, item?.targetBalance);
                    const bg = makeSoftGradient(meta.color);

                    return (
                      <article
                        key={item.id}
                        className="subcard"
                        style={{ backgroundImage: bg }}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/lifegoal/${item.id}`, { state: { item, category } })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            navigate(`/lifegoal/${item.id}`, { state: { item, category } });
                          }
                        }}
                      >
                        <div className="subcard-header stacked">
                          <div className="subcard-title" title={item?.lifegoalsTitle}>
                            {item?.lifegoalsTitle || "-"}
                          </div>

                          <div className="subcard-amounts stacked">
                            <span className="amount-current">
                              {formatRupiah(item?.currentBalance)}
                            </span>
                            <span className="amount-sep">/</span>
                            <span className="amount-target">
                              {formatRupiah(item?.targetBalance)}
                            </span>
                          </div>
                        </div>

                        <div className="mini-progress">
                          <div className="mini-progress-fill" style={{ width: `${miniPct}%` }} />
                        </div>

                        <div className="mini-progress-meta">
                          <span className="mini-left">
                            {miniPct}% • {item?.lifegoalsCategory || category}
                          </span>
                          <span className="mini-right">
                            Created:{" "}
                            {item?.createdTime
                              ? new Date(item.createdTime).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              : "-"}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Separator antar kategori */}
                <div className="category-separator" />
              </section>
            );
          })}
      </div>
    </div>
  );
}
