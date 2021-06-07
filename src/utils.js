const ident = (x) => x

function interpolate (str, params, prefix = '', converter = ident, fallback = '') {
  if (prefix.length > 0) {
    prefix = `${prefix}.`
  }
  for (const key in params) {
    str = str.replace(
      new RegExp(`{${prefix}${key}}`),
      converter(params[key] || fallback)
    )
  }
  return str
}

function makeTimeout (ms) {
  return function timeout () {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

async function handleIsReachable (window, url, handleFunction) {
  window.fetch(url, { mode: 'no-cors' })
    .then(response => { handleFunction(true) })
    .catch(error => { console.log(error); handleFunction(false) })
}

export {
  interpolate,
  makeTimeout,
  handleIsReachable
}
