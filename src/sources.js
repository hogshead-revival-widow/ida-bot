import { DEFAULT_URL } from './const.js'
import {
  MSG_LOGIN_SELECTION, MSG_LOGIN_ACCESS, MSG_START_SEARCH,
  MSG_ARTICLE, MSG_ARTICLE_FAILURE
} from './ui.js'

export default {
  pan: {
    loggedIn: '#retr_std_inp_sbegr',
    start: DEFAULT_URL,
    defaultParams: {
      domain: DEFAULT_URL
    },
    login: [
      [
        { message: MSG_LOGIN_SELECTION },
        { click: '#content a[href*="100"]' }
      ],
      [
        { wait: 600 }
      ],
      [
        { message: MSG_LOGIN_ACCESS },
        { click: '.logon_gast .logon_anmeldebutton a' }
      ]
    ],
    search: [
      [
        { message: MSG_START_SEARCH },
        { click: '#retr_buttonZuruecksetzen' },
        { fill: { selector: '#retr_std_inp_sbegr', isQuery: true } },
        { fill: { selector: '#retr_inp_quell', isSource: true } },
        { click: '#id_verknuep_phrase' },
        // ohne Datumsbeschränkung suchen, Voreinstellung: 1 Jahr
        { click: '#retr_datumZuruecksetzen' },
        { click: '#retr_buttonSuchen' }
      ],
      [
        { message: MSG_ARTICLE },
        { failOnMissing: '.sh_a_hit_access_ok', failure: MSG_ARTICLE_FAILURE },
        { click: '.sh_a_hit_access_ok' }
      ],
      [
        { extract: '#dt_dv_atext', getPDF: true }
      ]
    ]
  }
}
