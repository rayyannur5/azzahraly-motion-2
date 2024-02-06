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
    <div className="w-[calc(100vw-20vw)] h-screen bg-gradient-to-br from-cyan-500 to-sky-950 ">
      {/* <header className="navbar justify-center pt-10 pb-4 bg-sky-900">
        <h1 className="text-white text-2xl font-semibold">Recent Project</h1>
      </header> */}
      <div className="grid grid-cols-1 w-[calc(94vw-20vw)] h-[calc(100vh-6vw)] rounded-2xl m-12 backdrop-blur-sm bg-sky-200/30">
        <div className="overflow-y-auto mx-20 my-12">
          <header className="flex justify-center mb-11">
            <img src={recentTitle} alt="Recent Title" className="h-11" />
          </header>
          <table className="table">
            {/* head */}
            <thead className="font-medium text-xl text-white ">
              <tr className="">
                <th></th>
                <th>File Name</th>
                <th>Last Modified</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className=" font-normal text-base text-white">
              {list.map((project) => (
                <tr
                  className="text-sky-950 bg-sky-200 border-none rounded-md hover:bg-sky-300 hover:border-none"
                  key={project.name}
                  onClick={() => handlerOpenRecentProject(project)}
                >
                  <th>
                    <img src={azzahralyLogo} alt="Azzahraly" className="h-6" />
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
              {/* row 1 */}
              {/* row 2 */}
              <tr>
                <th>
                  <img src={azzahralyLogo} alt="Azzahraly" className="h-6" />
                </th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td className="flex flex-row gap-5 text-3xl">
                  <div>
                    <MdDelete />
                  </div>
                  <div>
                    <HiDocumentDownload />
                  </div>
                </td>
              </tr>
              {/* row 3 */}
              <tr>
                <th>
                  {" "}
                  <img src={azzahralyLogo} alt="Azzahraly" className="h-6" />
                </th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td className="flex flex-row gap-5 text-3xl">
                  <div>
                    <MdDelete />
                  </div>
                  <div>
                    <HiDocumentDownload />
                  </div>
                </td>
              </tr>
              {/* row 4 */}
              <tr>
                <th>
                  {" "}
                  <img src={azzahralyLogo} alt="Azzahraly" className="h-6" />
                </th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td className="flex flex-row gap-5 text-3xl">
                  <div>
                    <MdDelete />
                  </div>
                  <div>
                    <HiDocumentDownload />
                  </div>
                </td>
              </tr>
              {/* row 5 */}
              <tr>
                <th>
                  {" "}
                  <img src={azzahralyLogo} alt="Azzahraly" className="h-6" />
                </th>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td className="flex flex-row gap-5 text-3xl">
                  <div>
                    <MdDelete />
                  </div>
                  <div>
                    <HiDocumentDownload />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
  );
}
