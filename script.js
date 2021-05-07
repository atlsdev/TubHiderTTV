window.onload = load();
window.onpageshow = load();
window.onpagehide = load();
window.onhashchange = load();

const log = (...msg) => console.log("[THOT HIDER]",...msg);

var blacklist;

function load() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            blacklist = JSON.parse(this.responseText);
        }
    };
    xhr.open("GET", "https://raw.githubusercontent.com/atlsdev/ThotHiderTTV/master/blacklist.json", true);
    xhr.send();
    waitForSelector("div[data-target=\"directory-container\"]").then(() => {
        const directory = document.querySelector("div[data-target=\"directory-container\"] > .ScTower-sc-1dei8tr-0");
        const observer = new MutationObserver((mutations) => {
            hide();
        });

        observer.observe(directory, {
            childList: true
        });
        hide();
    });
};

function hide() {
    var potentialThots = document.querySelectorAll("a[data-test-selector=\"ChannelLink\"]");
    for (let i = 0; i < potentialThots.length; i++) {
        const thot = potentialThots[i];
        if(blacklist.includes(thot.innerHTML.toLowerCase())) {
            log("Thot has been found!",thot.innerHTML,"begone!");
            var el = thot.closest("[data-target]").parentElement;
            el.parentNode.removeChild(el);
        }
    }
};

async function waitForSelector(selector, opts = {}) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        const mutObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                const nodes = Array.from(mutation.addedNodes);
                for (const node of nodes) {
                    if (node.matches && node.matches(selector)) {
                        mutObserver.disconnect();
                        resolve(node);
                        return;
                    }
                }
            }
        });

        mutObserver.observe(document.documentElement, { childList: true, subtree: true })
        if (opts.timeout) {
            setTimeout(() => {
                mutObserver.disconnect();
                if (opts.optional) {
                    resolve(null);
                } else {
                    reject(new Error(`Timeout exceeded while waiting for selector ("${selector}").`));
                }
            }, opts.timeout);
        }
    });
};