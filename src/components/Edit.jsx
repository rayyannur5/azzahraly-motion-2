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
import {
  MdOutlineUsb,
  MdOutlineUsbOff,
  MdDelete,
  MdEdit,
  MdLogout,
  MdChecklist,
} from "react-icons/md";
import { FaCirclePlay, FaCircleStop } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import motionUnit from "../assets/motionunit.png";
import motionStep from "../assets/motionstep.png";
import motionGroup from "../assets/motiongroup.png";
import poseofStep from "../assets/poseofstep.png";
import poseofRobot from "../assets/poseofrobot.png";
import Serial from "../Serial";
import { BsArrowLeftCircle } from "react-icons/bs";

export default class Edit extends Component {
  serial = new Serial();
  stopMotion = false;
  activeTab = "";

  constructor(props) {
    super(props);

    this.state = {
      data: props.data.data,
      activeMotion: null,
      activeStep: null,
      activeIdGroup: null,
      poseRobot: Array(),
      connected: false,
    };
    this.saveNewMotion = this.saveNewMotion.bind(this);
    this.saveEditMotion = this.saveEditMotion.bind(this);
    this.handlerDeleteMotion = this.handlerDeleteMotion.bind(this);
    this.handlerChangeNextMotion = this.handlerChangeNextMotion.bind(this);
    this.saveIdGroup = this.saveIdGroup.bind(this);
    this.deleteIdGroup = this.deleteIdGroup.bind(this);
    this.save = this.save.bind(this);
    this.handlerNewStep = this.handlerNewStep.bind(this);
    this.handlerDeleteStep = this.handlerDeleteStep.bind(this);
    this.handlerChangeTime = this.handlerChangeTime.bind(this);
    this.handlerChangePause = this.handlerChangePause.bind(this);
    this.handlerChangeStepVal = this.handlerChangeStepVal.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.selectServo = this.selectServo.bind(this);
    this.off = this.off.bind(this);
    this.on = this.on.bind(this);
    this.sleep = this.sleep.bind(this);
    this.sendCommand = this.sendCommand.bind(this);
    this.sendPose = this.sendPose.bind(this);
    this.getPose = this.getPose.bind(this);
    this.play = this.play.bind(this);
    this.generate = this.generate.bind(this);
    this.importMotion = this.importMotion.bind(this);
    this.handlerImportMotion = this.handlerImportMotion.bind(this);
    this.buttonImportMotion = this.buttonImportMotion.bind(this);

    window.addEventListener("keydown", (event) => {
      /*Allows for a case-insensitive shortcut*/
      if (event.ctrlKey && (event.key === "S" || event.key === "s")) {
        event.preventDefault();
        this.save();
      } else if (event.ctrlKey && (event.key === "C" || event.key === "c")) {
        event.preventDefault();
        if (this.activeTab == "motion") {
          const temp = JSON.stringify(
            this.state.data.motions[this.state.activeMotion],
          );
          navigator.clipboard.writeText(temp);
        } else if (this.activeTab == "step") {
          const temp = JSON.stringify(
            this.state.data.motions[this.state.activeMotion].steps[
              this.state.activeStep
            ],
          );
          navigator.clipboard.writeText(temp);
        }
      } else if (event.ctrlKey && (event.key === "V" || event.key === "v")) {
        navigator.clipboard.readText().then((res) => {
          try {
            const dataClipboard = JSON.parse(res);
            console.log(dataClipboard);
            if (this.activeTab == "motion") {
              this.state.data.motions.push(dataClipboard);
              this.setState({
                data: this.state.data,
              });
            } else if (this.activeTab == "step") {
              this.state.data.motions[this.state.activeMotion].steps.push(
                dataClipboard,
              );
              this.setState({
                data: this.state.data,
              });
            }
          } catch (error) {
            toast(error);
          }
        });
      }
    });
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

  saveEditMotion() {
    const name = document.getElementById("input_edit_motion");

    this.state.data.motions[this.state.activeMotion].name = name.value;
    this.setState({
      data: this.state.data,
    });
  }

  saveIdGroup() {
    const list_servo = document.getElementsByName("checkbox_motion_group");
    const name = document.getElementById("input_name_motion_group");
    let list_checked_servo = Array();

    if (name.value == "") {
      toast("name is required");
      return;
    }

    list_servo.forEach((event) => {
      if (event.checked) {
        list_checked_servo.push(event.value);
      }
    });

    this.state.data.idGroups.push({
      name: name.value,
      ids: list_checked_servo,
    });

    name.value = "";

    list_servo.forEach((event) => {
      event.checked = false;
    });

    this.setState({
      data: this.state.data,
    });
  }

  selectIdGroup(index) {
    if (this.state.poseRobot.length == 0) {
      toast("Connect to robot first");
      return;
    }
    this.state.poseRobot.forEach((servo) => {
      servo.selected = false;
      this.state.data.idGroups[index].ids.forEach((id) => {
        if (servo.id == id) {
          servo.selected = true;
        }
      });
    });

    this.setState({
      activeIdGroup: index,
      poseRobot: this.state.poseRobot,
    });
  }

  deleteIdGroup() {
    if (this.state.activeIdGroup == null) {
      toast("Select motion group first");
      return;
    }

    this.state.data.idGroups.splice(this.state.activeIdGroup, 1);

    this.setState({
      activeIdGroup: null,
      data: this.state.data,
    });
  }

  handlerMotionClick(index) {
    this.activeTab = "motion";
    this.setState({
      activeMotion: index,
      activeStep: null,
    });
  }

  handlerDeleteMotion() {
    if (this.state.activeMotion == null) {
      toast("Select motion first");
      return;
    }

    this.state.data.motions.splice(this.state.activeMotion, 1);

    this.setState({
      activeStep: null,
      activeMotion: null,
      data: this.state.data,
    });
  }

  handlerChangeNextMotion(val, index) {
    this.state.data.motions[index].next = val;
    this.setState({
      data: this.state.data,
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
      pause: 0,
      value: tempValue,
    });

    this.setState({
      data: this.state.data,
    });
  }

  handlerStepClick(index) {
    this.activeTab = "step";
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
      1,
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
      toast("Data saved"),
    );
  }

  connect = () => {
    let start = false;
    let message = "";

    if (!this.serial.supported()) {
      //setNoSupportOpen(true)
      console.error(`Serial not supported`);
      return;
    }

    this.serial.onSuccess = () => {
      this.serial.send("aaaa*c#");
    };

    this.serial.onFail = () => {
      this.setState({
        connected: false,
        poseRobot: [],
      });
    };

    this.serial.onReceive = (value) => {
      if (value.startsWith("*")) {
        start = true;
      }
      if (start) {
        message = message + value;
      }
      if (value.endsWith("#")) {
        start = false;
        message = message.substring(1, message.length - 1);
        console.log(message);
        if (message == "OK") {
          if (this.state.data.motions[this.state.activeMotion].next != 0) {
            const next = this.state.data.motions[this.state.activeMotion].next;
            this.setState({
              activeMotion: next,
            });
            if (this.stopMotion) {
              this.play();
            }
          }
        } else {
          const received_data = JSON.parse(message);
          if (received_data.type == "c") {
            this.state.connected = true;

            received_data.servos.forEach((servo) => {
              servo.selected = false;
            });

            this.setState({
              connected: true,
              poseRobot: received_data.servos,
            });
          } else if (received_data.type == "r") {
            this.state.poseRobot.forEach((servo) => {
              if (servo.selected) {
                var foundarray = received_data.servos.filter(
                  (e) => e.id == servo.id,
                );
                servo.state = foundarray[0].state;
                servo.value = foundarray[0].value;
              }
            });

            this.setState({
              poseRobot: this.state.poseRobot,
            });
          }
          console.log(received_data);
        }
        message = "";
      }
    };

    this.serial.requestPort().then((res) => {
      if (res !== "") {
        toast(res);
      }
    });
  };

  disconnect() {
    this.setState({
      connected: false,
      poseRobot: [],
    });
    this.serial.close();
  }

  selectServo(index) {
    this.state.poseRobot[index].selected =
      !this.state.poseRobot[index].selected;
    this.setState({
      poseRobot: this.state.poseRobot,
    });
  }

  off() {
    let send = "F";
    this.state.poseRobot.forEach((servo) => {
      if (servo.selected) {
        send = send + servo.id + ",";
      }
    });
    this.sendCommand(send);
  }

  on() {
    this.sendCommand("r");
  }

  sendPose() {
    let send = "p";
    this.state.data.motions[this.state.activeMotion].steps[
      this.state.activeStep
    ].value.forEach((val, index) => {
      send = send + val + ",";
      this.state.poseRobot[index].value = val;
      this.state.poseRobot[index].state = true;
    });
    this.setState({
      poseRobot: this.state.poseRobot,
    });
    this.sendCommand(send);
  }

  getPose() {
    if (this.state.activeMotion == null) {
      toast("Select motion first");
      return;
    }
    if (this.state.activeStep == null) {
      toast("Select step first");
      return;
    }
    this.state.data.motions[this.state.activeMotion].steps[
      this.state.activeStep
    ].value.forEach((val, index) => {
      this.state.data.motions[this.state.activeMotion].steps[
        this.state.activeStep
      ].value[index] = this.state.poseRobot[index].value;
    });
    this.setState({
      data: this.state.data,
    });
  }

  play() {
    if (this.state.activeMotion == null) {
      toast("Select motion first");
      return;
    }

    this.stopMotion = true;

    let send = "Y";
    this.state.data.motions[this.state.activeMotion].steps.forEach((step) => {
      step.value.forEach((val) => {
        send += val + ",";
      });
      send += step.time + ",";
      send += step.pause + ",";
      send += ":";
    });
    this.sendCommand(send);
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async sendCommand(command) {
    // let command = document.getElementById("command").value;
    await this.serial.send("aaaa*");
    for (let i = 0; i < Math.ceil(command.length / 50); i++) {
      const element = command.substr(i * 50, 50);
      await this.serial.send(element);
      await this.sleep(100);
    }
    await this.serial.send("#");
    // await writer.write("aaaaa*" + command + "#");
  }

  generate() {
    if (this.state.activeMotion == null) {
      toast("Select motion first");
      return;
    }
    const dataMotion = this.state.data.motions[this.state.activeMotion];
    let function_name = dataMotion.name.replaceAll(" ", "");
    let result = `void ${function_name} () {\n\tdigitalWrite(BL, HIGH);\n`;
    dataMotion.steps.forEach((step, index) => {
      result += `\t// STEP ${index}\n\tsetBase(`;
      step.value.forEach((val, indexStep) => {
        result += `${val}${step.value.length - 1 == indexStep ? "" : ","}`;
      });
      result += ");\n";
      result += `\tMotionPagePlay(base, ${step.time}, ${step.pause}, 0, 0);\n`;
      if (index == 0) {
        result += "\tdigitalWrite(BL, LOW);\n";
      }
    });
    result += "}";
    navigator.clipboard.writeText(result).then(() => {
      toast("Motion copied!");
    });
  }

  importMotion(data) {
    data = data.replaceAll("\t", "");
    let data_split = data.split(" ");
    let data_enter = data.split("\n");
    data = data.replaceAll("\n", "");

    let result = {
      name: data_split[1],
      steps: Array(),
      next: 0,
    };

    data_enter.forEach((val) => {
      const posVal = val.search("setBase");
      if (posVal != -1) {
        const step_val = val.substring(8, val.length - 2);
        const step_val_split = step_val.split(",");
        result.steps.push({
          value: step_val_split,
          time: 0,
          pause: 0,
        });
      }
      const posTime = val.search("MotionPagePlay");
      if (posTime != -1) {
        const time_str = val.substring(15, val.length - 2);
        const time_split = time_str.split(",");
        result.steps[result.steps.length - 1].time = Number(time_split[1]);
        result.steps[result.steps.length - 1].pause = Number(time_split[2]);
      }
    });

    return result;
  }

  handlerImportMotion(event) {
    let data = event.target.value;

    const result = this.importMotion(data);

    let elementHtml = `
      <div class="flex flex-col p-2">
        <div>Name : ${result.name}</div>
      `;
    result.steps.forEach((step, index) => {
      elementHtml += `<div class="flex"> step ${index} : ${step.value.map((val) => val)} [time : ${step.time}] [pause : ${step.pause}]</div>`;
    });

    elementHtml += `</div>`;

    const element = (document.getElementById(
      "import_motion_temporary",
    ).innerHTML = elementHtml);
  }

  buttonImportMotion() {
    const data = document.getElementById("textarea_import_motion").value;
    const result = this.importMotion(data);
    this.state.data.motions.push(result);
    this.setState({
      data: this.state.data,
    });
  }

  render() {
    return (
      <>
        <div className="flex h-screen flex-col bg-gradient-to-br from-cyan-500 to-sky-950 ">
          <div className="flex h-[10vh] justify-end bg-sky-900 ">
            <div className="relative m-4 flex items-center gap-3">
              <div className="pr-4 text-base font-semibold text-white">
                {this.props.data.name}
              </div>
              <button
                className="btn border-none bg-amber-500 text-xl text-white hover:bg-amber-600"
                onClick={this.state.connected ? this.disconnect : this.connect}
              >
                {this.state.connected ? <MdOutlineUsb /> : <MdOutlineUsbOff />}
              </button>
              <button
                className="btn border-none bg-amber-500 text-xl text-white hover:bg-amber-600"
                onClick={this.save}
              >
                <FaSave />
              </button>
            </div>
          </div>
          <div className="flex h-[9vh] flex-row justify-between">
            <div className="flex h-full items-center justify-start gap-3 p-4">
              <button
                className="btn btn-sm h-10 w-fit items-center justify-center rounded-xl border-none bg-yellow-500 text-sm font-bold tracking-wide text-white hover:bg-yellow-600"
                onClick={() =>
                  document.getElementById("modal_new_motion").showModal()
                }
              >
                <FaPlus className="mr-1.2" />
                New Motion
              </button>
              <button
                className="btn btn-sm h-10 w-fit items-center justify-center rounded-xl border-none bg-yellow-500 text-sm font-bold tracking-wide text-white hover:bg-yellow-600"
                onClick={() =>
                  document.getElementById("modal_import_motion").showModal()
                }
              >
                <FaPlus className="mr-1.2" />
                Import Motion
              </button>
              <button
                className="btn btn-sm h-10 w-10 rounded-xl border-none bg-yellow-500 text-lg text-white hover:bg-yellow-600"
                onClick={this.play}
              >
                <FaCirclePlay />
              </button>
              <button
                className="btn btn-sm h-10 w-10 rounded-xl border-none bg-yellow-500 text-lg text-white hover:bg-yellow-600"
                onClick={() => (this.stopMotion = false)}
              >
                <FaCircleStop />
              </button>
              <button
                className="btn btn-sm h-10 w-10 rounded-xl border-none bg-yellow-500 text-lg text-white hover:bg-yellow-600"
                onClick={this.handlerDeleteMotion}
              >
                <MdDelete />
              </button>
              <button
                className="btn btn-sm h-10 w-10 rounded-xl border-none bg-yellow-500 text-lg text-white hover:bg-yellow-600"
                onClick={() =>
                  this.state.activeMotion != null
                    ? document.getElementById("modal_edit_motion").showModal()
                    : toast("Select motion first")
                }
              >
                <MdEdit />
              </button>
              <button
                className="btn btn-sm h-10 w-10 rounded-xl border-none bg-yellow-500 text-lg text-white hover:bg-yellow-600"
                onClick={this.generate}
              >
                <MdLogout />
              </button>
            </div>
            <div className="flex h-full w-[19vw] items-center justify-center px-8 py-2">
              <div className="flex h-full items-center justify-center gap-3">
                <button
                  className="btn btn-sm h-10 w-10 rounded-full border-none bg-slate-50 text-xl font-extrabold text-green-500 drop-shadow-md hover:bg-slate-50 hover:text-green-600 hover:drop-shadow-md"
                  onClick={this.on}
                >
                  <FaPowerOff />
                </button>
                <button
                  className="btn btn-sm h-10 w-10 rounded-full border-none bg-slate-50 text-xl font-extrabold text-red-500 drop-shadow-md hover:bg-slate-50 hover:text-red-600 hover:drop-shadow-md"
                  onClick={this.off}
                >
                  <FaPowerOff />
                </button>
              </div>
            </div>
          </div>
          <div className="mx-4 mb-4 flex h-[81vh] flex-row items-center justify-between gap-4 ">
            <div className="flex h-full w-1/2 gap-4">
              <div className="flex h-full w-7/12 flex-col gap-2 rounded-3xl bg-sky-200/40 px-3 py-5 backdrop-blur-sm">
                <div className="flex justify-center font-bold">
                  <img
                    src={motionUnit}
                    alt="Motion Unit"
                    className="mb-2 h-7"
                  />
                </div>
                <div className="flex gap-2 border-none px-2 text-center font-semibold text-slate-950">
                  <h3 className="w-2/12 text-base font-bold">No</h3>
                  <h3 className=" w-4/12 grow text-base font-bold">Name</h3>
                  <h3 className="w-3/12 text-base font-bold">Next</h3>
                </div>
                <div className="overflow-y-auto px-2 py-1">
                  {this.state.data.motions.map((motion, index) => (
                    <div key={index} className="mb-2 flex gap-2 ">
                      <h3
                        className={`btn btn-sm h-9 w-2/12 rounded-xl border-none   ${this.state.activeMotion == index ? "border-none bg-cyan-600 text-slate-50 hover:border-none hover:bg-cyan-700" : "bg-slate-300 hover:bg-slate-300"}`}
                        onClick={() => this.handlerMotionClick(index)}
                      >
                        {index}
                      </h3>
                      <button
                        className={`btn btn-sm h-9 w-4/12 grow rounded-xl border-none ${this.state.activeMotion == index ? "border-none bg-cyan-600 text-slate-50 hover:border-none hover:bg-cyan-700  " : "border-none bg-slate-50 text-slate-950 hover:bg-slate-100"}`}
                        onClick={() => this.handlerMotionClick(index)}
                      >
                        {motion.name}
                      </button>
                      <input
                        className={`input input-sm h-9 w-3/12 rounded-xl ${this.state.activeMotion == index ? "border-none bg-cyan-600 text-center font-medium  text-slate-50 hover:border-none hover:bg-cyan-700 " : "bg-slate-50 text-center font-medium text-slate-950  hover:bg-slate-100"}`}
                        type="number"
                        onChange={(event) =>
                          this.handlerChangeNextMotion(
                            event.target.value,
                            index,
                          )
                        }
                        value={motion.next}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex h-full w-7/12 flex-col gap-4">
                <div className="flex h-[39vh] w-full flex-col gap-2 rounded-3xl bg-sky-200/40 px-3 py-5 backdrop-blur-sm">
                  <div className="flex justify-center font-bold">
                    <img
                      src={motionStep}
                      alt="Motion Step"
                      className="mb-2 h-7"
                    />
                  </div>
                  <div className="flex gap-2 border-none px-2 text-center  font-semibold text-slate-950">
                    <h3 className="w-1/5 text-base font-bold">No</h3>
                    <h3 className="w-2/5 text-base font-bold">Time</h3>
                    <h3 className="w-2/5 text-base font-bold">Pause</h3>
                  </div>
                  <div className=" transparent-scrollbar overflow-y-auto px-2 py-1">
                    {this.state.activeMotion != null ? (
                      this.state.data.motions[
                        this.state.activeMotion
                      ].steps.map((step, index) => (
                        <div className="mb-2 flex gap-2" key={index}>
                          <button
                            className={`btn btn-sm h-9 basis-1/5 rounded-xl   ${this.state.activeStep == index ? "border-none bg-cyan-600 text-slate-50 hover:border-none hover:bg-cyan-700" : "border-none bg-slate-300 hover:bg-slate-300"}`}
                            onClick={() => this.handlerStepClick(index)}
                          >
                            {index}
                          </button>
                          <input
                            type="number"
                            className={`input input-sm h-9 w-2/5 rounded-xl  ${this.state.activeStep == index ? "border-none bg-cyan-600 text-center text-slate-50 hover:border-none hover:bg-cyan-700" : "bg-slate-50 text-center text-slate-950  hover:bg-slate-100"}`}
                            onChange={(event) =>
                              this.handlerChangeTime(event.target.value, index)
                            }
                            value={step.time}
                          />
                          <input
                            type="number"
                            className={`input input-sm h-9 w-2/5 rounded-xl  ${this.state.activeStep == index ? "border-none bg-cyan-600 text-center text-slate-50 hover:border-none hover:bg-cyan-700" : "bg-slate-50 text-center text-slate-950  hover:bg-slate-100"}`}
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
                <div className="flex h-[39vh] w-full flex-col gap-2 rounded-3xl bg-sky-200/40 px-3 py-5 backdrop-blur-sm">
                  <div className="flex justify-center font-bold">
                    <img
                      src={motionGroup}
                      alt="Motion Group"
                      className="mb-2 h-7"
                    />
                  </div>
                  <div className=" transparent-scrollbar overflow-auto px-2 py-1">
                    <div className="mb-2 flex flex-col gap-2">
                      {this.state.data.idGroups.map((group, index) => (
                        <button
                          key={index}
                          className={`btn btn-sm h-9 w-full rounded-xl border-none ${this.state.activeIdGroup == index ? "border-none bg-cyan-600 text-slate-50 hover:border-none hover:bg-cyan-700  " : "border-none bg-slate-50 text-slate-950 hover:bg-slate-100"}`}
                          onClick={() => this.selectIdGroup(index)}
                        >
                          {group.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex h-full w-1/12 flex-col  items-center justify-around">
                <div className="flex h-fit w-full flex-col items-center justify-center gap-2 rounded-xl bg-sky-200/40 p-2 backdrop-blur-sm">
                  <button
                    className="btn btn-sm h-10 w-fit items-center justify-center rounded-xl border-none bg-yellow-500 text-sm font-bold tracking-wide text-white hover:bg-yellow-600"
                    onClick={this.handlerNewStep}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="btn btn-sm h-10 w-fit items-center justify-center rounded-xl border-none bg-yellow-500 text-sm font-bold tracking-wide text-white hover:bg-yellow-600"
                    onClick={this.handlerDeleteStep}
                  >
                    <FaMinus />
                  </button>
                </div>
                <div className="flex h-fit w-full flex-col items-center justify-center gap-2 rounded-xl bg-sky-200/40 p-2 backdrop-blur-sm">
                  <button
                    className="btn btn-sm h-10 w-fit items-center justify-center rounded-xl border-none bg-yellow-500 text-sm font-bold tracking-wide text-white hover:bg-yellow-600"
                    onClick={() => {
                      document
                        .getElementById("modal_add_motion_group")
                        .showModal();
                    }}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="btn btn-sm h-10 w-fit items-center justify-center rounded-xl border-none bg-yellow-500 text-sm font-bold tracking-wide text-white hover:bg-yellow-600"
                    onClick={this.deleteIdGroup}
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex h-full w-1/2 gap-2">
              <div className="flex h-full w-7/12 flex-col gap-2 rounded-3xl bg-sky-200/40 px-3 py-5 backdrop-blur-sm">
                <div className="flex justify-center font-bold">
                  <img
                    src={poseofStep}
                    alt="Pose of Step"
                    className="mb-2 h-7"
                  />
                </div>
                <div className="flex gap-2 border-none px-2 text-center  font-semibold tracking-wide text-slate-950">
                  <h3 className="w-1/5 text-base font-bold">No</h3>
                  <h3 className="w-4/5 text-base font-bold">Value</h3>
                </div>
                <div className="transparent-scrollbar h-[62vh] overflow-y-auto px-2 py-1">
                  {this.state.activeStep != null ? (
                    this.state.data.motions[this.state.activeMotion].steps[
                      this.state.activeStep
                    ].value.map((val, index) => (
                      <div className="mb-2 flex gap-2" key={index}>
                        <button
                          className={`btn btn-sm h-9 basis-1/5 rounded-xl border-none bg-slate-300 hover:bg-slate-300 `}
                          onClick={() => this.handlerIdPoseStepClick(index)}
                        >
                          {this.state.data.servos[index].id}
                        </button>
                        <input
                          type="number"
                          className={`input input-sm h-9 w-4/5 rounded-xl bg-slate-50 text-center text-slate-950 hover:bg-slate-100`}
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
              <div className="flex h-full w-1/6 flex-col items-center justify-around p-2">
                <div className="flex items-center justify-center gap-2 rounded-xl">
                  <button
                    className="btn h-12 w-12 items-center justify-center rounded-xl border-none bg-yellow-500 p-0 text-2xl font-bold tracking-wide text-white hover:bg-yellow-600"
                    onClick={this.sendPose}
                  >
                    <FaArrowAltCircleRight />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl">
                  <button
                    className="btn h-12 w-12 items-center justify-center rounded-xl border-none bg-yellow-500 p-0 text-2xl font-bold tracking-wide text-white hover:bg-yellow-600"
                    onClick={this.getPose}
                  >
                    <FaArrowAltCircleLeft />
                  </button>
                </div>
              </div>
              <div className="flex h-full w-7/12 flex-col gap-2 rounded-3xl bg-sky-200/40 px-3 py-5 backdrop-blur-sm">
                <div className="flex justify-center font-bold">
                  <img
                    src={poseofRobot}
                    alt="Pose of Robot"
                    className="mb-2 h-7"
                  />
                </div>
                <div className="flex gap-2 border-none px-2 text-center  font-semibold tracking-wide text-slate-950">
                  <h3 className="w-1/5 text-base font-bold">No</h3>
                  <h3 className="w-4/5 text-base font-bold">Value</h3>
                </div>
                <div className="transparent-scrollbar h-[62vh] overflow-y-auto px-2 py-1">
                  {this.state.connected ? (
                    this.state.poseRobot.map((val, index) => (
                      <div className="mb-2 flex gap-2" key={index}>
                        <button
                          className={`btn btn-sm h-9 basis-1/5 rounded-xl border-none ${val.selected ? "bg-cyan-600 text-slate-50 hover:bg-cyan-600" : "bg-slate-300 hover:bg-slate-300"} `}
                          onClick={() => this.selectServo(index)}
                        >
                          {val.id}
                        </button>
                        <button
                          type="number"
                          className={`input input-sm flex h-9 w-4/5 items-center justify-center rounded-xl text-center text-slate-950 ${val.selected ? "bg-cyan-600 text-slate-50 hover:bg-cyan-600" : "bg-slate-50 hover:bg-slate-100"}`}
                          key={index}
                          onClick={() => this.selectServo(index)}
                        >
                          {val.state == 1 ? val.value : "OFF"}
                        </button>
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
            <h3 className="mb-6 flex justify-center text-lg font-bold ">
              Create New Motion
            </h3>
            <div className="flex">
              <input
                type="text"
                id="input_new_motion"
                className="input input-bordered w-full text-center"
                placeholder=" Input Motion Name"
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn mx-3 border-2 border-red-500  bg-white text-red-500 hover:border-red-600 hover:bg-white hover:text-red-600">
                  Close
                </button>
                <button
                  className="btn me-2 bg-amber-500 text-white hover:bg-amber-600"
                  onClick={this.saveNewMotion}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </dialog>

        <dialog id="modal_edit_motion" className="modal">
          <div className="modal-box">
            <h3 className="mb-6 flex justify-center text-lg font-bold ">
              Change Motion Name
            </h3>
            <div className="flex">
              <input
                type="text"
                id="input_edit_motion"
                className="input input-bordered w-full text-center"
                placeholder=" Input Motion Name"
                defaultValue={
                  this.state.activeMotion != null
                    ? this.state.data.motions[this.state.activeMotion].name
                    : ""
                }
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn mx-3 border-2 border-red-500  bg-white text-red-500 hover:border-red-600 hover:bg-white hover:text-red-600">
                  Close
                </button>
                <button
                  className="btn me-2 bg-amber-500 text-white hover:bg-amber-600"
                  onClick={this.saveEditMotion}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="modal_add_motion_group" className="modal">
          <div className="modal-box">
            <h3 className="mb-6 flex justify-center text-lg font-bold ">
              Add Motion Group
            </h3>
            <div className="flex flex-col">
              <input
                type="text"
                id="input_name_motion_group"
                className="input input-bordered w-full text-center"
                placeholder=" Input Motion Group Name"
              />

              <div className="my-2 h-[30vh] overflow-auto">
                {this.state.data.servos.map((servo) => (
                  <div className="form-control" key={servo.id}>
                    <label className="label cursor-pointer">
                      <span className="label-text">{servo.id}</span>
                      <input
                        type="checkbox"
                        value={servo.id}
                        className="checkbox"
                        name="checkbox_motion_group"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn mx-3 border-2 border-red-500  bg-white text-red-500 hover:border-red-600 hover:bg-white hover:text-red-600">
                  Close
                </button>
                <button
                  className="btn me-2 bg-amber-500 text-white hover:bg-amber-600"
                  onClick={this.saveIdGroup}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </dialog>
        <dialog id="modal_import_motion" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="mb-6 flex justify-center text-lg font-bold ">
              Import Motion
            </h3>
            <div className="flex flex-col">
              <textarea
                id="textarea_import_motion"
                className="textarea textarea-bordered"
                placeholder="Paste here"
                onChange={this.handlerImportMotion}
              ></textarea>
              <div id="import_motion_temporary"></div>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn mx-3 border-2 border-red-500  bg-white text-red-500 hover:border-red-600 hover:bg-white hover:text-red-600">
                  Close
                </button>
                <button
                  className="btn me-2 bg-amber-500 text-white hover:bg-amber-600"
                  onClick={this.buttonImportMotion}
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
}
