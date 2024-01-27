export default function Sidebar({handlerNewProject, handlerOpenProject}) {
    return (
        <>
            <div className="flex flex-col w-[8vw]">
                <button className="btn m-2" onClick={handlerNewProject}>New Project</button>
                <button className="btn m-2" onClick={handlerOpenProject}>Open Project</button>
            </div>
        </>
    );
}