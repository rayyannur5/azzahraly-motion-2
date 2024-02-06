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
      <div className="flex flex-col w-[calc(100vw-20svw)] h-screen bg-gradient-to-br from-cyan-500 to-sky-950 ">
        <div className="grid grid-cols-1 w-[calc(94vw-20vw)] h-[calc(100vh-6vw)] rounded-2xl m-12 backdrop-blur-sm bg-sky-200/30">
          <div className=" mx-20 my-12">
            <header className="flex justify-center mb-11">
              <img src={newTitle} alt="Recent Title" className="h-11" />
            </header>
            <div className="flex flex-col">
              <div className=" flex flex-row justify-center space-x-4 items-center mb-6">
                <input
                  type="text"
                  className="input input-bordered text-base font-semibold text-center input-md block w-full max-w-xs m-2 rounded-xl"
                  placeholder="Project Name"
                  onChange={handleChangeName}
                />
                <input
                  type="number"
                  className="input input-bordered text-base font-semibold text-center input-md w-full max-w-xs m-2 rounded-xl"
                  placeholder="Number of Servo"
                  onChange={handleJumlahServo}
                />
                <button
                  className="btn px-14 text-base font-semibold tracking-wide text-white justify-start rounded-xl bg-amber-500 border-none hover:bg-amber-600"
                  onClick={saveProject}
                >
                  Save Project
                </button>
              </div>
              <div className="flex flex-row justify-center">
                <div className="overflow-auto w-[calc(78vw-24vw)] h-[calc(94vh-20vw)] mx- text-center">
                  <table className="table table-pin-rows text-center">
                    <thead className="font-light text-base text-black">
                      <tr className="border-none">
                        <th>No</th>
                        <th>Type of Servo</th>
                        <th>ID Servo</th>
                      </tr>
                    </thead>
                    <tbody className="font-medium text-base text-black">
                      {servos.map((servo, index) => (
                        <tr key={index} className="border-none">
                          <td className="">
                            <button className="btn bg-sky-900 rounded-md text-white">
                              {index + 1}
                            </button>
                          </td>
                          <td className="">
                            <select
                              className="select select-bordered w-full"
                              onChange={(event) =>
                                handleChangeServo(index, event.target.value)
                              }
                              value={servo.servo}
                            >
                              <option value="XL-320">XL-320</option>
                              <option value="MX-28">MX-28</option>
                            </select>
                          </td>
                          <td className="">
                            <input
                              type="number"
                              className="input input-bordered w-full"
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
              <div></div>
            </div>
          </div>
        </div>
        {/* <div className="h-[5vh] border flex justify-between items-center px-4">
          <div>New Project</div>
          <button onClick={handleCloseButton} className="btn btn-sm">
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <div className=" border flex flex-row items-center">
            <input
              type="text"
              className="input input-bordered w-full max-w-xs m-2"
              placeholder="Nama Project"
              onChange={handleChangeName}
            />
            <input
              type="number"
              className="input input-bordered w-full max-w-xs m-2"
              placeholder="Jumlah Servo"
              onChange={handleJumlahServo}
            />
            <button className="btn" onClick={saveProject}>
              Save Project
            </button>
          </div>
          <div>
            <table className="table-auto w-[92vw] text-left">
              <thead className="border">
                <tr>
                  <th className="p-2">No</th>
                  <th className="p-2">Jenis Servo</th>
                  <th className="p-2">ID Servo</th>
                </tr>
              </thead>
              <tbody>
                {servos.map((servo, index) => (
                  <tr key={index}>
                    <td className="border-b p-2">{index + 1}</td>
                    <td className="border-b p-2">
                      <select
                        className="select select-bordered w-full"
                        onChange={(event) =>
                          handleChangeServo(index, event.target.value)
                        }
                        value={servo.servo}
                      >
                        <option value="XL-320">XL-320</option>
                        <option value="MX-28">MX-28</option>
                      </select>
                    </td>
                    <td className="border-b p-2">
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="id Servo"
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
        </div> */}
      </div>
      <ToastContainer />
    </>
  );
}
