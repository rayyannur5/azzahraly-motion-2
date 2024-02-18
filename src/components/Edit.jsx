import { ref, uploadString } from "firebase/storage";
import { Component, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { storage } from "../firebase";
import {
  FaSave,
  FaPlus,
  FaMinus,
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
} from "react-icons/fa";
import { MdOutlineUsb, MdOutlineUsbOff, MdDelete } from "react-icons/md";
import { FaCirclePlay, FaCircleStop } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import motionUnit from "../assets/motionunit.png";
import motionStep from "../assets/motionstep.png";
import poseofStep from "../assets/poseofstep.png";
import poseofRobot from "../assets/poseofrobot.png";

export default class Edit extends Component {
  port = null;
  textEncoder = null;
  writableStreamClosed = null;
  writer = null;
  historyIndex = -1;

  constructor(props) {
    super(props);

    this.state = {
      data: props.data.data,
      activeMotion: null,
      activeStep: null,
    };
    this.saveNewMotion = this.saveNewMotion.bind(this);
    this.save = this.save.bind(this);
    this.handlerNewStep = this.handlerNewStep.bind(this);
    this.handlerDeleteStep = this.handlerDeleteStep.bind(this);
    this.handlerChangeTime = this.handlerChangeTime.bind(this);
    this.handlerChangePause = this.handlerChangePause.bind(this);
    this.handlerChangeStepVal = this.handlerChangeStepVal.bind(this);
    this.listenToPort = this.listenToPort.bind(this);
    this.connect = this.connect.bind(this);
  }

  saveNewMotion() {
    const name = document.getElementById("input_new_motion");

    this.state.data.motions.push({
      name: name.value,
      steps: [],
      next: 0,
    });
    this.setState({
      data: this.state.data,
    });

    name.value = "";
  }

  handlerMotionClick(index) {
    this.setState({
      activeMotion: index,
      activeStep: null,
    });
  }

  handlerNewStep() {
    if (this.state.activeMotion == null) {
      toast("Select motion first");
      return;
    }

    const tempValue = [];
    this.state.data.servos.forEach((servo) => {
      tempValue.push(servo.servo == "XL-320" ? 512 : 2048);
    });

    this.state.data.motions[this.state.activeMotion].steps.push({
      time: 1000,
      pause: 1000,
      value: tempValue,
    });

    this.setState({
      data: this.state.data,
    });
  }

  handlerStepClick(index) {
    this.setState({
      activeStep: index,
    });
  }

  handlerDeleteStep() {
    if (this.state.activeStep == null) {
      toast("Select step first");
      return;
    }

    this.state.data.motions[this.state.activeMotion].steps.splice(
      this.state.activeStep,
      1
    );

    this.setState({
      activeStep: null,
      data: this.state.data,
    });
  }

  handlerChangeTime(value, index) {
    this.state.data.motions[this.state.activeMotion].steps[index].time = value;
    this.setState({
      data: this.state.data,
    });
  }

  handlerChangePause(value, index) {
    this.state.data.motions[this.state.activeMotion].steps[index].pause = value;
    this.setState({
      data: this.state.data,
    });
  }

  handlerChangeStepVal(value, index) {
    this.state.data.motions[this.state.activeMotion].steps[
      this.state.activeStep
    ].value[index] = value;
    this.setState({
      data: this.state.data,
    });
  }

  save() {
    const dataRef = ref(storage, this.props.data.name);
    uploadString(dataRef, JSON.stringify(this.state.data)).then(() =>
      toast("Data saved")
    );
  }

  async listenToPort() {
    const textDecoder = new TextDecoderStream();

    const readableStreamClosed = this.port.readable.pipeTo(
      textDecoder.writable
    );
    const reader = textDecoder.readable.getReader();

    // Listen to data coming from the serial device.
    let connect = false;
    let readd = false;
    let data = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        console.log("[readLoop] DONE", done);
        reader.releaseLock();
        break;
      }
      // value is a string.
      console.log("From Arduino : " + value);
      if (value.startsWith("*")) {
        connect = true;
      }
      if (value.startsWith("R")) {
        readd = true;
      }

      // if (value.startsWith("*")) {
      //   connect = true;
      // }
      if (connect) {
        for (let i = 0; i < value.length; i++) {
          data += value[i];
          if (value[i] == "#") {
            data = data.slice(1, data.length - 2);
            const ar = data.split(",");
            dasar = ar;
            console.log(dasar);
            data = "";
            connect = false;
          }
        }
      }

      // if (readd) {
      //   for (let i = 0; i < value.length; i++) {
      //     data += value[i];
      //     if (value[i] == "#") {
      //       data = data.slice(1, data.length - 2);
      //       const ar = data.split(",");
      //       openRead(ar);
      //       data = "";
      //       readd = false;
      //     }
      //   }
      // }
    }
  }

  async connect() {
    try {
      // Prompt user to select any serial port.
      this.port = await navigator.serial.requestPort();

      await this.port.open({ baudRate: 115200 });
      let settings = {};

      // if (localStorage.dtrOn == "true") settings.dataTerminalReady = true;
      // if (localStorage.rtsOn == "true") settings.requestToSend = true;
      // if (Object.keys(settings).length > 0) await port.setSignals(settings);

      this.textEncoder = new TextEncoderStream();
      this.writableStreamClosed = this.textEncoder.readable.pipeTo(
        this.port.writable
      );
      this.writer = this.textEncoder.writable.getWriter();
      await this.writer.write("aaaaa*C#");
      await this.listenToPort();
    } catch (e) {
      alert("Serial Connection Failed" + e);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendCommand(command) {
    // let command = document.getElementById("command").value;
    await this.writer.write("aaaaa*");
    for (let i = 0; i < Math.ceil(command.length / 50); i++) {
      const element = command.substr(i * 50, 50);
      console.log(element);
      await this.writer.write(element);
      await this.sleep(100);
    }
    await this.writer.write("#");
    // await writer.write("aaaaa*" + command + "#");
  }

  render() {
    return (
      <>
        <div className="flex flex-col w-[82vw] h-screen bg-gradient-to-br from-cyan-500 to-sky-950 ">
          <div className="h-[10vh] flex justify-end bg-sky-900 ">
            <div className="flex relative items-center gap-3 m-4">
              <div className="text-white text-base font-semibold pr-4">
                {this.props.data.name}
              </div>
              <button
                className="btn bg-amber-500 border-none text-xl text-white hover:bg-amber-600"
                onClick={this.connect}
              >
                <MdOutlineUsb />
              </button>
              <button className="btn bg-amber-500 border-none text-xl text-white hover:bg-amber-600">
                <MdOutlineUsbOff />
              </button>
              <button
                className="btn bg-amber-500 border-none text-xl text-white hover:bg-amber-600"
                onClick={this.save}
              >
                <FaSave />
              </button>
            </div>
          </div>
          <div className="h-[9vh] flex flex-row">
            <div className="flex justify-start items-center gap-3 p-4 w-1/2 h-full">
              <button
                className="btn btn-sm justify-center items-center w-fit h-10 rounded-xl bg-yellow-500 font-bold text-sm tracking-wide border-none text-white hover:bg-yellow-600"
                onClick={() =>
                  document.getElementById("modal_new_motion").showModal()
                }
              >
                <FaPlus className="mr-1.2" />
                New Motion
              </button>
              <button className="btn btn-sm w-10 h-10 rounded-xl bg-yellow-500 border-none text-lg text-white hover:bg-yellow-600">
                <FaCirclePlay />
              </button>
              <button className="btn btn-sm w-10 h-10 rounded-xl bg-yellow-500 border-none text-lg text-white hover:bg-yellow-600">
                <FaCircleStop />
              </button>
              <button className="btn btn-sm w-10 h-10 rounded-xl bg-yellow-500 border-none text-lg text-white hover:bg-yellow-600">
                <MdDelete />
              </button>
            </div>
            <div className="flex justify-end items-center px-8 py-2 w-1/2 h-full">
              <div className="flex justify-center items-center gap-3 w-2/5 h-full">
                <button className="btn btn-sm w-10 h-10 font-extrabold text-green-500 border-none text-xl rounded-full bg-slate-50 drop-shadow-md hover:text-green-600 hover:drop-shadow-md hover:bg-slate-50">
                  <FaPowerOff />
                </button>
                <button className="btn btn-sm w-10 h-10 font-extrabold text-red-500 border-none text-xl rounded-full bg-slate-50 drop-shadow-md hover:text-red-600 hover:drop-shadow-md hover:bg-slate-50">
                  <FaPowerOff />
                </button>
              </div>
            </div>
          </div>
          <div className="h-[81vh] flex flex-row justify-between items-center gap-4 mx-4 mb-4 ">
            <div className="flex w-1/2 h-full gap-4">
              <div className="flex flex-col w-7/12 h-full rounded-3xl backdrop-blur-sm bg-sky-200/40 gap-2 px-3 py-5">
                <div className="flex justify-center font-bold">
                  <img
                    src={motionUnit}
                    alt="Motion Unit"
                    className="h-7 mb-2"
                  />
                </div>
                <div className="flex text-center font-semibold tracking-wide text-slate-950  border-none gap-2 px-2">
                  <h3 className="w-2/12 text-sm">No</h3>
                  <h3 className=" grow w-4/12 text-sm">Name</h3>
                  <h3 className="w-3/12 text-sm">Next</h3>
                </div>
                <div className="overflow-y-auto py-1 px-2">
                  {this.state.data.motions.map((motion, index) => (
                    <div key={index} className="flex gap-2 mb-2 ">
                      <h3
                        className={`w-2/12 btn btn-sm h-9 bg-slate-300 border-none text-xs rounded-xl hover:bg-slate-300  ${this.state.activeMotion == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                      >
                        {index}
                      </h3>
                      <button
                        className={`grow w-4/12 btn btn-sm rounded-xl text-xs h-9 ${this.state.activeMotion == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                        onClick={() => this.handlerMotionClick(index)}
                      >
                        {motion.name}
                      </button>
                      <input
                        className={`w-3/12 input input-sm text-center text-xs h-9 bg-slate-50 hover:bg-slate-100 rounded-xl ${this.state.activeMotion == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                        onChange={(event) =>
                          this.handlerChangeNextMotion(
                            event.target.value,
                            index
                          )
                        }
                        value={motion.next}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col w-7/12 h-full gap-4">
                <div className="flex flex-col w-full h-1/2 rounded-3xl backdrop-blur-sm bg-sky-200/40 gap-2 px-3 py-5">
                  <div className="flex justify-center font-bold">
                    <img
                      src={motionStep}
                      alt="Motion Step"
                      className="h-7 mb-2"
                    />
                  </div>
                  <div className="flex text-center font-semibold tracking-wide text-slate-950  border-none gap-2 px-2">
                    <h3 className="w-1/5 text-sm">No</h3>
                    <h3 className="w-2/5 text-sm">Time</h3>
                    <h3 className="w-2/5 text-sm">Pause</h3>
                  </div>
                  <div className="overflow-y-auto py-1 px-2">
                    {this.state.activeMotion != null ? (
                      this.state.data.motions[
                        this.state.activeMotion
                      ].steps.map((step, index) => (
                        <div className="flex mb-2 gap-2" key={index}>
                          <button
                            className={`basis-1/5 btn btn-sm h-9 bg-slate-300 border-none text-xs rounded-xl hover:bg-slate-300  ${this.state.activeStep == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                            onClick={() => this.handlerStepClick(index)}
                          >
                            {index}
                          </button>
                          <input
                            type="number"
                            className={`w-2/5 input input-sm text-center text-xs h-9 bg-slate-50 hover:bg-slate-100 rounded-xl ${this.state.activeStep == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                            onChange={(event) =>
                              this.handlerChangeTime(event.target.value, index)
                            }
                            value={step.time}
                          />
                          <input
                            type="number"
                            className={`w-2/5 input input-sm text-center text-xs h-9 bg-slate-50 hover:bg-slate-100 rounded-xl ${this.state.activeStep == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                            onChange={(event) =>
                              this.handlerChangePause(event.target.value, index)
                            }
                            value={step.pause}
                          />
                        </div>
                      ))
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col w-full h-1/2 rounded-3xl backdrop-blur-sm bg-sky-200/40 gap-2 px-3 py-5">
                  <div className="flex justify-center font-bold">
                    <img
                      src={motionStep}
                      alt="Motion Step"
                      className="h-7 mb-2"
                    />
                  </div>
                  <div className="flex text-center font-semibold tracking-wide text-slate-950  border-none gap-2 px-2">
                    <h3 className="w-1/3 text-sm">No</h3>
                    <h3 className="w-1/3 text-sm">Time</h3>
                    <h3 className="w-1/3 text-sm">Pause</h3>
                  </div>
                  <div className="overflow-y-auto py-1 px-2">
                    <div className="flex mb-2 gap-2">
                      <button className="btn btn-sm h-9 w-full border-none text-xs rounded-xl ">
                        Kanan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center  w-1/12 h-1/2">
                <div className="flex flex-col justify-center items-center w-full h-fit rounded-xl gap-2 backdrop-blur-sm bg-sky-200/40 p-2">
                  <button
                    className="btn btn-sm justify-center items-center w-fit h-10 rounded-xl bg-yellow-500 font-bold text-sm tracking-wide border-none text-white hover:bg-yellow-600"
                    onClick={this.handlerNewStep}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="btn btn-sm justify-center items-center w-fit h-10 rounded-xl bg-yellow-500 font-bold text-sm tracking-wide border-none text-white hover:bg-yellow-600"
                    onClick={this.handlerDeleteStep}
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex w-1/2 h-full gap-2">
              <div className="flex flex-col w-7/12 h-full rounded-3xl backdrop-blur-sm bg-sky-200/40 gap-2 px-3 py-5">
                <div className="flex justify-center font-bold">
                  <img
                    src={poseofStep}
                    alt="Pose of Step"
                    className="h-7 mb-2"
                  />
                </div>
                <div className="flex text-center font-semibold tracking-wide text-slate-950  border-none gap-2 px-2">
                  <h3 className="w-1/5 text-sm">No</h3>
                  <h3 className="w-4/5 text-sm">Value</h3>
                </div>
                <div className="overflow-y-auto py-1 px-2">
                  {this.state.activeStep != null ? (
                    this.state.data.motions[this.state.activeMotion].steps[
                      this.state.activeStep
                    ].value.map((val, index) => (
                      <div className="flex gap-2 mb-2" key={index}>
                        <button
                          className={`basis-1/5 btn btn-sm h-9 bg-slate-300 border-none text-xs rounded-xl hover:bg-slate-300  ${this.state.activeStep == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                          onClick={() => this.handlerIdPoseStepClick(index)}
                        >
                          {this.state.data.servos[index].id}
                        </button>
                        <input
                          type="number"
                          className={`w-4/5 input input-sm text-center text-xs h-9 bg-slate-50 hover:bg-slate-100 rounded-xl ${this.state.activeStep == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                          key={index}
                          onChange={(event) =>
                            this.handlerChangeStepVal(event.target.value, index)
                          }
                          value={val}
                        />
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-around items-center w-1/6 h-full p-2">
                <div className="flex justify-center items-center rounded-xl gap-2">
                  <button
                    className="btn justify-center items-center h-12 w-12 p-0 rounded-xl bg-yellow-500 font-bold text-2xl tracking-wide border-none text-white hover:bg-yellow-600"
                    onClick={this.handlerNewStep}
                  >
                    <FaArrowAltCircleRight />
                  </button>
                </div>
                <div className="flex justify-center items-center rounded-xl gap-2">
                  <button
                    className="btn justify-center items-center h-12 w-12 p-0 rounded-xl bg-yellow-500 font-bold text-2xl tracking-wide border-none text-white hover:bg-yellow-600"
                    onClick={this.handlerDeleteStep}
                  >
                    <FaArrowAltCircleLeft />
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-7/12 h-full rounded-3xl backdrop-blur-sm bg-sky-200/40 gap-2 px-3 py-5">
                <div className="flex justify-center font-bold">
                  <img
                    src={poseofRobot}
                    alt="Pose of Step"
                    className="h-7 mb-2"
                  />
                </div>
                <div className="flex text-center font-semibold tracking-wide text-slate-950  border-none gap-2 px-2">
                  <h3 className="w-1/5 text-sm">No</h3>
                  <h3 className="w-4/5 text-sm">Value</h3>
                </div>
                <div className="overflow-y-auto py-1 px-2">
                  {this.state.activeStep != null ? (
                    this.state.data.motions[this.state.activeMotion].steps[
                      this.state.activeStep
                    ].value.map((val, index) => (
                      <div className="flex gap-2 mb-2" key={index}>
                        <button
                          className={`basis-1/5 btn btn-sm h-9 bg-slate-300 border-none text-xs rounded-xl hover:bg-slate-300  ${this.state.activeStep == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                          onClick={() => this.handlerIdPoseStepClick(index)}
                        >
                          {this.state.data.servos[index].id}
                        </button>
                        <input
                          type="number"
                          className={`w-4/5 input input-sm text-center text-xs h-9 bg-slate-50 hover:bg-slate-100 rounded-xl ${this.state.activeStep == index ? "bg-cyan-600 border-none text-slate-50 hover:bg-cyan-700 hover:border-none" : ""}`}
                          key={index}
                          onChange={(event) =>
                            this.handlerChangeStepVal(event.target.value, index)
                          }
                          value={val}
                        />
                      </div>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <dialog id="modal_new_motion" className="modal">
          <div className="modal-box">
            <h3 className="flex justify-center font-bold text-lg mb-6 ">
              Create New Motion
            </h3>
            <div className="flex">
              <input
                type="text"
                id="input_new_motion"
                className="input input-bordered text-center w-full"
                placeholder=" Input Motion Name"
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn border-2 text-red-500 border-red-500  bg-white hover:text-red-600 hover:border-red-600 hover:bg-white mx-3">
                  Close
                </button>
                <button
                  className="btn text-white bg-amber-500 me-2 hover:bg-amber-600"
                  onClick={this.saveNewMotion}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </dialog>
        <ToastContainer />
      </>
    );
  }
}
