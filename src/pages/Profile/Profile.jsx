import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Profile.css";
import { fetchUserProfile } from "../../data/profile";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user?.id || "USR001";

    const loadProfile = async () => {
      const data = await fetchUserProfile(userId);
      setProfile(data);
    };

    loadProfile();
  }, []);

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-wrapper">
        {/* LEFT SIDE */}
        <section className="profile-left">
          <div className="avatar">
            <i className="fas fa-user"></i>
          </div>
          <h2 className="user-name">{profile.name}</h2>

          <div className="cif-card">
            <i className="fas fa-id-card"></i>
            <div>
              <p className="label">CIF</p>
              <p className="value">{profile.cif}</p>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="profile-right">
          <h2 className="section-title">Personal Information</h2>

          <div className="info-grid">
            <InfoBox icon="fas fa-user" label="Name" value={profile.name} />
            <InfoBox icon="fas fa-calendar-alt" label="Date of Birth" value={profile.dob} />
            <InfoBox icon="fas fa-envelope" label="Email Address" value={profile.email} />
            <InfoBox icon="fas fa-phone" label="Phone Number" value={profile.phone} />
          </div>

          <div className="signout-container">
            <button
              className="signout-btn"
              onClick={() => {
                localStorage.removeItem("userEmail");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Sign Out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="info-box">
      <i className={icon}></i>
      <div>
        <p className="label">{label}</p>
        <p className="value">{value}</p>
      </div>
    </div>
  );
}