define([
	"backbone",
	"models/SessionModel"
], function(Backbone, SessionModel){
  var App = Backbone.View.extend({
    initialize: function(){
      this.session = new SessionModel({});
      console.log("it's working!");
    }
  });
  return App;
});