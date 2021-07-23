import { DEFAULT_URL, FALLBACK_URL, INFO_FAILED_TO_FIND_CONTENT } from './const.js'
import { MSG_START_SEARCH, MSG_CLEAN_UP, MSG_ARTICLE, MSG_WAIT, MSG_INTERACTION_SSO } from './ui.js'

/* Achtung, Unterschiede bei Weiterleitungen für Firefox:

Unten nach Action, die mit "click: '#retr_buttonSuchen'" abschließt
und vor Action, die mit MSG_ARTICLE beginnt, Wartezeit hinzufügen:

       .... 
        { click: '#retr_datumZuruecksetzen' },
          { click: '#retr_buttonSuchen' }
        ],
        [
          { wait: 600000} /// Warten auf Weiterleitungen, nur Firefox
        ],
        [
          { message: MSG_ARTICLE },
          { click: '.sh_a_hit_access_ok' },
          { failOnMissing: '.sh_a_hit_access_ok', failure: INFO_FAILED_TO_FIND_CONTENT }
        ],
       .... 


*/ 


export default {
    'pan': {
      loggedIn: '#retr_buttonSuchen',
      start: DEFAULT_URL,
      defaultParams: {
        domain: DEFAULT_URL
      },
      login: [
          [
            { message: MSG_WAIT},
            { wait: 600000} // Wird abgebrochen, sobald `loggedIn`gefunden; Zeit für die ganzen Umleitungen
          ]
      ],
      search: [
        [
          { message: MSG_CLEAN_UP },
          { resetPan: true}
        ],
        [
          { message: MSG_START_SEARCH },
          { fill: { selector: '#retr_std_inp_sbegr', isQuery: true } },
          { fill: { selector: '#retr_inp_quell', isSource: true } },
          { click: '#id_verknuep_phrase'},
          // ohne Datumsbeschränkung suchen, Voreinstellung: 1 Jahr
          { click: '#retr_datumZuruecksetzen' },
          { click: '#retr_buttonSuchen' }
        ],
        [
          { message: MSG_ARTICLE },
          { click: '.sh_a_hit_access_ok' },
          { failOnMissing: '.sh_a_hit_access_ok', failure: INFO_FAILED_TO_FIND_CONTENT }
        ],
  
        [
          { wait: 1000},
          { extract: '#dt_dv_atext' }
        ]
      ]
    },
    'fallback': {
      loggedIn: '#retr_buttonSuchen',
      start: FALLBACK_URL,
      defaultParams: {
        domain: FALLBACK_URL
      },
      login: [
        [
          { message: MSG_INTERACTION_SSO},
          { wait: 600000} // Zehn Minuten Zeit für's manuelle Einloggen (wird abgebrochen, wenn Login erfolgreich)
        ],
      ],
      search: [
        [
          { message: MSG_CLEAN_UP },
          { resetPan: true}
        ],
        [
          { message: MSG_START_SEARCH },
          { fill: { selector: '#retr_std_inp_sbegr', isQuery: true } },
          { fill: { selector: '#retr_inp_quell', isSource: true } },
          { click: '#id_verknuep_phrase'},
          // ohne Datumsbeschränkung suchen, Voreinstellung: 1 Jahr
          { click: '#retr_datumZuruecksetzen' },
          { click: '#retr_buttonSuchen' }
        ],
        [
          { message: MSG_ARTICLE },
          { failOnMissing: '.sh_a_hit_access_ok', failure: INFO_FAILED_TO_FIND_CONTENT },
          { click: '.sh_a_hit_access_ok' }
        ],
        [
          { extract: '#dt_dv_atext' }
        ]
      ]
  }
}
