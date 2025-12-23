// Sample family data (later replace with Google Sheets API)
const familyData = [
  { id: 1, name: "Ram" },
  { id: 2, name: "Shyam", parent: 1 },
  { id: 3, name: "Geeta", parent: 1 },
  { id: 4, name: "Amit", parent: 2 },
  { id: 5, name: "Rita", parent: 2 }
];

// Build tree structure
function buildTree(data) {
  const map = {};
  const roots = [];

  data.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });

  data.forEach(item => {
    if (item.parent) {
      map[item.parent].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
}

// Render tree to HTML
function renderTree(node) {
  let html = `<li><div>${node.name}</div>`;

  if (node.children.length > 0) {
    html += "<ul>";
    node.children.forEach(child => {
      html += renderTree(child);
    });
    html += "</ul>";
  }

  html += "</li>";
  return html;
}

// Run
const treeRoots = buildTree(familyData);
document.getElementById("tree").innerHTML =
  treeRoots.map(renderTree).join("");