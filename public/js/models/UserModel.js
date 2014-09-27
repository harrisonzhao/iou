define(["backbone"], function(Backbone) {
	var UserModel = Backbone.Model.extend({ urlRoot: '/users' });
	return UserModel;
})

// To use:
// require(['models/userModel'],
// 	function(UserModel) {
// 		console.log(new UserModel({ id: '10'}));
// 	});