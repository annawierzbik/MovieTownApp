import React from "react";
import { UpdateMeForm } from "../components/UpdateMeForm";
import { User } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";

export const Profile = () => {
  return (
    <div className="bg-black text-pink-500 font-sans overflow-x-hidden p-3">
      <Navbar />
      <LaserBackground />
      <UpdateMeForm />
    </div>
  );
};
