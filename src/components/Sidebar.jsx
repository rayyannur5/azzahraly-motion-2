export default function Sidebar({handlerNewProject, handlerOpenProject}) {
    return (
        <>
            <div className="flex flex-col w-[8vw]">
                <button className="p-2 m-2 bg-slate-200 rounded hover:bg-slate-400" onClick={handlerNewProject}>New Project</button>
                <button className="p-2 m-2 bg-slate-200 rounded hover:bg-slate-400" onClick={handlerOpenProject}>Open Project</button>
            </div>
        </>
    );
}