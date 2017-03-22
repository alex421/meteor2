import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Creatable } from 'react-select';
import 'react-select/dist/react-select.css';
 
 //using react-select
export default class SelectUsers extends Component {
    constructor(props) {
      super(props);

      this.handleChange = this.handleChange.bind(this);

   
      this.state = {
        value: "",
      };
    }


      handleChange(value) {
      	console.log("props",this.props)
      	this.props.handleMySelectChange(value)
     // 	this.setState({ value: value });
	
	  }



	render() {


		var zz=[];

		function getOptions () {
			var allRoles=this.props.roles;

			allRoles.map((role) => {
				zz.push({
					value: role.name,
					label: role.name
				})

			});
		}

		var xx=getOptions.bind(this);
		xx()
 
		let options = [{
			value: 'R',
			label: 'Red'
		}, {
			value: 'G',
			label: 'Green'
		}, {
			value: 'B',
			label: 'Blue' 
		}]



		return (
		 < div >
			< Creatable name = "form-field-name" options = {zz} joinValues = {true } multi = {true} value={this.props.value}  onChange = {this.handleChange}/>
		 < /div>
		);
	}
}
 