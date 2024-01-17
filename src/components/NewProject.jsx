import { useState } from "react"

export default function NewProject({handleCloseButton}) {

    const [servos, setServos] = useState(Array())

    function handleJumlahServo(event){
        let length = event.target.value
        if(length == '') length = 0
        const array = new Array(parseInt(length)).fill({
            id: null,
            servo: 'XL-320',
        })
        setServos(array)
    }

    function handleChangeServo(index, value){
        const temp = [...servos]
        const objTemp = temp[index]
        temp[index] = {
            id: objTemp.id,
            servo: value,
        }
        setServos(temp)
    }

    function handleChangeId(index, value){
        const temp = [...servos]
        const objTemp = temp[index]
        temp[index] = {
            id: value,
            servo: objTemp.servo,
        }
        setServos(temp)
    }
    
    return (
        <>
            <div className="flex flex-col w-[92vw]">
                <div className="h-[5vh] p-3 border flex justify-between">
                    <div>New Project</div>
                    <button onClick={handleCloseButton}>Close</button>
                </div>
                <div className="flex flex-col">
                    <div className=" border flex flex-row">
                        <input type="text" className="p-4 border rounded m-2" placeholder="Nama Project" />
                        <input type="number" className="p-4 border rounded m-2" placeholder="Jumlah Servo" onChange={handleJumlahServo}/>
                        <button className="p-4 m-2 border bg-slate-200 hover:bg-slate-400" onc>Save Project</button>
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
                                {
                                    servos.map( (servo, index) => (
                                        <tr key={index}>
                                            <td className="border-b p-2">{index + 1}</td>
                                            <td className="border-b p-2">
                                                <select className="border p-2 rounded" onChange={(event) => handleChangeServo(index, event.target.value)} value={servo.servo}>
                                                    <option value="XL-320">XL-320</option>
                                                    <option value="MX-28">MX-28</option>
                                                </select>
                                            </td>
                                            <td className="border-b p-2">
                                                <input type="number" className="p-2 border rounded" placeholder="id Servo" onChange={(event) => handleChangeId(index, event.target.value)}/>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}