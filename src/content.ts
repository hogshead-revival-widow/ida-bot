import sites from 'src/settings/sites.js';
import sources from 'src/settings/source.js';
import SiteBot from 'src/lib/sitebot.js';
import { assertNonNullish } from './lib/utils/utils.js';

const activate = (
    site: Site,
    defaultSource = sources.source,
    fallbackSource = sources.fallback
) => {
    const siteBot = new SiteBot(site, document, defaultSource, fallbackSource);
    const waitOnLoad =
        siteBot.site.waitOnLoad !== undefined && siteBot.site.waitOnLoad === true;
    const documentIsReady = document.readyState === 'complete';

    if (!waitOnLoad || documentIsReady) return siteBot.start();
    window.addEventListener('load', () => siteBot.start());
};

const site = sites.find((site) => site.match.includes(document.location.host));
if (site !== undefined) activate(site);
