import { Component, useState } from 'react'
import Sidebar from './components/Sidebar'
import NewProject from './components/NewProject'
import Edit from './components/Edit'
import Dashboard from './components/Dashboard'
class App extends Component {
  state = {
    onOpenProject: false,
    onNewProject: false,
  }

  constructor() {
    super();

    this.handlerNewProject = this.handlerNewProject.bind(this)
    this.handlerCloseNewProject = this.handlerCloseNewProject.bind(this)

  }

  handlerNewProject() {
    this.setState({
      onNewProject: true,
    })
  }

  handlerOpenProject() {

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
          <Sidebar handlerNewProject={this.handlerNewProject} handlerOpenProject={this.handlerOpenProject}/>
        </div>
        {this.state.onNewProject ? <NewProject handleCloseButton={this.handlerCloseNewProject}/> : <Dashboard/>}
      </div>
    )
  }
}

export default App
