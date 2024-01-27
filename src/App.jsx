import { Component } from 'react'
import Sidebar from './components/Sidebar'
import NewProject from './components/NewProject'
import Edit from './components/Edit'
import Dashboard from './components/Dashboard'
import { getBytes, ref } from 'firebase/storage'
import { storage } from './firebase'


class App extends Component {
  state = {
    onOpenProject: false,
    onNewProject: false,
    onEdit: false,
    editData : {
      name: null,
      data: null,
    }
  }

  constructor() {
    super();

    this.handlerNewProject = this.handlerNewProject.bind(this)
    this.handlerCloseNewProject = this.handlerCloseNewProject.bind(this)
    this.handleNewProjectData = this.handleNewProjectData.bind(this)
    this.handlerOpenRecentProject = this.handlerOpenRecentProject.bind(this)

  }

  handlerNewProject() {
    this.setState({
      onNewProject: true,
    })
  }

  handleNewProjectData(name, data) {
    this.setState({
      onNewProject: false,
      onEdit: true,
      editData: {
        name: name,
        data: data
      }
    })
  }

  handlerOpenProject() {

  }

  handlerOpenRecentProject(project) {
    const refProject = ref(storage, project.fullPath)
    getBytes(refProject).then(res => {
      var enc = new TextDecoder("utf-8");
      const data = JSON.parse(enc.decode(res));
      this.setState({
        onEdit: true,
        editData: {
          name: project.name,
          data: data,
        }
      })
    })
    
  }

  handlerCloseNewProject() {
    this.setState({
      onNewProject: false
    })
  }

  render() {
    return (
      <div className="flex flex-row">
        <div className="w-[8vw] h-screen border-e-2 border-black flex flex-col justify-between">
          <Sidebar handlerNewProject={this.handlerNewProject} handlerOpenProject={this.handlerOpenProject} />
        </div>
        {this.state.onNewProject ? <NewProject handleCloseButton={this.handlerCloseNewProject} handleData={this.handleNewProjectData} /> :
          this.state.onEdit ? <Edit data={this.state.editData}/> :
          <Dashboard handlerOpenRecentProject={this.handlerOpenRecentProject}/>}
      </div>
    )
  }
}

export default App
