import { listAll, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { HiDocumentDownload } from "react-icons/hi";
import azzahralyLogo from "../assets/KRSTI.png";
import recentTitle from "../assets/recent.png";
import { ToastContainer, toast } from "react-toastify";

export default function Dashboard({ handlerOpenRecentProject }) {
  const [list, setList] = useState(Array());

  useEffect(() => {
    const refProject = ref(storage, "/");
    listAll(refProject).then((res) => {
      setList(res.items);
    });
  }, []);

  function deleteFile(index) {
    const _ref = ref(storage, list[index]);

    // Delete the file
    deleteObject(_ref)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        toast(error);
      });
  }

  function downloadFile(index) {
    getDownloadURL(ref(storage, list[index]))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        console.log(url);
        // This can be downloaded directly:
        window.location.assign(url);
      })
      .catch((error) => {
        toast(error);
      });
  }

  return (
    <>
      <div className="item-center grid h-screen place-content-center bg-gradient-to-br from-cyan-500 to-sky-950 ">
        <div className="item-center grid h-[85vh] w-[75vw] place-content-center rounded-xl bg-sky-200/30 backdrop-blur-sm">
          <div className="grid h-[70vh] w-[65vw] grid-cols-1 content-center gap-6">
            <header className="my-2 flex justify-center">
              <img src={recentTitle} alt="Recent Title" className="h-12 " />
            </header>
            <div className="flex h-[57vh]">
              <table className="table-pin-rows table w-full items-center text-white">
                {/* head */}
                <thead className="flex w-full text-base font-medium text-white">
                  <tr className="flex w-full rounded-lg border-none bg-sky-900">
                    <th className="w-1/12 p-4 text-center"> </th>
                    <th className="w-1/3 p-4">File Name</th>
                    <th className="w-1/3 p-4">Last Modified</th>
                    <th className="w-1/4 p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="no-scrollbar flex h-[47vh] w-full flex-col items-center justify-start overflow-y-scroll text-base">
                  {/* aktif */}
                  {list.map((project, index) => (
                    <tr
                      className="border-b-1 flex w-full border-sky-100 py-1 font-normal text-gray-200 hover:border-slate-950 hover:bg-sky-300 hover:font-medium hover:text-slate-950"
                      key={project.name}
                    >
                      <td className="flex w-1/12 items-center justify-center py-2">
                        <img
                          src={azzahralyLogo}
                          alt="Azzahraly"
                          className="h-6"
                        />
                      </td>
                      <td className="flex w-1/3 items-center justify-start py-2">
                        <button
                          onClick={() => handlerOpenRecentProject(project)}
                        >
                          {project.name}
                        </button>
                      </td>
                      <td className="flex w-1/3 items-center justify-start py-2">
                        23.00; 12/02/2023
                      </td>
                      <td className="flex w-1/4 flex-row items-center justify-start gap-3 py-2 text-2xl ">
                        <button
                          onClick={() => {
                            deleteFile(index);
                          }}
                        >
                          <MdDelete />
                        </button>
                        <button
                          onClick={() => {
                            downloadFile(index);
                          }}
                        >
                          <HiDocumentDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
