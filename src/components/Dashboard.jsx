import { listAll, ref } from "firebase/storage";
import { storage } from "../firebase";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { HiDocumentDownload } from "react-icons/hi";
import azzahralyLogo from "../assets/KRSTI.png";
import recentTitle from "../assets/recent.png";

export default function Dashboard({ handlerOpenRecentProject }) {
  const [list, setList] = useState(Array());

  useEffect(() => {
    const refProject = ref(storage, "/");
    listAll(refProject).then((res) => {
      setList(res.items);
    });
  }, []);

  return (
    <>
      <div className="grid place-content-center item-center w-[82vw] h-screen bg-gradient-to-br from-cyan-500 to-sky-950 ">
        <div className="grid place-content-center item-center w-[75vw] h-[85vh] rounded-xl backdrop-blur-sm bg-sky-200/30">
          <div className="grid grid-cols-1 gap-6 content-center w-[65vw] h-[70vh]">
            <header className="flex justify-center my-2">
              <img src={recentTitle} alt="Recent Title" className="h-12 " />
            </header>
            <div className="flex h-[57vh]">
              <table className="text-white w-full table table-pin-rows items-center">
                {/* head */}
                <thead className="flex text-white w-full font-medium text-base">
                  <tr className="flex w-full rounded-lg border-none bg-sky-900">
                    <th className="p-4 w-1/12 text-center"> </th>
                    <th className="p-4 w-1/3">File Name</th>
                    <th className="p-4 w-1/3">Last Modified</th>
                    <th className="p-4 w-1/4">Action</th>
                  </tr>
                </thead>
                <tbody className="flex flex-col w-full items-center justify-start text-base overflow-y-scroll no-scrollbar h-[47vh]">
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>
                  {/* aktif */}
                  {list.map((project) => (
                    <tr
                      className="flex w-full text-sky-800 font-semibold bg-sky-200 border-none rounded-md hover:bg-sky-300 hover:text-sky-950 hover:border-none py-1"
                      key={project.name}
                      onClick={() => handlerOpenRecentProject(project)}
                    >
                      <td className="py-2 w-1/12 flex items-center justify-center">
                        <img
                          src={azzahralyLogo}
                          alt="Azzahraly"
                          className="h-6"
                        />
                      </td>
                      <td className="py-2 w-1/3 flex items-center justify-start">
                        {project.name}
                      </td>
                      <td className="py-2 w-1/3 flex items-center justify-start">
                        23.00; 12/02/2023
                      </td>
                      <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                        <button>
                          <MdDelete />
                        </button>
                        <button>
                          <HiDocumentDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>{" "}
                  {/* non aktif */}
                  <tr className="flex w-full border-b-1 border-sky-100 font-normal text-gray-200 py-1">
                    <td className="py-2 w-1/12 flex items-center justify-center ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      Cy Ganderton
                    </td>
                    <td className="py-2 w-1/3 flex items-center justify-start">
                      23.00; 12/02/2023
                    </td>
                    <td className="flex flex-row items-center justify-start gap-3 text-2xl py-2 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>
                </tbody>
                {/* <tbody className=" font-normal text-base text-white">
                  <tr>
                    <td className="p-4 w-1/4 ">
                      <img
                        src={azzahralyLogo}
                        alt="Azzahraly"
                        className="h-6"
                      />
                    </td>
                    <td className="p-4 w-1/4 ">Cy Ganderton</td>
                    <td className="p-4 w-1/4 ">Quality Control Specialist</td>
                    <td className="flex flex-row gap-5 text-3xl p-4 w-1/4 ">
                      <div>
                        <MdDelete />
                      </div>
                      <div>
                        <HiDocumentDownload />
                      </div>
                    </td>
                  </tr>
                  {list.map((project) => (
                    <tr
                      className="text-sky-950 font-medium bg-sky-200 border-none rounded-md hover:bg-sky-300 hover:border-none"
                      key={project.name}
                      onClick={() => handlerOpenRecentProject(project)}
                    >
                      <th>
                        <img
                          src={azzahralyLogo}
                          alt="Azzahraly"
                          className="h-6"
                        />
                      </th>
                      <td>{project.name}</td>
                      <td>23.00;12/02/2023</td>
                      <td className="flex flex-row gap-5 text-3xl">
                        <button>
                          <MdDelete />
                        </button>
                        <button>
                          <HiDocumentDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody> */}
              </table>
            </div>
          </div>
        </div>
        {/* <h3>Recent Project</h3>
      {list.map((project) => (
        <button
          className="btn p-2 m-2 bg-slate-200 hover:bg-slate-400"
          key={project.name}
        >
          {project.name}
        </button>
      ))} */}
      </div>
    </>
  );
}
