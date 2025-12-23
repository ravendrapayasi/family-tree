
// const data = [
//   { id: 1, parentId: null, name: "Family Head", role: "Founder", color: "#22c55e" },

//   { id: 2, parentId: 1, name: "Son 1", role: "Branch A", color: "#facc15" },
//   { id: 3, parentId: 1, name: "Son 2", role: "Branch B", color: "#86efac" },
//   { id: 4, parentId: 1, name: "Son 3", role: "Branch C", color: "#38bdf8" },
//   { id: 5, parentId: 1, name: "Son 4", role: "Branch D", color: "#a78bfa" },

//   { id: 6, parentId: 2, name: "Child A1", role: "", color: "#facc15" },
//   { id: 7, parentId: 2, name: "Child A2", role: "", color: "#facc15" },

//   { id: 8, parentId: 3, name: "Child B1", role: "", color: "#86efac" },

//   { id: 9, parentId: 4, name: "Child C1", role: "", color: "#38bdf8" },

//   { id: 10, parentId: 5, name: "Child D1", role: "", color: "#a78bfa" },
//   { id: 11, parentId: 5, name: "Child D2", role: "", color: "#a78bfa" }
// ];

const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbxFG2fl43rAlhx-l2Mt39L7GzSawzELK1JHbdJsrNu456MGY7I9Xy83qfqcXr2bqCP3/exec";

fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => buildTree(data));

const chart = new d3.OrgChart()
  .container("#chart-container")
  .data(data)
  .nodeWidth(() => 180)
  .nodeHeight(() => 120)
  .childrenMargin(() => 60)
  .compact(false)
  .nodeContent((d) => {
    return `
      <div class="person" style="--color:${d.data.color}">
        <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" />
        <div class="name">${d.data.name}</div>
        <div class="role">${d.data.role || ""}</div>
      </div>
    `;
  })
  .linkUpdate(function(d, i, arr) {
    d3.select(this)
      .attr("stroke", d.data.color);
  })
  .onNodeClick((d) => {
    chart.toggleCollapse(d);
  });

chart.render();
