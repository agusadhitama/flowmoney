// ===============================
// FLOWMONEY ADVANCED SCRIPT
// by Agus Satria Adhitama
// ===============================

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ===============================
// FORMAT RUPIAH
// ===============================
function formatRupiah(number) {
  return "Rp " + number.toLocaleString("id-ID");
}

// ===============================
// ADD TRANSACTION
// ===============================
function addTransaction() {
  const desc = document.getElementById("desc").value.trim();
  const amount = parseInt(document.getElementById("amount").value);
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if (!desc || isNaN(amount)) {
    showNotif("Isi semua field!", "warning");
    return;
  }

  const transaction = {
    id: Date.now(),
    desc,
    amount: type === "expense" ? -amount : amount,
    category,
    date: new Date().toLocaleString()
  };

  transactions.push(transaction);
  saveData();
  render();
  showNotif("Transaksi berhasil ditambahkan!", "success");

  clearForm();
}

// ===============================
// CLEAR FORM
// ===============================
function clearForm() {
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

// ===============================
// SAVE DATA
// ===============================
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ===============================
// RENDER
// ===============================
function render() {
  const list = document.getElementById("list");
  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");

  list.innerHTML = "";

  let total = 0, income = 0, expense = 0;

  transactions.slice().reverse().forEach(t => {
    total += t.amount;
    if (t.amount > 0) income += t.amount;
    else expense += t.amount;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${t.desc} (${t.category})</span>
      <span>${formatRupiah(t.amount)}</span>
    `;

    li.onclick = () => openModal(t);

    li.style.animation = "fadeIn 0.3s ease";

    list.appendChild(li);
  });

  balanceEl.innerText = formatRupiah(total);
  incomeEl.innerText = formatRupiah(income);
  expenseEl.innerText = formatRupiah(expense);

  updateChart(income, Math.abs(expense));
  smartInsight(income, Math.abs(expense));
}

// ===============================
// CHART.JS
// ===============================
let chart;

function updateChart(income, expense) {
  const ctx = document.getElementById("chart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#fff"
          }
        }
      }
    }
  });
}

// ===============================
// NOTIFICATION
// ===============================
function showNotif(message, type) {
  const notifBox = document.querySelector(".notifications");

  const div = document.createElement("div");
  div.className = `notif ${type}`;
  div.innerText = message;

  notifBox.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

// ===============================
// SMART INSIGHT
// ===============================
function smartInsight(income, expense) {
  if (expense > income) {
    showNotif("⚠️ Pengeluaran lebih besar dari pemasukan!", "warning");
  }

  if (income > expense * 2) {
    showNotif("🔥 Keuangan sehat! Keep it up!", "success");
  }
}

// ===============================
// MODAL
// ===============================
const modal = document.getElementById("modal");
const modalData = document.getElementById("modal-data");
const closeBtn = document.querySelector(".close");

function openModal(t) {
  modal.style.display = "block";
  modalData.innerHTML = `
    <strong>${t.desc}</strong><br>
    Kategori: ${t.category}<br>
    Jumlah: ${formatRupiah(t.amount)}<br>
    Tanggal: ${t.date}
  `;
}

closeBtn.onclick = () => modal.style.display = "none";

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// ===============================
// SEARCH FILTER (BONUS)
// ===============================
const searchInput = document.createElement("input");
searchInput.placeholder = "🔍 Search...";
searchInput.style.marginBottom = "10px";

document.querySelector(".transactions").prepend(searchInput);

searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();

  document.querySelectorAll("#list li").forEach(li => {
    li.style.display = li.innerText.toLowerCase().includes(keyword)
      ? "flex"
      : "none";
  });
});

// ===============================
// RANDOM QUOTES (UNIQUE FEATURE)
// ===============================
const quotes = [
  "Money grows when you manage it wisely",
  "Small savings today, big future tomorrow",
  "Discipline beats impulse spending",
  "Track it. Control it. Own it."
];

function showRandomQuote() {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  const div = document.createElement("div");
  div.className = "notif info";
  div.innerText = quote;

  document.querySelector(".notifications").appendChild(div);

  setTimeout(() => div.remove(), 4000);
}

// ===============================
// INIT
// ===============================
render();
setInterval(showRandomQuote, 15000);

// ===============================
// ANIMATION STYLE INJECT (CSS via JS)
// ===============================
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);