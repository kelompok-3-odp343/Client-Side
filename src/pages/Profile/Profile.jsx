import React, { useEffect, useState } from "react";
import "./Profile.css";
import Navbar from "../../components/Navbar/Navbar";
import { fetchUserProfile } from "../../data/profile";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId") || "dummyUser123";
        const data = await fetchUserProfile(userId);
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div className="error">Profile not available.</div>;

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
            <div className="info-box">
              <i className="fas fa-user"></i>
              <div>
                <p className="label">Name</p>
                <p className="value">{profile.name}</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-calendar-alt"></i>
              <div>
                <p className="label">Date of Birth</p>
                <p className="value">{profile.dob}</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-envelope"></i>
              <div>
                <p className="label">Email Address</p>
                <p className="value">{profile.email}</p>
              </div>
            </div>

            <div className="info-box">
              <i className="fas fa-phone"></i>
              <div>
                <p className="label">Phone Number</p>
                <p className="value">{profile.phone}</p>
              </div>
            </div>
          </div>

          <div className="signout-container">
            <button className="signout-btn" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}