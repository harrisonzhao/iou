define(["backbone"], function(Backbone) {
	var RoomModel = Backbone.Model.extend({ urlRoot: '/rooms' });
	return RoomModel;
})