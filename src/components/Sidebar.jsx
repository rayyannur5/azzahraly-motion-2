import React, { useState } from "react";
import appLogo from "../assets/logo.png";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoFolderOpen } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { BsInfoCircleFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import { ref, uploadString } from "firebase/storage";
import { storage } from "../firebase";

export default function Sidebar({
  handlerDashboard,
  handlerNewProject,
  handlerOpenProject,
  handlerAbout,
}) {
  const [aktif, setAktif] = useState(0);

  let dataImport = "";
  let name = "";

  function handlerImportProject(event) {
    const file = event.target.files[0];
    name = file.name;
    const reader = new FileReader();
    const listener = reader.addEventListener("load", (res) => {
      dataImport = JSON.parse(res.target.result);
      const servo_check = dataImport.hasOwnProperty("servos");
      const motion_check = dataImport.hasOwnProperty("motions");
      const idGroup_check = dataImport.hasOwnProperty("idGroups");
      const element = document.getElementById("message_import_project");
      element.hidden = false;
      if (servo_check && motion_check && idGroup_check) {
        element.innerHTML =
          "<div class='text-green-600'>File can be imported</div>";
      } else {
        element.innerHTML =
          "<div class='text-red-600'>File can't be imported</div>";
      }
    });
    reader.readAsText(file);
  }

  function handlerImportButton() {
    if (dataImport == "") {
      toast("Import error");
      return;
    }

    const _ref = ref(storage, name);

    uploadString(_ref, JSON.stringify(dataImport))
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        toast(error);
      });
  }

  return (
    <>
      <section className="h-screen bg-sky-900 px-7">
        <div className="my-2 flex h-[10vh] items-center justify-center">
          <img src={appLogo} alt="Azzahraly" className="flex h-10 w-fit" />
        </div>
        <div className="flex flex-col gap-5">
          {/* active Button */}
          <button
            className={`btn gap-3 px-6 text-base font-semibold tracking-wide ${aktif == 0 ? " justify-start rounded-xl border-none bg-amber-600 text-white hover:bg-amber-700" : " justify-start border-none bg-sky-900 text-neutral-300 hover:rounded-xl hover:bg-sky-950 hover:text-white"}`}
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
            className={`btn gap-3 px-6 text-base font-semibold tracking-wide ${aktif == 1 ? " justify-start rounded-xl border-none bg-amber-600 text-white hover:bg-amber-700" : " justify-start border-none bg-sky-900 text-neutral-300 hover:rounded-xl hover:bg-sky-950 hover:text-white"}`}
            onClick={() => {
              setAktif(1);
              handlerNewProject();
            }}
          >
            <FaPlus />
            New Project
          </button>
          <button
            className={`btn gap-3 px-6 text-base font-semibold tracking-wide ${aktif == 2 ? " justify-start rounded-xl border-none bg-amber-600 text-white hover:bg-amber-700" : " justify-start border-none bg-sky-900 text-neutral-300 hover:rounded-xl hover:bg-sky-950 hover:text-white"}`}
            onClick={() => {
              document.getElementById("modal_import_project").showModal();
              handlerOpenProject();
            }}
          >
            <IoFolderOpen />
            Import Project
          </button>
          <button
            className={`btn gap-3 px-6 text-base font-semibold tracking-wide ${aktif == 3 ? " justify-start rounded-xl border-none bg-amber-600 text-white hover:bg-amber-700" : " justify-start border-none bg-sky-900 text-neutral-300 hover:rounded-xl hover:bg-sky-950 hover:text-white"}`}
            onClick={() => {
              setAktif(3);
              handlerAbout();
            }}
          >
            <BsInfoCircleFill />
            About Apps
          </button>
        </div>
      </section>
      <dialog id="modal_import_project" className="modal">
        <div className="modal-box w-1/3 max-w-5xl bg-slate-50 ">
          <h3 className="mb-6 flex justify-center text-lg font-bold text-slate-900">
            Import Project
          </h3>
          <div className="flex flex-col">
            <input
              type="file"
              id="input_import_project"
              className="file-input file-input-bordered w-full text-center  bg-slate-50 text-base"
              placeholder="File"
              onChange={handlerImportProject}
            />
            <p className="m-2" id="message_import_project" hidden></p>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mx-3 border-none bg-red-300 text-red-600  hover:bg-red-400 hover:text-red-600">
                Close
              </button>
              <button
                className="btn me-2 bg-amber-500 border-none text-white hover:bg-amber-600 hover:border-none"
                onClick={handlerImportButton}
              >
                Import
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}
