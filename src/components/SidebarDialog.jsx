import React, { useState } from "react";
import appLogo from "../assets/logo.png";
import { MdSpaceDashboard } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoFolderOpen } from "react-icons/io5";
import { BsInfoCircleFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import { ref, uploadString } from "firebase/storage";
import { storage } from "../firebase";

export default function SidebarDialog({
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
      <section className=" rounded-lg  bg-sky-900 px-7">
        <div className="mb-4 flex h-[10vh] items-center justify-center">
          <img src={appLogo} alt="Azzahraly" className="flex h-8 w-fit" />
        </div>
        <div className="flex flex-col gap-5">
          {/* active Button */}
          <button
            className={`btn  gap-3 px-6 text-base font-semibold tracking-wide ${aktif == 0 ? " justify-start rounded-xl border-none bg-amber-600 text-white hover:bg-amber-700" : " justify-start border-none bg-sky-900 text-neutral-300 hover:rounded-xl hover:bg-sky-950 hover:text-white"}`}
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
          <button
            className={`btn mb-5 gap-3 px-6 text-base font-semibold tracking-wide ${aktif == 4 ? " justify-start rounded-xl border-none bg-amber-600 text-white hover:bg-amber-700" : " justify-start border-none bg-sky-900 text-neutral-300 hover:rounded-xl hover:bg-sky-950 hover:text-white"}`}
            onClick={() => {
              document.getElementById("modal_user_guide").showModal();
            }}
          >
            <BsInfoCircleFill />
            User's Guide
          </button>
        </div>
      </section>
      <dialog id="modal_import_project" className="modal">
        <div className="modal-box">
          <h3 className="mb-6 flex justify-center text-lg font-bold ">
            Import Project
          </h3>
          <div className="flex flex-col">
            <input
              type="file"
              id="input_import_project"
              className="file-input file-input-bordered w-full"
              placeholder="File"
              onChange={handlerImportProject}
            />
            <p className="m-2" id="message_import_project" hidden></p>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mx-3 border-2 border-red-500  bg-white text-red-500 hover:border-red-600 hover:bg-white hover:text-red-600">
                Close
              </button>
              <button
                className="btn me-2 bg-amber-500 text-white hover:bg-amber-600"
                onClick={handlerImportButton}
              >
                Import
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="modal_user_guide" className="modal">
        <div className="modal-box h-[90vh] w-11/12 max-w-7xl bg-slate-50 ">
          <h3 className="mb-6 flex justify-center text-lg font-bold text-slate-900">
            User's Guide
          </h3>
          <div className="flex flex-col justify-center items-center">
            <iframe
              src={
                "https://firebasestorage.googleapis.com/v0/b/azzahraly-motion.appspot.com/o/guide.pdf?alt=media&token=2d922c94-cefd-4927-8b8a-cf373eb7e742"
              }
              allowFullScreen={true}
              width="1080"
              height="720"
              title="My PDF Document"
            ></iframe>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mx-3 border-none bg-red-300 text-red-600  hover:bg-red-400 hover:text-red-600">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}
