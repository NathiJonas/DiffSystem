function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const spinner = document.querySelector('.spinner');

    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        if (username === 'teacher' && password === 'password') {
            alert('Login successful!');
            localStorage.setItem("loggedIn", "true"); // This line enables dashboard access
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials, please try again.');
        }
    }, 2000); // Simulate a 2-second loading time
}

function showForgotPasswordForm() {
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.forgot-password-container').style.display = 'block';
}

function requestPasswordReset() {
    const email = document.getElementById('email').value;
    fetch('/request-password-reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error('Error:', error));
}

// --- Dashboard Interactivity ---

let learnersData = [];
let chartInstance = null;

// Check login status
function checkLogin() {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

// Load learners from learners.json
async function loadLearners() {
  const response = await fetch("learners.json");
  learnersData = await response.json();
  renderTable(learnersData);
  renderChart(learnersData);
}

// Render the learners table
function renderTable(data) {
  const tbody = document.querySelector("#learnersTable tbody");
  tbody.innerHTML = "";
  data.forEach((learner) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${learner.id}</td>
      <td contenteditable="true">${learner.name}</td>
      <td contenteditable="true">${learner.grade}</td>
      <td contenteditable="true">${learner.class}</td>
      <td contenteditable="true">${learner.age}</td>
      <td contenteditable="true">${learner.parent_name}</td>
      <td contenteditable="true">${learner.parent_cell}</td>
      <td contenteditable="true">${learner.score_Term_1}</td>
      <td contenteditable="true">${learner.score_Term_2}</td>
      <td contenteditable="true">${learner.score_Term_3}</td>
      <td contenteditable="true">${learner.score_Term_4}</td>
      <td contenteditable="true">${learner.preferred_learning_style}</td>
    `;
    tbody.appendChild(row);
  });

  // Enable live chart update when table data is edited
  tbody.querySelectorAll("td[contenteditable='true']").forEach(cell => {
    cell.addEventListener('input', updateChartFromTable);
  });
}

// Filter table based on search and style
function filterTable() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const style = document.getElementById("styleFilter").value;
  const filtered = learnersData.filter(l =>
    l.name.toLowerCase().includes(search) &&
    (style === "" || l.preferred_learning_style === style)
  );
  renderTable(filtered);
  renderChart(filtered);
}

// Save table edits to localStorage
function saveEdits() {
  const rows = document.querySelectorAll("#learnersTable tbody tr");
  const editedData = [];
  rows.forEach(row => {
    const cells = row.querySelectorAll("td");
    editedData.push({
      id: cells[0].textContent.trim(),
      name: cells[1].textContent.trim(),
      grade: cells[2].textContent.trim(),
      class: cells[3].textContent.trim(),
      age: parseInt(cells[4].textContent.trim()),
      parent_name: cells[5].textContent.trim(),
      parent_cell: cells[6].textContent.trim(),
      score_Term_1: parseInt(cells[7].textContent.trim()),
      score_Term_2: parseInt(cells[8].textContent.trim()),
      score_Term_3: parseInt(cells[9].textContent.trim()),
      score_Term_4: parseInt(cells[10].textContent.trim()),
      preferred_learning_style: cells[11].textContent.trim()
    });
  });
  localStorage.setItem("learnersEdited", JSON.stringify(editedData));
  alert("Edits saved locally. To persist in DB, backend update required.");
  renderChart(editedData);
}

// Chart.js: Show distribution of learning styles
function renderChart(data) {
  const ctx = document.getElementById('styleChart').getContext('2d');
  // Count styles
  const styleCounts = { Term 1: 0, Term 2: 0, Term 3: 0, Term 4: 0 };
  data.forEach(l => {
    if (styleCounts[l.preferred_learning_style] !== undefined) {
      styleCounts[l.preferred_learning_style]++;
    }
  });
  // Remove old chart
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(styleCounts),
      datasets: [{
        label: '# of Learners',
        data: Object.values(styleCounts),
        backgroundColor: ['#4bc0c0', '#ff6384', '#ffcd56', '#36a2eb']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Live update chart when editing table
function updateChartFromTable() {
  saveEdits(); // This calls renderChart with edited data
}

// --- End Dashboard Interactivity ---
