var userId, rooms;

var createRoom = function (event) {
  $.post('/rooms/new', {
    roomName: $('#name').val()
  }, function (room) {
    $.when.apply($, _.each($('#emails').val().split(" "), function (email) {
      $.post('/invites/new', {
        roomId: room.roomId,
        email: email
      }).done(function() {
        location.reload();
      });
    }))
  })
}

$.get('/rooms', null, function (data) { userId = data.id; rooms = data.rooms;
  _.each(rooms, function (room) {
    var element = document.createElement('li')
    element.innerHTML = room.name

    // Listeners for element
    element.onclick = function() {
      window.location = '/room/'+room.room_id
    }
    $('#room-list ul').append(element);
  })
});