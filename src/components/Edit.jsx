import { ref, uploadString } from "firebase/storage"
import { Component, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { storage } from "../firebase"


export default class Edit extends Component {

    constructor(props){
        super(props)

        this.state = {
            data: props.data.data,
            activeMotion: null,
            activeStep: null,
        }
        this.saveNewMotion = this.saveNewMotion.bind(this)
        this.save = this.save.bind(this)
        this.handlerNewStep = this.handlerNewStep.bind(this)
        this.handlerDeleteStep = this.handlerDeleteStep.bind(this)
        this.handlerChangeTime = this.handlerChangeTime.bind(this)
        this.handlerChangePause = this.handlerChangePause.bind(this)
        this.handlerChangeStepVal = this.handlerChangeStepVal.bind(this)
    }
    

    saveNewMotion() {
        const name = document.getElementById('input_new_motion')

        this.state.data.motions.push({
            name: name.value,
            steps: [],
            next: 0
        })
        this.setState({
            data: this.state.data
        })

        name.value = ""
    }

    handlerMotionClick(index) {
        this.setState({
            activeMotion: index,
            activeStep: null,
        })
    }

    handlerNewStep(){
        if(this.state.activeMotion == null){
            toast('Select motion first')
            return
        }

        const tempValue = []
        this.state.data.servos.forEach(servo => {
            tempValue.push(servo.servo == 'XL-320' ? 512 : 2048)
        });

        this.state.data.motions[this.state.activeMotion].steps.push(
            {
                time: 1000,
                pause: 1000,
                value: tempValue
            }
        )

        this.setState({
            data: this.state.data
        })

    }

    handlerStepClick(index) {
        this.setState({
            activeStep: index
        })
    }

    handlerDeleteStep(){
        if(this.state.activeStep == null){
            toast('Select step first')
            return
        }

        this.state.data.motions[this.state.activeMotion].steps.splice(this.state.activeStep, 1)

        this.setState({
            activeStep: null,
            data: this.state.data,
        })

    }

    handlerChangeTime(value, index){
        this.state.data.motions[this.state.activeMotion].steps[index].time = value
        this.setState({
            data: this.state.data
        })
    }

    handlerChangePause(value, index){
        this.state.data.motions[this.state.activeMotion].steps[index].pause = value
        this.setState({
            data: this.state.data
        })
    }

    handlerChangeStepVal(value, index){
        this.state.data.motions[this.state.activeMotion].steps[this.state.activeStep].value[index] = value
        this.setState({
            data: this.state.data
        })
    }

    save() {
        const dataRef = ref(storage, this.props.data.name)
        uploadString(dataRef, JSON.stringify(this.state.data)).then(() => toast('Data saved'))
    }

    render() {
        return (
            <>
                <div className="flex flex-col">
                    <div className="border-2 border-black h-[8vh] p-2 flex justify-between items-center">
                        <div className="font-bold italic text-xl">Azzahraly Motion</div>
                        <div className="flex items-center gap-2">
                            <div className="text-black">{this.props.data.name}</div>
                            <button className="btn">connect</button>
                            <button className="btn" onClick={this.save}>save</button>
                        </div>
                    </div>
                    <div className="border-2 p-2 border-black h-[8vh] flex items-center justify-between">
                        <div className="flex gap-2">
                            <button className="btn" onClick={() => document.getElementById('modal_new_motion').showModal()}>New Motion</button>
                            <button className="btn">Play</button>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn">ON</button>
                            <button className="btn">OFF</button>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="w-[23vw] h-[84vh] border-2 border-black flex flex-col p-2 gap-2">
                            <div className="flex justify-center p-2 font-bold">MOTION</div>
                            {
                                this.state.data.motions.map((motion, index) => (
                                    <button key={index} className={`btn  w-full ${this.state.activeMotion == index ? 'bg-blue-400 hover:bg-blue-500' : ''}`} onClick={()=>this.handlerMotionClick(index)}>{motion.name}</button>
                                ))
                            }
                        </div>
                        <div className="w-[23vw] h-[84vh] border-2 border-black flex flex-col p-2 gap-2">
                            <div className="flex justify-center p-2 font-bold">STEP</div>
                            <div className="flex gap-2 justify-center">
                                <button className="btn" onClick={this.handlerNewStep}>New</button>
                                <button className="btn" onClick={this.handlerDeleteStep}>Delete</button>
                            </div>
                            {
                                this.state.activeMotion != null ? 
                                    this.state.data.motions[this.state.activeMotion].steps.map((step, index) => (
                                        <div className="flex gap-2" key={index}>
                                            <button className={`btn ${this.state.activeStep == index ? 'bg-blue-400 hover:bg-blue-500' : ''}`} onClick={() => this.handlerStepClick(index)}>{index}</button>
                                            <input type="number" className="input input-bordered w-full" onChange={(event) => this.handlerChangeTime(event.target.value, index)} value={step.time}/>
                                            <input type="number" className="input input-bordered w-full" onChange={(event) => this.handlerChangePause(event.target.value, index)} value={step.pause}/>
                                        </div>
                                    ))
                                :
                                (<div></div>)   
                            }
                        </div>
                        <div className="w-[23vw] h-[84vh] border-2 border-black flex flex-col gap-2 p-2">
                            <div className="flex justify-center p-2 font-bold">POSE OF STEP</div>
                            {
                                this.state.activeStep != null ?
                                this.state.data.motions[this.state.activeMotion].steps[this.state.activeStep].value.map((val, index) => (
                                    <div className="flex gap-2" key={index}>
                                        <button className="btn">{this.state.data.servos[index].id}</button>
                                        <input type="number" className="input input-bordered" value={val} key={index} onChange={(event) => this.handlerChangeStepVal(event.target.value, index)} />
                                    </div>
                                ))
                                :
                                <div></div>
                            }
                        </div>
                        <div className="w-[23vw] h-[84vh] border-2 border-black"></div>
                    </div>
                </div>
                <dialog id="modal_new_motion" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Motion Name</h3>
                        <div className="flex">
                            <input type="text" id="input_new_motion" className="input input-bordered w-full" placeholder="Place name here" />
                        </div>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn me-2" onClick={this.saveNewMotion}>Save</button>
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            <ToastContainer/>

            </>
        )
    }

}
