var newUser = function(user) {
  return {
    name : user.fullName(),
    worth : 0,
    edges : {} // Edges is a map from user ids to cost
  };
};

var reduceGraph = function(graph, source_id, sink_id) {

};

var graph = {
  newGraph : function() {
    var internalGraph = {};

    internalGraph.addUser = function(user) {
      if (!internalGraph[user.user_id]) {
        internalGraph[user.user_id] = newUser(user);
        return true;
      }
      return false;
    };

    internalGraph.removeUser = function(user) {
      if (!internalGraph[user.user_id] || internalGraph[user.user_id].worth) {
        return false;
      }
      delete internalGraph[user.user_id];
      return true;
    };

    internalGraph.addTransaction = function(transaction) {
      var source = transaction.source;
      var sink = transaction.sink;

      if (!internalGraph[source.user_id] || !internalGraph[sink.user_id]) {
        return false;
      }

      if (!internalGraph[source.user_id].edges[sink.user_id]) {
        internalGraph[source.user_id].edges[sink.user_id] = -transaction.value;
      } else {
        internalGraph[source.user_id].edges[sink.user_id] -= transaction.value;
      }
      internalGraph[source.user_id].worth -= transaction.value;

      if (!internalGraph[sink.user_id].edges[source.user_id]) {
        internalGraph[sink.user_id].edges[source.user_id] = transaction.value;
      } else {
        internalGraph[sink.user_id].edges[source.user_id] += transaction.value;
      }
      internalGraph[sink.user_id].worth += transaction.value;

      reduceGraph(graph, source_id, sink_id);

      return true;
    };

    return internalGraph;
  }
};

module.exports = graph;