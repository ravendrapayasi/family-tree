const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxFG2fl43rAlhx-l2Mt39L7GzSawzELK1JHbdJsrNu456MGY7I9Xy83qfqcXr2bqCP3/exec";

let chart;
let members = [];

/* LOAD TREE + DROPDOWN */
loadTree();

function loadTree() {
  fetch(SHEET_URL)
    .then(res => res.json())
    .then(rows => {
      members = rows;
      initTree(rows);
      populateParentDropdown(rows);
    })
    .catch(err => console.error(err));
}

/* POPULATE PARENT DROPDOWN */
function populateParentDropdown(rows) {
  const select = document.getElementById("parentId");

  // reset dropdown
  select.innerHTML =
    `<option value="">-- Select Parent (Root if empty) --</option>`;

  rows.forEach(r => {
    const option = document.createElement("option");
    option.value = r.id;
    option.textContent = `${r.name} (ID: ${r.id})`;
    select.appendChild(option);
  });
}

/* INIT TREE */
function initTree(rows) {
  const data = rows.map(r => ({
    id: r.id,
    parentId: r.parentId || null,
    name: r.name,
    role: r.role,
    color: r.color || "#60a5fa"
  }));

  if (!chart) {
    chart = new d3.OrgChart()
      .container("#chart-container")
      .nodeWidth(() => 180)
      .nodeHeight(() => 120)
      .childrenMargin(() => 60)
      .compact(false)

      .nodeContent(d => `
        <div class="person" style="--color:${d.data.color}">
          <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png"/>
          <div class="name">${d.data.name}</div>
          <div class="role">${d.data.role || ""}</div>
        </div>
      `)

      .linkUpdate(function(d) {
        d3.select(this)
          .attr("stroke", d.data.color)
          .attr("stroke-width", 5);
      })

      .onNodeClick(d => chart.toggleCollapse(d));
  }

  chart.data(data).render();
}

/* ADD MEMBER */
function addMember() {
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  const parentId = document.getElementById("parentId").value;
  const color = document.getElementById("color").value || "#60a5fa";

  if (!name) {
    alert("Name is required");
    return;
  }

  // 🔹 Calculate next ID = max existing id + 1
  const maxId = members.reduce((max, m) => {
    const id = Number(m.id);
    return id > max ? id : max;
  }, 0);

  const nextId = maxId + 1;

  fetch(
  `${SHEET_URL}?action=create&id=${nextId}&parentId=${parentId || ""}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&color=${color}`
)
  .then(res => res.json())
  .then(() => {
    clearForm();
    showMessage("Member added successfully ✅");
    loadTree();
  });
}


/* CLEAR FORM */
function clearForm() {
  ["name", "role", "color"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("parentId").value = "";
}

function showMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = "✅ " + text;
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 3000);
}

