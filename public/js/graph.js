var user;
var room;
var owee;
var others;
var users;
var transactions;

var selected = [] // Denotes the list of selected transactions in full mode

var width = 760,
    height = 400;

var color = d3.scale.category10();

// Historical Graph
var svg = d3.select("#svg-window").append("svg")
  .attr("width", width)
  .attr("height", height);

var midX = width / 2,
    midY = height / 2;

$('#add-form').submit(
  function (event) {
  $.post('/transactions/new', {
    roomId: room.room_id,
    id: (_.find(others, function (other) { return other.name == $('#ower').val()})).id,
    value: (+$('#amount').val()) * 100,
    reason: $('#reason').val()
  })
})

function drawSelectedLinks(links_shown) {

  svg.selectAll('line').remove();

  svg.append("svg:defs").selectAll("marker")
    .data(["arrow"])
    .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("stroke", 'transparent')
      .style('fill', 'white');
  
  // Links
  svg.selectAll("line")
    .data(links_shown)
    .enter()
      .append("svg:line")
      .attr("x1", function(d) { return d3.select('#user'+d.sourceId).attr('cx'); })
      .attr("y1", function(d) { return d3.select('#user'+d.sourceId).attr('cy'); })
      .attr("x2", function(d) { return d3.select('#user'+d.targetId).attr('cx'); })
      .attr("y2", function(d) { return d3.select('#user'+d.targetId).attr('cy'); })
      .attr("class", "link arrow")
      .attr("marker-end", "url(#arrow)")
      .style("stroke-width", 5)
      .style("stroke", 'white');
}

function setupFullGraph(users, transactions, radius) {

  // Reset view
  svg.selectAll('*').remove();

  $('#transaction-history ul').empty();

  // Populate History
  transactions.forEach(function (transaction, i) {

    selected = [] // reset selected links

    // Create the element
    var element = document.createElement('li')
    element.innerHTML = transaction.sourceName + " owes " + transaction.targetName + " $" + (transaction.amount/100).toFixed( 2 ) + " because of " + transaction.reason
    element.attributes.selected = false

    // Listeners for element
    element.onclick = function() {
      element.attributes.selected = !element.attributes.selected
      if (element.attributes.selected) {
        element.className = 'selected'
        selected.push(transaction)
      } else {
        element.className = ''
        selected.splice(selected.indexOf(transaction), 1)
      }
      drawSelectedLinks(selected)
    }
    element.onmouseover = function() {
      drawSelectedLinks(selected.concat(transaction))
    }
    $('#transaction-history ul').append(element);
  })

  var radianIt = function (i) {
    return i * (2 * Math.PI / users.length) - Math.PI / 2;
  }

  var node = svg.selectAll('.node').data(users)
    .enter().append('circle')
    .attr('id', function (d) { return 'user' + d.id; })
    .attr('class', 'users')
    .attr('r', 10)
    .attr('cx', function(d, i) {
      return Math.cos(radianIt(i)) * radius + midX;
    })
    .attr('cy', function(d, i) {
      return Math.sin(radianIt(i)) * radius + midY;
    })
    .style("fill", function(d, i) { return (d.id === user.id) ? 'white' : color(i); })
    .style("stroke-width", 1)
    .style("stroke", 'white');

  // Tooltips for Other Members
  $('svg circle.users').tipsy({ 
    fade: true,
    gravity: 'n',
    title: function() {
      var d = this.__data__;
      var name = d.name;
      return 'Hi I\'m ' + name + '!'; 
    }
  });
}

function showReducedGraph(user, others, owee, radius) {

  svg.selectAll('*').remove();

  var linkColor = (owee) ? 'green' : 'red'
      radianIt = function (i) {
        return (owee) ? (i * (5 * Math.PI / 6) / (others.length - 1) + Math.PI / 12) : (i * (5 * Math.PI / 6) / (others.length - 1) - 11 * Math.PI / 12);
      }

  if (others.length === 1) {
    radianIt = function(i) {
      return (owee) ? (Math.PI / 2) : (-Math.PI / 2);
    }
  }

  // User Node
  var userNode = svg.selectAll('.user').data([user])
    .enter().append('circle')
    .attr('id', function (d) { return 'user' + d.id; })
    .attr('class', 'user')
    .attr('r', 10)
    .attr('cx', width / 2)
    .attr('cy', (owee) ? (height / 4) : (3 * height / 4))
    .style("stroke-width", 1)
    .style("stroke", 'white')
    .style("fill", 'white');

  // Other Members' Nodes
  var node = svg.selectAll('.others').data(others)
    .enter().append('circle')
    .attr('id', function (d) { return 'user' + d.id; })
    .attr('class', 'others')
    .attr('r', 10)
    .attr('cx', function(d, i) {
      return Math.cos(radianIt(i)) * radius + midX;
    })
    .attr('cy', function(d, i) {
      return Math.sin(radianIt(i)) * radius + (midY / ((owee) ? 1.3 : 0.8));
    })
    .style("fill", function(d, i) { return color(i); })
    .style("stroke-width", 1)
    .style("stroke", 'white');

  // Link Arrows
  svg.append("svg:defs").selectAll("marker")
    .data(["arrow"])
    .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5")
      .style("stroke", 'transparent')
      .style('fill', linkColor);
  
  // Links
  svg.selectAll("line")
    .data(others)
    .enter()
      .append("svg:line")
      .attr("x1", function(d) { return d3.select( (owee) ? ('#user'+d.id) : ('#user'+user.id) ).attr('cx'); })
      .attr("y1", function(d) { return d3.select( (owee) ? ('#user'+d.id) : ('#user'+user.id) ).attr('cy'); })
      .attr("x2", function(d) { return d3.select( (owee) ? ('#user'+user.id) : ('#user'+d.id) ).attr('cx'); })
      .attr("y2", function(d) { return d3.select( (owee) ? ('#user'+user.id) : ('#user'+d.id) ).attr('cy'); })
      .attr("class", "link arrow")
      .attr("marker-end", "url(#arrow)")
      .style("stroke-width", 5)
      .style("stroke", linkColor);
  
  // Tooltips for User
  $('svg circle.user').tipsy({ 
    fade: true,
    gravity: (owee) ? 's' : 'n',
    title: function() {
      return 'This is me!'; 
    }
  });
  
  // Tooltips for Other Members
  $('svg circle.others').tipsy({ 
    fade: true,
    gravity: (owee) ? 'n' : 's',
    title: function() {
      var d = this.__data__;
      var name = d.name;
      var value = (d.value / 100).toFixed( 2 );
      return (owee) ? ('I\'m ' + name + ' and IOU $' + value) : ('Hi ' + name + ', IOU $' + value); 
    }
  });
}

function switchGraph() {
  $('#transaction-history').toggleClass('hidden')
  if ($('#transaction-history').hasClass('hidden')) {
    showReducedGraph(user, others, owee, 210);
  } else {
    setupFullGraph(users, transactions, 180);
  }
}

$.get('/rooms', null, function (data) { 

  //quick hack linear search optimally only query for given room id
  var userId = data.id;  // Need to change this to suit appropriate room
  //var room = data.rooms[0];
  //last elem should be id of room
  var pathArray = window.location.pathname.split( '/' );
  var roomId = parseInt(pathArray[pathArray.length - 1]);
  var room, i;
  for (i = 0; i !== data.rooms.length; ++i) {
    if (roomId === data.rooms[i].room_id) {
      room = data.rooms[i];
      break;
    }
  }
  user = room.graph[userId];
  user.id = userId;
  owee = user.worth > 0;

  // Create the list of people who owe/are owed
  others = Object.keys(user.edges).map(function (key) {
    return {
      name: room.graph[key].name,
      value: Math.abs(user.edges[key]),
      id: +key
    }
  });
  
  // Show reduced graph
  showReducedGraph(user, others, owee, 210);

  $.get('/transactions', { roomId: room.room_id }, function (tHistory) {

    transactions = tHistory.filter(function (transaction) {
      return transaction.sink_user_id != null && transaction.source_user_id != null;
    }).map(function (transaction) {
      return {
        sourceId: (transaction.value > 0) ? transaction.sink_user_id : transaction.source_user_id,
        targetId: (transaction.value > 0) ? transaction.source_user_id : transaction.sink_user_id,
        sourceName: (transaction.value > 0) ? room.graph[transaction.sink_user_id].name : room.graph[transaction.source_user_id].name,
        targetName: (transaction.value > 0) ? room.graph[transaction.source_user_id].name : room.graph[transaction.sink_user_id].name,
        reason: transaction.reason,
        amount: Math.abs(transaction.value)
      }
    })

    users = Object.keys(room.graph).map(function (key) {
      return {
        name: room.graph[key].name,
        id: +key
      }
    });

    // Enable switching display
    $('.onoffswitch input').click(switchGraph);
  
  });
});