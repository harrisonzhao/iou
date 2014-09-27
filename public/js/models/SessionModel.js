define([
	"app",
	"models/UserModel"
], function(app, UserModel){

	var SessionModel = Backbone.Model.extend({

		defaults: {
			logged_in: false,
			user_id: ''
		},

		initialize: function(){
		},

		url: function(){
			return '/auth';
		},

		postAuth: function(opts, callback, args){
			var self = this;
			var postData = _.omit(opts, 'method');
			$.ajax({
				url: this.url() + '/' + opts.method,
				contentType: 'application/json',
				dataType: 'json',
				type: 'POST',
				data: JSON.stringify( _.omit(opts, 'method') ),
				success: function(res){
				},
				error: function(mod, res){
				}
			});
		},

		// Request types
		login: function(opts, callback, args){
			this.postAuth(_.extend(opts, { method: 'login' }), callback);
		},

		logout: function(opts, callback, args){
			this.postAuth(_.extend(opts, { method: 'logout' }), callback);
		},

		signup: function(opts, callback, args){
			this.postAuth(_.extend(opts, { method: 'signup' }), callback);
		},

		removeAccount: function(opts, callback, args){
			this.postAuth(_.extend(opts, { method: 'remove_account' }), callback);
		}

	});
	
	return SessionModel;
});
