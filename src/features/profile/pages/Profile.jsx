import React from "react";
import "../styles/profile.css";
import Navbar from "../../../shared/components/Navbar";

export default function Profile() {
  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-wrapper">
        {/* LEFT SIDE */}
        <section className="profile-left">
          <div className="avatar">
            <i className="fas fa-user"></i>
          </div>
          <h2 className="user-name">Ulion Pardede</h2>

          <div className="cif-card">
            <i className="fas fa-id-card"></i>
            <div>
              <p className="label">CIF</p>
              <p className="value">9285711829</p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="profile-right">
          <h2 className="section-title">Personal Information</h2>

          <div className="info-grid">
            <div className="info-box">
              <i className="fas fa-user"></i>
              <div>
                <p className="label">Name</p>
                <p className="value">Ulion Pardede</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <p className="label">Date of Birth</p>
                <p className="value">28 August 1995</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-envelope"></i>
              <div>
                <p className="label">Email Address</p>
                <p className="value">ulion99pardede@gmail.com</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-phone"></i>
              <div>
                <p className="label">Phone Number</p>
                <p className="value">082376180082</p>
              </div>
            </div>
          </div>

          <div className="signout-container">
            <button
              className="signout-btn"
              onClick={() => (window.location.href = "/")}
            >
              Sign Out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}