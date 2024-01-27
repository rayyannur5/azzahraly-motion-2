import { listAll, ref } from "firebase/storage"
import { storage } from "../firebase"
import { useEffect, useState } from "react"

export default function Dashboard({handlerOpenRecentProject}) {

    const [list, setList] = useState(Array())

    useEffect(() => {
        const refProject = ref(storage, "/")
        listAll(refProject).then((res) => {
            setList(res.items)
        });
    }, [])


    return (
        <div className="m-3">
            <h1>Dashboard</h1>
            <h3>Recent Project</h3>
            {
                list.map(project => (
                    <button className="btn p-2 m-2 bg-slate-200 hover:bg-slate-400" key={project.name} onClick={() => handlerOpenRecentProject(project)}>{project.name}</button>
                ))
            }
        </div>
    )
}