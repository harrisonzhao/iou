define([
	"app",
	"models/SessionModel",
	"views/HeaderView",
	"views/LoginView"
], function(app, SessionModel, UserModel, HeaderView, LoginView){

	var Router = Backbone.Router.extend({

		initialize: function(){
		},

		routes: {
			""                : "index",
			//"login"         : "login"
		},

		show: function(view, options){

			// Every page view in the router should need a header.
			// Instead of creating a base parent view, just assign the view to this
			// so we can create it if it doesn't yet exist
			if(!this.headerView){
				this.headerView = new HeaderView({});
				this.headerView.setElement( $(".header") ).render();
			}

			// Close and unbind any existing page view
			if(this.currentView) this.currentView.close();

			// Establish the requested view into scope
			this.currentView = view;

			// Render inside the page wrapper
			$('#content').html(this.currentView.render().$el);

		},

		index: function() {
			console.log("hi");
			// Fix for non-pushState routing (IE9 and below)
			var hasPushState = !!(window.history && history.pushState);
			if(!hasPushState) this.navigate(window.location.pathname.substring(1), {trigger: true, replace: true});
			else {
				this.show( new LoginView({}) );
			}                

		}

	});

	return Router;

});