const browser = (typeof chrome !== 'undefined') ? chrome : browser;

async function getTrackedHosts() {
    const defaultHosts = ["facebook.com", "twitter.com", "instagram.com", "youtube.com"];
    const { customDomains } = await browser.storage.local.get("customDomains");
    return customDomains ? [...defaultHosts, ...customDomains] : defaultHosts;
}

async function updateScreenTime(details) {
    const { tabId, url } = details;

    // Get the base domain from the URL
    const baseDomain = new URL(url).hostname.split(".").slice(-2).join(".");

    const trackedHosts = await getTrackedHosts();
    if (trackedHosts.includes(baseDomain)) {
        const today = new Date().toISOString().slice(0, 10);

        // Get stored screen time data
        const { screenTimeData } = await browser.storage.local.get("screenTimeData");

        // Update screen time for the current domain
        const updatedScreenTimeData = { ...screenTimeData };
        if (!updatedScreenTimeData[today]) {
            updatedScreenTimeData[today] = {};
        }
        if (!updatedScreenTimeData[today][baseDomain]) {
            updatedScreenTimeData[today][baseDomain] = 0;
        }
        updatedScreenTimeData[today][baseDomain] += 1;

        // Store the updated screen time data
        await browser.storage.local.set({ screenTimeData: updatedScreenTimeData });
    }
}

chrome.webRequest.onCompleted.addListener((details) => {
    updateScreenTime(details).catch((error) => console.error("Error in updateScreenTime:", error));
}, { urls: ["<all_urls>"] });
