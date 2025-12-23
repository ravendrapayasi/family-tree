const API_URL = "https://script.google.com/macros/s/AKfycbxFG2fl43rAlhx-l2Mt39L7GzSawzELK1JHbdJsrNu456MGY7I9Xy83qfqcXr2bqCP3/exec";

fetch(API_URL)
  .then(res => res.json())
  .then(data => renderTree(buildTree(data)));

function buildTree(data) {
  const map = {};
  const roots = [];

  data.forEach(p => map[p.id] = { ...p, children: [] });

  data.forEach(p => {
    if (p.parent_id) {
      map[p.parent_id]?.children.push(map[p.id]);
    } else {
      roots.push(map[p.id]);
    }
  });

  return roots;
}

function renderTree(roots) {
  const container = document.getElementById("tree");

  function renderLevel(nodes) {
    const level = document.createElement("div");
    level.className = "level";

    nodes.forEach(n => {
      const card = document.createElement("div");
      card.className = `card ${n.color || "root"}`;
      card.innerHTML = `
        <h4>${n.name}</h4>
        <div class="role">${n.role || ""}</div>
      `;
      level.appendChild(card);

      if (n.children.length) {
        container.appendChild(level);
        renderLevel(n.children);
      }
    });

    container.appendChild(level);
  }

  renderLevel(roots);
}
