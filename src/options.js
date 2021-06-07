import { DEFAULT_PROVIDER, DEFAULT_URL } from './const.js'
import { handleIsReachable } from './utils.js'

const defaults = {
  installDate: null,
  provider: DEFAULT_PROVIDER
}

function restore () {
  browser.storage.sync.get(defaults).then(function (items) {
    if (items.installDate === null) {
      // first run
      browser.storage.sync.set({
        installDate: new Date().getTime()
      })
      browser.storage.sync.set({
        provider: DEFAULT_PROVIDER
      })
    }
  })

  handleIsReachable(window, DEFAULT_URL, function (isReachable) {
    const statusEle = document.querySelector('#verbindung')
    if (!isReachable) {
      statusEle.classList.remove('is-success')
      statusEle.classList.add('is-danger')
      statusEle.innerText = 'offline'
    } else {
      statusEle.classList.remove('is-danger')
      statusEle.classList.add('is-success')
      statusEle.innerText = 'online'
    }
  })

  window.fetch('/manifest.json').then(response => response.json())
    .then(data => {
      const domains = data.content_scripts[0].matches.map(url => url.replace('https://', '').replace('http://', '').replace('/*', ''))
      const ul = document.getElementById('newssites')
      domains.forEach(domain => {
        const li = document.createElement('li')
        li.innerText = domain
        ul.appendChild(li)
      })
    })
}

document.addEventListener('DOMContentLoaded', restore)
