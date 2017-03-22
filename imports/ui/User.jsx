import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
 
// Task component - represents a single todo item
export default class User extends Component {
	deleteThisUser() {
		Meteor.call('users.remove', this.props.user._id);
	}


	render() {
		console.log("user2",this.props)

		var children = this.props.children.map((ob) => {
	          return ob.username
	       })

	   return (
	      <li >
	        <button className="delete" onClick={this.deleteThisUser.bind(this)}>
	          &times;
	        </button>

	        <span className="text">
	          <strong>{this.props.user.username}</strong>:
	           <br />
	          { typeof(this.props.user.emails) === "undefined"  ? "" : "email: " +this.props.user.emails[0].address}
	          <br />
	          {typeof(this.props.user.roles) === "undefined"  ? "" : "ROLES: " +this.props.user.roles.toString()}
	            <br />
	          {typeof(this.props.user.children) === "undefined"  ? "" : "CHILDREN: " +children.toString()}
	        </span>
	      </li>
	    );
	}
}

 