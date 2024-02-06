import React, { useState } from "react";
import appLogo from "../assets/logo.png";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoFolderOpen } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { BsInfoCircleFill } from "react-icons/bs";

export default function Sidebar({
  handlerDashboard,
  handlerNewProject,
  handlerOpenProject,
}) {
  const [aktif, setAktif] = useState(0);

  return (
    <>
      <section className="w-[20vw] h-screen bg-sky-900 py-10 px-7">
        <div className="mb-10 flex justify-center item-center ">
          <img src={appLogo} alt="Azzahraly" className="h-11" />
        </div>
        <div className="flex flex-col gap-5">
          {/* active Button */}
          <button
            className={`btn px-6 gap-3 text-base font-semibold tracking-wide ${aktif == 0 ? " text-white justify-start bg-amber-500 border-none hover:bg-amber-600" : " text-neutral-300 justify-start  bg-sky-900 border-none hover:bg-sky-950 hover:text-white"}`}
            onClick={() => {
              setAktif(0);
              handlerDashboard();
            }}
          >
            <MdSpaceDashboard />
            Dashboard
          </button>
          {/* Disable */}
          <button
            className={`btn px-6 gap-3 text-base font-semibold tracking-wide ${aktif == 1 ? " text-white justify-start bg-amber-500 border-none hover:bg-amber-600" : " text-neutral-300 justify-start  bg-sky-900 border-none hover:bg-sky-950 hover:text-white"}`}
            onClick={() => {
              setAktif(1);
              handlerNewProject();
            }}
          >
            <FaPlus />
            New Project
          </button>
          <button
            className={`btn px-6 gap-3 text-base font-semibold tracking-wide ${aktif == 2 ? " text-white justify-start bg-amber-500 border-none hover:bg-amber-600" : " text-neutral-300 justify-start  bg-sky-900 border-none hover:bg-sky-950 hover:text-white"}`}
            onClick={() => {
              setAktif(2);
              handlerOpenProject();
            }}
          >
            <IoFolderOpen />
            Open Project
          </button>
          <button className="btn px-6 gap-3 text-base font-semibold tracking-wide text-neutral-300 justify-start  bg-sky-900 border-none hover:bg-sky-950 hover:text-white">
            <IoSettings />
            Settings
          </button>
          <button className="btn px-6 gap-3 text-base font-semibold tracking-wide text-neutral-300 justify-start  bg-sky-900 border-none hover:bg-sky-950 hover:text-white">
            <BsInfoCircleFill />
            About Apps
          </button>
        </div>
      </section>
    </>
  );
}
