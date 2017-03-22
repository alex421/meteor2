import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
if (Meteor.isServer) {

  // server
	// This code only runs on the server
	Meteor.publish("userList", function() {
	return Meteor.users.find({});
	});

	Meteor.publish(null, function() {
	return Meteor.roles.find({});
	});

	Meteor.methods({ 
	'users.insert' (username,email,selectedValuesArray) {

		console.log("insert this user",username,email)

	  var users = Meteor.users.find({}).fetch();
	  id = Accounts.createUser({
	    username: username,
	    email: email,
	   	 password: "1234567",
	    profile: {
	      //publicly visible fields like firstname goes here
	    }

	  });

	  Meteor.users.update(id,  {
		  $push: {
		    parent: Meteor.userId()
		  }
		});

  		  var roles = [];
	       selectedValuesArray.map(function(obj){
       		  roles.push(obj.value);
        	 return roles;
      })


	  Roles.addUsersToRoles(id, roles);

	},  
	'users.remove'(userId) {
		Meteor.users.remove({_id: userId});
		},

	});
	


}
 
