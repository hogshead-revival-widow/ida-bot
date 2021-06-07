import { DEFAULT_URL } from './const.js'
import { MSG_LOGIN_SELECTION, MSG_LOGIN_ACCESS } from './ui.js'

export default {
  'S-PAN': {
    name: 'Pressearchiv',
    web: DEFAULT_URL,
    loginHint: null,
    params: {
      pan: null
    },
    login: [
      [
        { message: MSG_LOGIN_SELECTION },
        { click: '#content a[href*="100"]' }
      ],
      [
        { message: MSG_LOGIN_ACCESS },
        { click: '.logon_gast .logon_anmeldebutton a' }
      ]
    ]
  }
}
