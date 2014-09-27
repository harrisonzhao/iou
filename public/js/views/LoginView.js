define([
	'app'
], function(app){

	var LoginView = Backbone.View.extend({

		initialize: function () {

			// Listen for session logged_in state changes and re-render
			app.session.on("change:logged_in", this.render);
		},

		events: {
			'click #login-btn'                      : 'onLoginAttempt',
			'click #signup-btn'                     : 'onSignupAttempt',
			'keyup #login-password-input'           : 'onPasswordKeyup',
			'keyup #signup-password-confirm-input'  : 'onConfirmPasswordKeyup'
		},

		render:function () {
			this.template = _.template('../templates/login.html'); 

			this.$el.html(this.template());
			return this;
		}


	});

	return LoginView;
});