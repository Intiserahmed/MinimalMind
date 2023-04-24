document.addEventListener("DOMContentLoaded", function () {
    const screenTimeTableBody = document.getElementById("screenTimeTable").getElementsByTagName("tbody")[0];
    const dailyGoalInput = document.getElementById("dailyGoalInput");
    const setGoalButton = document.getElementById("setGoalButton");
    const goalProgress = document.getElementById("goalProgress");

    async function displayScreenTimeData() {
        const { screenTimeData } = await browser.storage.local.get("screenTimeData");
        const today = new Date().toISOString().slice(0, 10);
        const todaysData = screenTimeData && screenTimeData[today] ? screenTimeData[today] : {};

        if (Object.keys(todaysData).length > 0) {
            let screenTimeList = "";
            for (const domain in todaysData) {
                const timeSpent = todaysData[domain];
                screenTimeList += `<li class="list-group-item d-flex justify-content-between align-items-center">
                    ${domain}
                    <span class="badge bg-primary rounded-pill">${timeSpent} min</span>
                </li>`;
            }
            screenTimeDisplay.innerHTML = screenTimeList;
        } else {
            screenTimeDisplay.innerHTML = '<li class="list-group-item">No screen time data for today.</li>';
        }
    }

    function displayGoalProgress(goal, progress) {
        goalProgress.textContent = `Goal: ${goal} min, Progress: ${progress} min`;
    }

    browser.storage.local.get(["dailyGoal", "goalProgress"], ({ dailyGoal, goalProgress: storedProgress }) => {
        if (dailyGoal) {
            dailyGoalInput.value = dailyGoal;
            displayGoalProgress(dailyGoal, storedProgress || 0);
        }
    });

    async function updateGoalProgress() {
        const { dailyGoal, screenTimeData } = await browser.storage.local.get(["dailyGoal", "screenTimeData"]);
        if (dailyGoal && screenTimeData) {
            const today = new Date().toISOString().slice(0, 10);
            const todaysTotalTime = screenTimeData[today] ? Object.values(screenTimeData[today]).reduce((a, b) => a + b, 0) : 0;
            const progressPercentage = Math.min((todaysTotalTime / dailyGoal) * 100, 100);

            goalProgress.innerHTML = `
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${progressPercentage}%;" aria-valuenow="${progressPercentage}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="text-center">${todaysTotalTime} / ${dailyGoal} min</p>
            `;
        } else {
            goalProgress.innerHTML = "";
        }
    }

    setGoalButton.addEventListener("click", async () => {
        const dailyGoal = parseInt(dailyGoalInput.value);
        if (dailyGoal > 0) {
            await browser.storage.local.set({ dailyGoal });
            updateGoalProgress();
        }
    });

    const minimalistModeToggle = document.getElementById("minimalistModeToggle");

    minimalistModeToggle.addEventListener("change", async () => {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (minimalistModeToggle.checked) {
            browser.tabs.sendMessage(tabs[0].id, { action: "enableMinimalistMode" });
        } else {
            browser.tabs.sendMessage(tabs[0].id, { action: "disableMinimalistMode" });
        }
    });

    updateGoalProgress();
    displayScreenTime();

});

