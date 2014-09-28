var newUser = function(user) {
  return {
    name : user.fullName(),
    worth : 0,
    edges : {} // Edges is a map from user ids to cost
  };
};

var modifyEdge = function(graph, source_id, sink_id, value) {
  if (!graph[source_id].edges[sink_id]) {
    graph[source_id].edges[sink_id] = value;
  } else {
    graph[source_id].edges[sink_id] += value;
  }

  if (!graph[sink_id].edges[source_id]) {
    graph[sink_id].edges[source_id] = -value;
  } else {
    graph[sink_id].edges[source_id] -= value;
  }

  if (graph[source_id].edges[sink_id] === 0 && graph[sink_id].edges[source_id] === 0) {
    delete graph[source_id].edges[sink_id];
    delete graph[sink_id].edges[source_id];
  }
};

var reduceGraph = function(graph, source_id, sink_id, value) {
  var source = graph[source_id];
  var sink = graph[sink_id];

  var change;

  if (source.worth + value > 0 && source.edges[sink_id] < 0) {
    var sourceVal = source.edges[sink_id];
    for (var sourceEdge in source.edges) {
      if (source.edges.hasOwnProperty(sourceEdge)) {
        if (sourceEdge == sink_id) continue;
        change = Math.min(source.edges[sourceEdge], -sourceVal);
        modifyEdge(graph, sourceEdge, source_id, change);
        modifyEdge(graph, source_id, sink_id, change);
        modifyEdge(graph, sourceEdge, sink_id, change);
        sourceVal += change;
        if (sourceVal === 0) break;
      }
    }
  }
  if (sink.worth - value < 0 && sink.edges[source_id] > 0) {
    var sinkVal = sink.edges[source_id];
    for (var sinkEdge in sink.edges) {
      if (sink.edges.hasOwnProperty(sinkEdge)) {
        if (sinkEdge == source_id) continue;
        change = Math.min(-sink.edges[sinkEdge], sinkVal);
        modifyEdge(graph, sinkEdge, sink_id, -change);
        modifyEdge(graph, sink_id, source_id, -change);
        modifyEdge(graph, sinkEdge, source_id, -change);
        if (sinkVal === 0) break;
      }
    }
  }
};

var graph = {
  newGraph : function() {
    return {};
  },

  checkWorth : function(graph, user) {
    if (graph[user.user_id]) {
      return graph[user.user_id].worth;
    }
  },

  addUser : function(graph, user) {
    if (!graph[user.user_id]) {
      graph[user.user_id] = newUser(user);
      return true;
    }
    return false;
  },

  removeUser : function(graph, user) {
    if (!graph[user.user_id] || graph[user.user_id].worth) {
      return false;
    }
    delete graph[user.user_id];
    return true;
  },

  addTransaction : function(graph, transaction) {
    var source = transaction.source;
    var sink = transaction.sink;
    if (!graph[source.user_id] || !graph[sink.user_id]) {
      return false;
    }
    graph[source.user_id].worth -= transaction.value;
    graph[sink.user_id].worth += transaction.value;
    modifyEdge(graph, source.user_id, sink.user_id, -transaction.value);
    reduceGraph(graph, source_id, sink_id, transaction.value);
    return true;
  }

};

module.exports = graph;