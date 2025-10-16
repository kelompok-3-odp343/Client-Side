import React, { useEffect, useState } from "react";
import "../styles/profile.css";
import Navbar from "../../../shared/components/Navbar";
import { getUserProfile } from '../api/profileService';

export default function Profile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const response = await getUserProfile();
      setProfile(response.data.profile);
      setLoading(false);
    };

    getProfile();
  }, []);

  if (loading) return <p><center>Loading profile...</center></p>;

  const fullName = [profile.first_name, profile.middle_name, profile.last_name]
    .filter(Boolean)
    .join(" ");

  const formattedDOB = new Date(profile.dob).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-wrapper">
        <section className="profile-left">
          <div className="avatar">
            <i className="fas fa-user"></i>
          </div>
          <h2 className="user-name">{fullName}</h2>

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
            <div className="info-box">
              <i className="fas fa-user"></i>
              <div>
                <p className="label">Name</p>
                <p className="value">{fullName}</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <p className="label">Date of Birth</p>
                <p className="value">{formattedDOB}</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-envelope"></i>
              <div>
                <p className="label">Email Address</p>
                <p className="value">{profile.email_address}</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-phone"></i>
              <div>
                <p className="label">Phone Number</p>
                <p className="value">{profile.phone_number}</p>
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