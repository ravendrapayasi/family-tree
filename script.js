const API_URL = "https://script.google.com/macros/s/AKfycbxFG2fl43rAlhx-l2Mt39L7GzSawzELK1JHbdJsrNu456MGY7I9Xy83qfqcXr2bqCP3/exec";

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const nodes = data.map(item => ({
      id: item.id,
      name: item.name,
      parent: item.parent_id || null,
      role: item.role,
      color: item.color
    }));
    
    makeOrgChart(nodes);
  });

function makeOrgChart(nodes) {
  const datamap = {};

  nodes.forEach(n => {
    datamap[n.id] = {
      id: n.id,
      name: n.name,
      title: n.role,
      color: n.color
    };
  });

  nodes.forEach(n => {
    if (n.parent) {
      if (!datamap[n.parent].children) {
        datamap[n.parent].children = [];
      }
      datamap[n.parent].children.push(datamap[n.id]);
    }
  });

  const rootNodes = nodes.filter(n => !n.parent).map(n => datamap[n.id]);

  $("#chart-container").orgchart({
    'data': rootNodes[0],
    'nodeContent': 'title',
    'pan': true,
    'zoom': true,
    'createNode': function($node, data) {
      $node.css("border-color", colorMap(data.color));
      $node.find(".title").css("background-color", colorMap(data.color));
    }
  });
}

function colorMap(color) {
  switch(color) {
    case 'yellow': return '#f5c400';
    case 'green':  return '#59d98e';
    case 'blue':   return '#4db5ff';
    case 'purple': return '#b36bff';
    default:       return '#888';
  }
}
