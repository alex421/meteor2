import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
 
import { Tasks } from '../api/tasks.js';
 
import Task from './Task.jsx';
import User from './User.jsx';
import SelectUsers from './SelectUsers.jsx';

import AccountsUIWrapper from './AccountsUIWrapper.jsx';


import Blaze from 'meteor/gadicc:blaze-react-component';
 
// App component - represents the whole app
class App extends Component {
    constructor(props) {
      super(props);
      this.handleMySelectChange = this.handleMySelectChange.bind(this);
      this.state = {
        hideCompleted: false,
        selectValue: []

      };
    }


  handleMySelectChange(value) {
      this.setState({selectValue: [...value]})
  }


  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('tasks.insert', text);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
 
  handleAddUser(event) {

    event.preventDefault();
    const username = ReactDOM.findDOMNode(this.refs.userInput).value.trim();
    const email = ReactDOM.findDOMNode(this.refs.emailInput).value.trim();
    const group = ReactDOM.findDOMNode(this.refs.selectREF)

    //console.log(group.find("input"))
    var selectedValues=this.state.selectValue;


    console.log("selectedValuesArr",selectedValues)

    Meteor.call('users.insert', username,email,selectedValues);

    ReactDOM.findDOMNode(this.refs.userInput).value = '';
    ReactDOM.findDOMNode(this.refs.emailInput).value = ''; 

  }

   toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
 
  renderTasks() {
    let filteredTasks = this.props.tasks;
    console.log("App.jsx this.props",this.props)
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    } 
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;
 
      return (
        <Task key={task._id} task={task} showPrivateButton={showPrivateButton} />
      );
    });
  }

  renderUsers(){
    let allUsers = this.props.users;

    return allUsers.map((user) => {
      const userId = user._id;     
      var children =Meteor.users.find({parent: user._id }).fetch()


      console.log("children",children)
        return ( 
            <User key={user._id}  user={user} children={children} />

          )

    })


  }
  render() {
    return (
      <div className="container">
        <header>
         <h1>Todo List ({this.props.incompleteCount})</h1>

       {/*<Blaze template="atForm" />*/}

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />
 
       { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
        }
 
       { this.props.currentUser ?
            <div>
            <SelectUsers value={this.state.selectValue} roles={this.props.roles} handleMySelectChange = {this.handleMySelectChange} ref="selectREF"/>
                <form className="new-user" onSubmit={this.handleAddUser.bind(this)} >
                  <input
                    type="text"
                    ref="userInput"
                    placeholder="Type to add new user"
                  />
                </form> 

                <form className="new-email" onSubmit={this.handleAddUser.bind(this)} >
                  <input
                    type="text"
                    ref="emailInput"
                    placeholder="Type to add unique email"
                  />
                </form>
              </div> : ''
        }


        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
        <ul>
          {this.renderUsers()}
        </ul>

      </div>
    );
  }
}
 


App.propTypes = {
  tasks: PropTypes.array.isRequired,
   incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('tasks');
  Meteor.subscribe("userRoles");
  Meteor.subscribe("userList");
  
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),  
    currentUser: Meteor.user(),
    users :  Meteor.users.find({}).fetch(),   
    roles:  Meteor.roles.find({}).fetch(),   

    
  };
}, App);