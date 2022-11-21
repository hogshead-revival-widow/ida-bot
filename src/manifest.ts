/*
    Do not change the manifest here.

    Instead, change it in `config.json`.
    Cf. `examples/config.jsonc` for more information.
*/

import { ManifestV3 } from 'rollup-plugin-chrome-extension';
import config from 'config.json';
import sites from 'src/settings/sites.js';

const matches = Object.values(sites).map((site) => site.match);
const host_permissions = [
    ...config.HOST_PERMISSIONS,
    `*://${new URL(config.URL.HOST).host}/*`,
];
if (config.URL.FALLBACK_HOST !== '')
    host_permissions.push(`*://${new URL(config.URL.FALLBACK_HOST).host}/*`);

const manifest: ManifestV3 = {
    manifest_version: 3,
    name: `${config.NAME} (${config.RFA})`,
    version: config.VERSION,
    description: config.DESCRIPTION,
    homepage_url: config.REPOSITORY,
    icons: { '48': 'icons/bot48.png', '96': 'icons/bot96.png' },
    permissions: ['storage', 'scripting'],
    host_permissions,
    web_accessible_resources: [{ resources: ['css/*', 'icons/*'], matches }],
    background: { service_worker: 'background.ts' },
    content_scripts: [
        {
            matches,
            js: ['content.ts'],
            run_at: 'document_end',
        },
    ],
    options_ui: { open_in_tab: true, page: 'faq/faq.html' },
    action: {
        default_icon: { '19': 'icons/bot19.png', '38': 'icons/bot38.png' },
        default_popup: 'popup/popup.html',
        default_title: config.POPUP_TITLE,
    },
};

export default manifest;
