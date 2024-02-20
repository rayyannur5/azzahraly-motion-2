import { ref, uploadString } from "firebase/storage";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../firebase";
import newTitle from "../assets/new.png";
// const saveSync = require('save-file/sync')

export default function NewProject({ handleCloseButton, handleData }) {
  const [servos, setServos] = useState(Array());
  const [name, setName] = useState();
  const [aktif, setAktif] = useState(0);

  function handleJumlahServo(event) {
    let length = event.target.value;
    if (length == "") length = 0;
    const array = new Array(parseInt(length)).fill({
      id: null,
      servo: "XL-320",
    });
    setServos(array);
  }

  function handleChangeServo(index, value) {
    const temp = [...servos];
    const objTemp = temp[index];
    temp[index] = {
      id: objTemp.id,
      servo: value,
    };
    setServos(temp);
  }

  function handleChangeId(index, value) {
    const temp = [...servos];
    const objTemp = temp[index];
    temp[index] = {
      id: value,
      servo: objTemp.servo,
    };
    setServos(temp);
  }

  function handleChangeName(event) {
    setName(event.target.value);
  }

  async function saveProject() {
    console.log(servos);
    if (name == null || name == "") {
      toast("Nama harus diisi");
      return;
    }

    for (let i = 0; i < servos.length; i++) {
      const servo = servos[i];
      if (
        servo.id == null ||
        servo.id == "" ||
        servo.servo == null ||
        servo.servo == ""
      ) {
        toast("Semua servo wajib diisi");
        return;
      }
    }

    let data = {
      servos: servos,
      motions: [],
      idGroups: [],
    };

    const dataRef = ref(storage, `${name}.json`);

    uploadString(dataRef, JSON.stringify(data)).then((val) => {
      handleData(`${name}.json`, data);
    });
  }

  return (
    <>
      <div className="item-center grid h-screen w-[82vw] place-content-center bg-gradient-to-br from-cyan-500 to-sky-950 ">
        <div className="item-center first-line: grid h-[85vh] w-[75vw] place-content-center rounded-xl bg-sky-200/30 backdrop-blur-sm">
          <div className="grid h-[70vh] w-[65vw] grid-cols-1 content-center gap-7">
            <header className="my-2 flex justify-center">
              <img src={newTitle} alt="Recent Title" className="h-12 " />
            </header>
            <div className="flex flex-row items-center justify-center gap-4">
              <input
                type="text"
                className="input input-bordered input-md block w-full max-w-xs basis-1/2 rounded-xl bg-slate-50 text-center text-base font-semibold active:text-slate-950"
                placeholder="Project Name"
                onChange={handleChangeName}
              />
              <input
                type="number"
                className="input input-bordered input-md block w-full max-w-xs basis-1/2 rounded-xl bg-slate-50 text-center text-base font-semibold"
                placeholder="Number of Servo"
                onChange={handleJumlahServo}
              />
              <button
                className="btn basis-1/6 rounded-xl border-none bg-amber-500 text-base font-semibold tracking-wide text-white hover:bg-amber-600"
                onClick={saveProject}
              >
                Save Project
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex h-[50vh] w-[56vw] sm:rounded-lg">
                <table className=" table-pin-rows table w-full text-center text-white">
                  <thead className="flex w-full text-base font-medium text-white ">
                    <tr className="flex w-full rounded-lg border-transparent bg-sky-900">
                      <th className="w-1/6 p-4 ">No</th>
                      <th className="w-3/4 p-4 ">Type of Servo</th>
                      <th className="w-3/4 p-4 ">ID Servo</th>
                    </tr>
                  </thead>
                  <tbody className="no-scrollbar flex h-[40vh] w-full flex-col items-center justify-start overflow-y-scroll py-1 text-base font-medium text-black">
                    {servos.map((servo, index) => (
                      <tr key={index} className="flex w-full border-none">
                        <td className="w-1/6 p-1.5">
                          <button className="btn w-full rounded-xl border-none bg-sky-900 text-white">
                            {index + 1}
                          </button>
                        </td>
                        <td className="w-3/4 p-1.5">
                          <select
                            className="select select-bordered w-full rounded-xl bg-slate-50 text-center"
                            onChange={(event) =>
                              handleChangeServo(index, event.target.value)
                            }
                            value={servo.servo}
                          >
                            <option value="XL-320">XL-320</option>
                            <option value="MX-28">MX-28</option>
                          </select>
                        </td>
                        <td className="w-3/4 p-1.5">
                          <input
                            type="number"
                            className="input input-bordered w-full rounded-xl bg-slate-50 text-center "
                            placeholder="ID Servo"
                            onChange={(event) =>
                              handleChangeId(index, event.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
