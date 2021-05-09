const USERNAME_SEL = "[data-test-selector=\"ChannelLink\"]";
const BL_URL = "https://raw.githubusercontent.com/atlsdev/TubHiderTTV/master/blacklist.json";

window.onload = load();
var curHref = location.href;

const log = (...msg) => console.log("[TUB HIDER]",...msg);

function load() {
    var hasScrolled = false;
    new MutationObserver(mutations => {
        mutations.forEach(() => {
            if(curHref !== location.href) {
                curHref = location.href;
                load();
            }
        });
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
    if(window.blacklist === undefined || window.blacklist === null) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                window.blacklist = JSON.parse(this.responseText);
            }
        };
        xhr.open("GET", BL_URL, true);
        xhr.send();
    }
    waitFor(`.online-friends`).then(() => {
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
};

function hide(node) {
    if(window.blacklist.includes(node.innerHTML.toLowerCase())) {
        log(`Tubber Found! Deleted "${node.innerHTML}" from existence.`);
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
