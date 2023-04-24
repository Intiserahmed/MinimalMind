async function createScreenTimeChart(screenTimeData) {
    const labels = Object.keys(screenTimeData);
    const data = Object.values(screenTimeData);

    const ctx = document.getElementById("screenTimeChart").getContext("2d");

    const chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Screen Time (min)",
                    data: data,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

browser.storage.local.get("screenTimeData", ({ screenTimeData }) => {
    if (screenTimeData) {
        createScreenTimeChart(screenTimeData);
    }
});              