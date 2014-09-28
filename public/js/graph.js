$.get('/rooms', null, function (data) { console.log(data); })
reducedData = {
  users : [
    { name: "Bobby", id: 1, value: 250 },
    { name: "Rene", id: 2 , value: 150},
    { name: "Cheng", id: 3, value: 150},
    { name: "Harrison", id: 4, value: 100 },
    { name: "Fukang", id: 5, value: 1500 },
  ],
  links : [
    { id: 1, sourceId: 1, targetId: 2},
    { id: 2, sourceId: 1, targetId: 3},
    { id: 3, sourceId: 1, targetId: 4},
  ]
}

historData = {
  users : [
    { name: "Bobby" },
    { name: "Rene" },
    { name: "Cheng" },
    { name: "Harrison" },
    { name: "Fukang" }
  ],
  links : [
    { id: 1, sourceId: 1, targetId: 2},
    { id: 2, sourceId: 1, targetId: 3},
    { id: 3, sourceId: 1, targetId: 4},
  ],
  selected : []
}

var width = 760,
    height = 400;

var color = d3.scale.category10();

// Historical Graph
var svg = d3.select("#svg-window").append("svg")
  .attr("width", width)
  .attr("height", height);

var midX = width / 2,
    midY = height / 2;

function setupFullGraph(users, links, radius) {

  svg.selectAll('*').remove();

  $('#transaction-history ul').empty();

  // Populate History
  links.forEach(function (link) {
    var element = document.createElement('li')
    element.innerHTML = "Cheng owes Rene $10 because of dinner"
    element.attributes.selected = false
    element.onclick = function() {
      element.attributes.selected = !element.attributes.selected
      if (element.attributes.selected) {
        element.className = 'selected'
      } else {
        element.className = ''
      }
    }
    element.onmouseover = function() {

    }
    $('#transaction-history ul').append(element);
  })

  var radianIt = function (i) {
    return i * (2 * Math.PI / users.length) - Math.PI / 2;
  }

  var node = svg.selectAll('.node').data(users)
    .enter().append('circle')
    .attr('id', function (d) { return 'user' + d.id; })
    .attr('class', 'node')
    .attr('r', 10)
    .attr('cx', function(d, i) {
      return Math.cos(radianIt(i)) * radius + midX;
    })
    .attr('cy', function(d, i) {
      return Math.sin(radianIt(i)) * radius + midY;
    })
    .style("fill", function(d, i) { return color(i); })
    .style("stroke-width", 2)
    .style("stroke", 'black');
}

function showReducedGraph(user, others, owee, radius, links) {

  svg.selectAll('*').remove();

  var linkColor = (owee) ? 'green' : 'red'
      radianIt = function (i) {
        return (owee) ? (i * (5 * Math.PI / 6) / (others.length - 1) + Math.PI / 12) : (i * (5 * Math.PI / 6) / (others.length - 1) - 11 * Math.PI / 12);
      }

  // User Node
  var user = svg.selectAll('.user').data([user])
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
      return Math.sin(radianIt(i)) * radius + midY / ((owee) ? 1.3 : 0.8);
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
    .data(links)
    .enter()
      .append("svg:line")
      .attr('id', function(d) { return 'link' + d.id; })
      .attr("x1", function(d) { return d3.select( (owee) ? ('#user'+d.targetId) : ('#user'+d.sourceId) ).attr('cx'); })
      .attr("y1", function(d) { return d3.select( (owee) ? ('#user'+d.targetId) : ('#user'+d.sourceId) ).attr('cy'); })
      .attr("x2", function(d) { return d3.select( (owee) ? ('#user'+d.sourceId) : ('#user'+d.targetId) ).attr('cx'); })
      .attr("y2", function(d) { return d3.select( (owee) ? ('#user'+d.sourceId) : ('#user'+d.targetId) ).attr('cy'); })
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
      var value = d.value / 100;
      return (owee) ? ('I\'m ' + name + ' and IOU $' + value) : ('Hi ' + name + ', IOU $' + value); 
    }
  });
}

showReducedGraph(reducedData.users[0], reducedData.users, true, 210, reducedData.links);

function switchGraph() {
  $('#transaction-history').toggleClass('hidden')
  if ($('#transaction-history').hasClass('hidden')) {
    showReducedGraph(reducedData.users[0], reducedData.users, true, 210, reducedData.links);
  } else {
    setupFullGraph(historData.users, historData.links, 180);
  }
}

$('.onoffswitch input').click(switchGraph);