import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./LifeGoals.css";
import LifeGoalCard from "../../components/LifeGoalsCard/LifeGoalsCard";

import graduationIcon from "../../assets/images/education.png";
import vacationIcon from "../../assets/images/vacation.png";
import marriageIcon from "../../assets/images/marriage.png";
import homeIcon from "../../assets/images/home.png";
import gadgetIcon from "../../assets/images/gadget.png";
import vehicleIcon from "../../assets/images/vehicle.png";

export default function LifeGoals() {
  const navigate = useNavigate();

  const goals = [
    {
      id: "education",
      title: "Education",
      desc: "Invest in Your Brightest Future",
      color: "#71d9d0",
      current: 50000000,
      target: 100000000,
      progress: 50,
      icon: graduationIcon,
    },
    {
      id: "vacations",
      title: "Vacations",
      desc: "Your Passport to New Memories",
      color: "#ffd367",
      current: 80000000,
      target: 100000000,
      progress: 80,
      icon: vacationIcon,
    },
    {
      id: "marriage",
      title: "Marriage",
      desc: "Funding your new chapter",
      color: "#9c7edc",
      current: 50000000,
      target: 100000000,
      progress: 50,
      icon: marriageIcon,
    },
    {
      id: "home",
      title: "Home",
      desc: "Saving for Memories Unmade",
      color: "#9c7edc",
      current: 50000000,
      target: 100000000,
      progress: 50,
      icon: homeIcon,
    },
    {
      id: "gadget",
      title: "Gadget",
      desc: "Smart saving for smart tech",
      color: "#6dddd0",
      current: 50000000,
      target: 100000000,
      progress: 50,
      icon: gadgetIcon,
    },
    {
      id: "vehicles",
      title: "Vehicles",
      desc: "Fuel your future ride",
      color: "#ffd367",
      current: 50000000,
      target: 100000000,
      progress: 50,
      icon: vehicleIcon,
    },
  ];

  return (
    <div className="life-goals-page">
      <Navbar />
      <h2 className="section-title">Life Goals Information</h2>
      <p className="section-subtitle">Small saves fuel big dreams</p>

      <div className="life-goal-grid">
        {goals.map((goal) => (
          <LifeGoalCard
            key={goal.id}
            goal={goal}
            onClick={() => navigate(`/lifegoal/${goal.id}`)}
          />
        ))}
      </div>
    </div>
  );
}