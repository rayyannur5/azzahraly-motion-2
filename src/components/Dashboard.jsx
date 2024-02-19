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
      <div className="item-center grid h-screen w-[82vw] place-content-center bg-gradient-to-br from-cyan-500 to-sky-950 ">
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
                  {list.map((project) => (
                    <tr
                      className="border-b-1 flex w-full border-sky-100 py-1 font-normal text-gray-200 hover:bg-sky-300"
                      key={project.name}
                      onClick={() => handlerOpenRecentProject(project)}
                    >
                      <td className="flex w-1/12 items-center justify-center py-2">
                        <img
                          src={azzahralyLogo}
                          alt="Azzahraly"
                          className="h-6"
                        />
                      </td>
                      <td className="flex w-1/3 items-center justify-start py-2">
                        {project.name}
                      </td>
                      <td className="flex w-1/3 items-center justify-start py-2">
                        23.00; 12/02/2023
                      </td>
                      <td className="flex w-1/4 flex-row items-center justify-start gap-3 py-2 text-2xl ">
                        <button>
                          <MdDelete />
                        </button>
                        <button>
                          <HiDocumentDownload />
                        </button>
                      </td>
                    </tr>
                  ))}
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
