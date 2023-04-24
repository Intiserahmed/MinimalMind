const browser = typeof chrome !== 'undefined' ? chrome : browser;
const distractingElementsSelectors = [
    // Add CSS selectors for distracting elements on websites, such as sidebars, ads, or popups
    ".sidebar",
    ".ad",
    "#popup",
];

function applyMinimalistMode() {
    distractingElementsSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements) {
            elements.forEach((element) => {
                element.style.display = "none";
            });
        }
    });
}

function disableMinimalistMode() {
    distractingElementsSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements) {
            elements.forEach((element) => {
                element.style.display = "";
            });
        }
    });
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action === "enableMinimalistMode") {
        applyMinimalistMode();
    } else if (message.action === "disableMinimalistMode") {
        disableMinimalistMode();
    }
});
