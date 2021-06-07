import { makeTimeout } from './utils.js'

class TabRunner {
  constructor (tabId) {
    this.tabId = tabId
  }

  async runActions (actions) {
    let result
    for (const action of actions) {
      await this.runAction(action)
    }
    return result
  }

  async runAction (action) {
    const actionCode = this.getActionCode(action)
    return await this.runScript(actionCode)
  }

  async runScript (actionCode) {
    if (actionCode.length === 0) {
      return
    }
    let result
    if (typeof actionCode[0] === 'function') {
      result = await actionCode[0](this)
    } else {
      result = await browser.tabs.executeScript(
        this.tabId, {
          code: actionCode[0]
        })
      result = result[0]
    }
    if (actionCode.length === 1) {
      return result
    }
    return actionCode[1](result)
  }

  getActionCode (action) {
    if (action.fill) {
      return [`document.querySelector('${action.fill.selector}').value = '${action.fill.value}'`]
    } else if (action.event) {
      return [`document.querySelector('${action.event.selector}').dispatchEvent(new Event('${action.event.event}'))`]
    } else if (action.failOnMissing) {
      return [
        `document.querySelector('${action.failOnMissing}') !== null`,
        function (result) {
          if (result === true) {
            return result
          }
          throw new Error(action.failure)
        }
      ]
    } else if (action.wait) {
      return [makeTimeout(action.wait)]
    } else if (action.click) {
      return [`document.querySelector('${action.click}').click()`]
    } else if (action.extract) {
      if (action.getPDF) {
        const pdfIcon = browser.extension.getURL('icons/pdf.svg')
        return [`function addPDFLink (textElements){
                  const sessionID = document.querySelector('#session_id').value;
                  const url = new URL(document.querySelector('#detail_form').action);
                  if (sessionID !== undefined && url !== undefined){
                    const docID = url.searchParams.get('sa_docid_for_detail');
                    const rootUrl = window.location.protocol + '//' + window.location.host + window.location.pathname.replace('/base.do', '') + '/'
                    if (docID === undefined)
                    { 
                      return textElements 
                    }  
                    const pdfLInk = rootUrl + 'showPDF.htm?' + docID + '&session=' + sessionID 
                    // unten und oben den Link einfügen
                    // unten und oben den Link einfügen
                    textElements.unshift(pdfLink);
                    textElements.push(pdfLink);
                  }
                  return textElements
                };
                const textElements = Array.from(document.querySelectorAll('#dt_dv_atext')).map(function(el) {
                  return el.outerHTML
                });
              addPDFLink(textElements)`,
        function (result) {
          if (result === null) { result = [] }
          return result
        }]
      } else {
        return [
          `Array.from(document.querySelectorAll('${action.extract}')).map(function(el) {
            return el.outerHTML
          })`]
      }
    }
  }
}

export default TabRunner
