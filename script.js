const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxFG2fl43rAlhx-l2Mt39L7GzSawzELK1JHbdJsrNu456MGY7I9Xy83qfqcXr2bqCP3/exec";

fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => buildTree(data));

function buildTree(data) {
  const map = {};
  data.forEach(item => {
    map[item.id] = {
      id: item.id,
      parent: item.parent,
      name: item.name,
      role: item.role,
      children: []
    };
  });

  let root = null;
  data.forEach(item => {
    if (item.parent) {
      map[item.parent].children.push(map[item.id]);
    } else {
      root = map[item.id];
    }
  });

  function createNode(person) {
    return {
      innerHTML: `
        <div class="node">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png"/>
          <div class="name">${person.name}</div>
          <div class="role">${person.role || ""}</div>
        </div>
      `,
      collapsable: true,
      children: person.children.map(createNode)
    };
  }

  new Treant({
    chart: {
      container: "#tree-simple",
      rootOrientation: "NORTH",
      nodeAlign: "CENTER",
      levelSeparation: 80,
      siblingSeparation: 40,
      subTeeSeparation: 60,
      connectors: {
        type: "curve",
        style: {
          stroke: "#8b5cf6",
          "stroke-width": 4
        }
      },
      node: {
        collapsable: true
      }
    },
    nodeStructure: createNode(root)
  });
}
