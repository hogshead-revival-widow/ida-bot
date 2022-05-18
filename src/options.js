

const defaults = {
    installDate: null,
};

function restore() {
    browser.storage.sync.get(defaults).then(function (items) {
        if (items.installDate === null) {
            // first run
            browser.storage.sync.set({
                installDate: new Date().getTime(),
            });
        }
    });

    window
        .fetch('/manifest.json')
        .then((response) => response.json())
        .then((data) => {
            const domains = data.content_scripts[0].matches.map((url) =>
                url
                    .replace('https://', '')
                    .replace('*://', '')
                    .replace('http://', '')
                    .replace('/*', '')
            );
            const ul = document.getElementById('newssites');
            domains.forEach((domain) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.setAttribute('href', 'https://' + domain);
                a.setAttribute('target', 'new');
                a.innerText = domain;
                li.append(a);
                ul.appendChild(li);
            });
        });
}


document.addEventListener('DOMContentLoaded', restore);
