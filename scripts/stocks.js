let stockChart;

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US');
}

function fetchStockData(ticker, days) {
  const today = new Date();
  const past = new Date(today);
  past.setDate(today.getDate() - days);

  const format = (d) => d.toISOString().split('T')[0];
  const from = format(past);
  const to = format(today);

  const apiKey = 'YOUR_POLYGON_API_KEY'; // 🔁 Replace this with your real key
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) throw new Error("No results");

      const labels = data.results.map(item => formatDate(item.t));
      const prices = data.results.map(item => item.c);

      renderChart(ticker.toUpperCase(), labels, prices);
    })
    .catch(error => {
      console.warn("API failed, using fallback:", error);
      const labels = Array.from({ length: days }, (_, i) => `Day ${i + 1}`);
      const prices = Array.from({ length: days }, () => (Math.random() * 50 + 100).toFixed(2));
      renderChart(ticker.toUpperCase(), labels, prices);
    });
}

function renderChart(ticker, labels, prices) {
  if (stockChart) stockChart.destroy();

  const ctx = document.getElementById('stock-chart').getContext('2d');
  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${ticker} Stock Price`,
        data: prices,
        borderColor: '#007bff',
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

function loadRedditStocks() {
  fetch('https://tradestie.com/api/v1/apps/reddit')
    .then(res => res.json())
    .then(data => {
      const top5 = data.slice(0, 5);
      const tbody = document.querySelector('#reddit-stocks tbody');
      tbody.innerHTML = "";

      top5.forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
          <td>${stock.no_of_comments}</td>
          <td>${stock.sentiment}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error("Failed to load Reddit data:", err);
    });
}

document.getElementById('fetch-stock').addEventListener('click', () => {
  const ticker = document.getElementById('stock-input').value.trim();
  const days = parseInt(document.getElementById('time-range').value);
  if (ticker) {
    fetchStockData(ticker, days);
  }
});

loadRedditStocks();

if (annyang) {
  const commands = {
    'lookup *company': (company) => {
      const map = {
        apple: 'AAPL',
        tesla: 'TSLA',
        amazon: 'AMZN',
        microsoft: 'MSFT',
        google: 'GOOGL'
      };
      const ticker = map[company.toLowerCase()] || company.toUpperCase();
      fetchStockData(ticker, 30);
    },
    'navigate to home': () => window.location.href = 'home.html',
    'navigate to dogs': () => window.location.href = 'dogs.html'
  };

  annyang.addCommands(commands);
  document.getElementById('enable-audio').addEventListener('click', () => annyang.start());
  document.getElementById('disable-audio').addEventListener('click', () => annyang.abort());
}
