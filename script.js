const USERNAME_SEL = "[data-test-selector=\"ChannelLink\"]";
// const BL_URL = "https://raw.githubusercontent.com/atlsdev/ThotHiderTTV/master/blacklist.json";
const BL_URL = "https://cdn.jsdelivr.net/gh/atlsdev/ThotHiderTTV/blacklist.json";

window.onload = load();

const log = (...msg) => console.log("[THOT HIDER]",...msg);

function load() {
    if(window.blacklist === undefined || window.blacklist === null) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.blacklist = JSON.parse(this.responseText);
                waitFor(`div[data-target="directory-first-item"]`).then(() => {
                    var channels = document.querySelectorAll(USERNAME_SEL);
                    channels.forEach((channel) => hide(channel));
                    new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if(mutation.addedNodes.length > 0) {
                                channels = document.querySelectorAll(USERNAME_SEL);
                                channels.forEach((channel) => hide(channel));
                            }
                        });
                    }).observe(document.querySelector(".hRbnOC"), { childList: true });
                });
            }
        };
        xhr.open("GET", BL_URL, true);
        xhr.send();
    }
};

function hide(node) {
    if(window.blacklist.includes(node.innerHTML.toLowerCase())) {
        log(`Thot Found! Deleted "${node.innerHTML}" from existence.`);
        node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
    }
};

function waitFor(selector) {
    return new Promise(function (res, rej) {
        waitForElementToDisplay(selector, 200);
        function waitForElementToDisplay(selector, time) {
            if (document.querySelector(selector) != null) {
                res(document.querySelector(selector));
            }
            else {
                setTimeout(function () {
                    waitForElementToDisplay(selector, time);
                }, time);
            }
        }
    });
};