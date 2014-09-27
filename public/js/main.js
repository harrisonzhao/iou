require.config({
  paths: { 
      'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min',
      'underscore': '../bower_components/underscore/underscore',
      'backbone': '../bower_components/backbone/backbone',
      'd3': 'http://d3js.org/d3.v3.min',
      'bootstrap': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min'
  }
});

require([
	'jquery', 
	'underscore', 
	'backbone',
	'd3',
	'app',
	'models/SessionModel',
	'router',
	'bootstrap'
	], function($, _, Backbone, d3, App, SessionModel, Router){
		var app = new App();
    app.session = new SessionModel({});
    app.router = new Router();
});