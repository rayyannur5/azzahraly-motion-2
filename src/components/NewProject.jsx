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
    };

    const dataRef = ref(storage, `${name}.json`);

    uploadString(dataRef, JSON.stringify(data)).then((val) => {
      handleData(name, servos);
    });
  }

  return (
    <>
      <div className="grid place-content-center item-center w-[82vw] h-screen bg-gradient-to-br from-cyan-500 to-sky-950 ">
        <div className="grid place-content-center item-center w-[75vw] h-[85vh] rounded-xl first-line: backdrop-blur-sm bg-sky-200/30">
          <div className="grid grid-cols-1 gap-7 content-center w-[65vw] h-[70vh]">
            <header className="flex justify-center my-2">
              <img src={newTitle} alt="Recent Title" className="h-12 " />
            </header>
            <div className="flex flex-row gap-4 justify-center items-center">
              <input
                type="text"
                className="basis-1/2 input input-bordered text-base font-semibold text-center input-md block w-full max-w-xs rounded-xl bg-slate-50"
                placeholder="Project Name"
                onChange={handleChangeName}
              />
              <input
                type="number"
                className="basis-1/2 input input-bordered text-base font-semibold text-center input-md block w-full max-w-xs rounded-xl bg-slate-50"
                placeholder="Number of Servo"
                onChange={handleJumlahServo}
              />
              <button
                className="basis-1/6 btn text-base font-semibold tracking-wide text-white rounded-xl bg-amber-500 border-none hover:bg-amber-600"
                onClick={saveProject}
              >
                Save Project
              </button>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex w-[56vw] h-[50vh] sm:rounded-lg">
                <table className=" text-white w-full table table-pin-rows text-center">
                  <thead className="flex text-white w-full font-medium text-base ">
                    <tr className="flex w-full border-transparent bg-sky-900 rounded-lg">
                      <th className="p-4 w-1/6 ">No</th>
                      <th className="p-4 w-3/4 ">Type of Servo</th>
                      <th className="p-4 w-3/4 ">ID Servo</th>
                    </tr>
                  </thead>
                  <tbody className="flex flex-col w-full items-center justify-start font-medium text-base text-black overflow-y-scroll no-scrollbar h-[40vh] py-1">
                    {servos.map((servo, index) => (
                      <tr key={index} className="flex w-full border-none">
                        <td className="p-1.5 w-1/6">
                          <button className="btn w-full border-none bg-sky-900 rounded-xl text-white">
                            {index + 1}
                          </button>
                        </td>
                        <td className="p-1.5 w-3/4">
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
                        <td className="p-1.5 w-3/4">
                          <input
                            type="number"
                            className="input input-bordered text-center bg-slate-50 w-full rounded-xl "
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
