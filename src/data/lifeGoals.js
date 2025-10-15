// Simulated API endpoint: /api/funds/{user_id}/life-goals
import graduationIcon from "../assets/images/education.png";
import vacationIcon from "../assets/images/vacation.png";
import marriageIcon from "../assets/images/marriage.png";
import homeIcon from "../assets/images/home.png";
import gadgetIcon from "../assets/images/gadget.png";
import vehicleIcon from "../assets/images/vehicle.png";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchLifeGoals(userId) {
  await delay(300);

  return [
    {
      id: "education",
      title: "Education",
      desc: "Invest in Your Brightest Future",
      color: "#71d9d0",
      current: 50000000,
      target: 100000000,
      progress: 50,
      icon: graduationIcon,
      user_id: userId,
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
      user_id: userId,
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
      user_id: userId,
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
      user_id: userId,
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
      user_id: userId,
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
      user_id: userId,
    },
  ];
}