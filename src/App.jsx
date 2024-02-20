import { Component } from "react";
import Sidebar from "./components/Sidebar";
import NewProject from "./components/NewProject";
import Edit from "./components/Edit";
import Dashboard from "./components/Dashboard";
import { getBytes, ref } from "firebase/storage";
import { storage } from "./firebase";
import SidebarDialog from "./components/SidebarDialog";
import About from "./components/About";
import { IoMenu } from "react-icons/io5";

class App extends Component {
  state = {
    onOpenProject: false,
    onNewProject: false,
    onEdit: false,
    onDashboard: false,
    onAbout: false,
    editData: {
      name: null,
      data: null,
    },
  };

  constructor() {
    super();

    this.handlerNewProject = this.handlerNewProject.bind(this);
    this.handlerCloseNewProject = this.handlerCloseNewProject.bind(this);
    this.handleNewProjectData = this.handleNewProjectData.bind(this);
    this.handlerOpenRecentProject = this.handlerOpenRecentProject.bind(this);
    this.handlerDashboard = this.handlerDashboard.bind(this);
    this.handlerAbout = this.handlerAbout.bind(this);
  }

  handlerNewProject() {
    this.setState({
      onNewProject: true,
      onEdit: false,
      onDashboard: false,
    });
  }

  handleNewProjectData(name, data) {
    this.setState({
      onNewProject: false,
      onDashboard: false,
      onEdit: true,
      editData: {
        name: name,
        data: data,
      },
    });
  }

  handlerOpenProject() {}

  handlerAbout() {
    this.setState({
      onNewProject: false,
      onDashboard: false,
      onEdit: false,
      onAbout: true,
    });
  }

  handlerOpenRecentProject(project) {
    const refProject = ref(storage, project.fullPath);
    getBytes(refProject).then((res) => {
      console.log(res);
      var enc = new TextDecoder("utf-8");
      const data = JSON.parse(enc.decode(res));
      this.setState({
        onEdit: true,
        editData: {
          name: project.name,
          data: data,
        },
      });
    });
  }

  handlerDashboard() {
    this.setState({
      onDashboard: true,
      onEdit: false,
      onNewProject: false,
      onAbout: false,
    });
  }

  handlerCloseNewProject() {
    this.setState({
      onNewProject: false,
    });
  }

  render() {
    return (
      <div className="flex flex-row">
        <div className="font-Inter flex h-screen flex-col justify-between sm:w-0 md:w-0 lg:w-0 xl:w-[18vw]">
          <Sidebar
            handlerNewProject={this.handlerNewProject}
            handlerOpenProject={this.handlerOpenProject}
            handlerDashboard={this.handlerDashboard}
            handlerAbout={this.handlerAbout}
          />
        </div>
        <div className="sm:w-screen md:w-screen lg:w-screen xl:w-[82vw]">
          {this.state.onNewProject ? (
            <NewProject
              handleCloseButton={this.handlerCloseNewProject}
              handleData={this.handleNewProjectData}
            />
          ) : this.state.onEdit ? (
            <Edit data={this.state.editData} />
          ) : this.state.onAbout ? (
            <About />
          ) : (
            <Dashboard
              handlerOpenRecentProject={this.handlerOpenRecentProject}
            />
          )}
        </div>
        <div className="absolute left-2 top-2 xl:hidden">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 border-0 bg-sky-900 text-white"
            >
              <IoMenu />
            </div>
            <div className="dropdown-content w-72 shadow-lg">
              <SidebarDialog
                handlerNewProject={this.handlerNewProject}
                handlerOpenProject={this.handlerOpenProject}
                handlerDashboard={this.handlerDashboard}
                handlerAbout={this.handlerAbout}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
