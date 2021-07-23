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
      console.log('runScript (in tabrunner):', result)
    }
    if (actionCode.length === 1) {
      return result
    }
    return actionCode[1](result)
  }

  getActionCode (action) {
    if (action.resetPan){
      return [`location.href='?sa_suchmodus=SUCHE_EINFACH&amp;sa_current_aktion=retrieveCTRL__REFRESH'`]
    }else if (action.fill) {
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
      if (action.optional) {
        return [`var el = document.querySelector('${action.click}'); el && el.click()`]
      } else {
        return [`document.querySelector('${action.click}').click()`]
      }
    } else if (action.extract) {
      return [`function getPDFUrl (){
        const sessionID = document.querySelector('#session_id').value;
        const url = new URL(document.querySelector('#detail_form').action);
        if (sessionID !== undefined && url !== undefined){
          const docID = url.searchParams.get('sa_docid_for_detail');
          const rootUrl = window.location.protocol + '//' + window.location.host + window.location.pathname.replace('/base.do', '') + '/'
          if (docID === undefined)
          { 
            return 
          }  
          const pdfURL = rootUrl + 'showPDF.htm?sa_archiv=T&sa_service=../../../../BC/zat_pdf_handler&sa_docid=' + docID + '&sa_pdf_type=PDF-DETAI&sa_display_pagepdf=&sa_session=' + sessionID + '&sa_application=zat_web_text2'
          return pdfURL
        } else {
          return
        }
      };
      function getText(){
        const article = document.querySelector('#dt_dv_atext').innerHTML;
        function excludeCopyright(el){
          if(! el.innerText.startsWith('Nur für internen Gebrauch')){ 
          return el.outerHTML
          }
        }
        
        return Array.from(document.querySelectorAll('p')).map(excludeCopyright).join('').replace('</span>', '').replace('<span class="highlighted">','')
      };
      function getArticle(){
        const text = {
          text: getText(), 
          pdfURL: getPDFUrl()

        }
        return [text] 
      };
      getArticle();
      `] 
    }
  }
}

export default TabRunner
