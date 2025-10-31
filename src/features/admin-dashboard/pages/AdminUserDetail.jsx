import React from "react";
import { useParams } from "react-router-dom";

export default function AdminUserDetail() {
  const { id } = useParams();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin User Detail</h1>
      <p>Menampilkan detail untuk user dengan ID: <strong>{id}</strong></p>
    </div>
  );
}