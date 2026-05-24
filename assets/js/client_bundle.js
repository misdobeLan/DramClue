// ===================================================
// client_bundle.js - The main controller and UI logic (Simulates main.js/components.js)
// ===================================================

/**
 * @function fetchAndRender
 * Responsible for fetching all necessary data from the /api/data endpoint
 * and triggering component rendering across the page.
 */
async function fetchAndRender() {
    console.log("Client: Starting data fetch and component rendering.");
    try {
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // 1. Update Metrics Grid
        updateMetricsGrid(data.market);

        // 2. Update Charts
        renderInsightChart(data.insights);
        renderPriceChart(data.market);

        // 3. Update Holdings Table
        updateHoldingsTable(data.etf);

        // 4. Update News Feed
        updateNewsFeed(data.insights);

        console.log("Client: All components successfully updated.");

    } catch (error) {
        console.error("Error during data fetching or rendering:", error);
        alert("数据加载失败：" + error.message);
    }
}


/**
 * @function updateMetricsGrid
 * Populates the Key Quantitative Metrics grid.
 * @param {object} marketData - The data structure from the /api/data endpoint.
 */
function updateMetricsGrid(marketData) {
    // Select all metric containers
    const elements = document.querySelectorAll('#metrics-grid h2');

    // Example: Update Price
    const priceElement = document.getElementById('price');
    if (priceElement) {
        priceElement.textContent = `$${marketData.price.toFixed(2)}`;
    }
    // ... (similar updates for NAV, YTD, etc.)
}

/**
 * @function renderInsightChart
 * Renders the sophisticated Scatter Plot for thesis visualization.
 * @param {Array} insights - Array of insight objects.
 */
function renderInsightChart(insights) {
    const ctx = document.getElementById('insightChart').getContext('2d');

    // Logic to transform insights into (X, Y, Z) points for the chart
    // Simplified for placeholder
    const datasets = [{
        label: '观点演化',
        data: [
            {x: new Date(), y: 85, sentiment: 'Bullish'},
            {x: new Date(Date.now() - 86400000), y: 70, sentiment: 'Neutral'}
        ]
    }];

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: '观点演化气泡图' } },
            scales: {
                x: { type: 'time', time: { unit: 'day' } },
                y: { beginAtZero: true, title: { display: true, text: '置信度' } }
            }
        }
    });
}

/**
 * @function renderPriceChart
 * Renders the standard Line Chart for price movement.
 * @param {object} marketData - The data structure from the /api/data endpoint.
 */
function renderPriceChart(marketData) {
    const ctx = document.getElementById('priceChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['本周初', '本周中', '今日'], // Placeholder labels
            datasets: [{
                label: '价格走势',
                data: [
                    110,
                    115,
                    marketData.price // Use the live data directly
                ], // Use the live data
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: { display: true, text: '价格走势图' }
        }
    });
}

/**
 * @function updateHoldingsTable
 * Updates the detailed ETF holdings table.
 * @param {object} etfData - The core ETF metadata.
 */
function updateHoldingsTable(etfData) {
    const tableBody = document.getElementById('holdings-table').querySelector('tbody');
    if (!tableBody) return;

    // Assuming the etfData has a 'holdings' array defined
    const holdings = [
        {ticker: 'AAPL', weight: '25%', performance: 'success'},
        {ticker: 'MSFT', weight: '20%', performance: 'success'},
        {ticker: 'GOOGL', weight: '15%', performance: 'danger'}
    ];

    tableBody.innerHTML = '';
    holdings.forEach(holding => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${holding.ticker}</td><td>${holding.weight}</td><td class="text-${holding.performance}">上涨/下跌</td>`;
        tableBody.appendChild(row);
    });
}

/**
 * @function updateNewsFeed
 * Dynamically updates the individual news/insight cards.
 * @param {Array} insights - Array of insight objects.
 */
function updateNewsFeed(insights) {
    const container = document.getElementById('news-feed-list');
    if (!container) return;

    container.innerHTML = '';
    insights.forEach(insight => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title text-primary">观点: ${insight.type}</h5>
                    <p class="card-text">${insight.thesis}</p>
                    <small class="text-muted">发布时间: ${insight.timestamp}</small>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}
