/*
    Bitte beachten:
        * Vor ihrer Ausführung werden Injektionen seitens Chrome
        serialisiert und dann deserialisiert.
        * Das bedeutet, dass jeder Ausführungskontext verloren geht.
            * Auch Fehler werden nicht als Instanzen von `Error` zurückgegeben.

    Mehr Informationen: https://developer.chrome.com/docs/extensions/reference/scripting/
*/

import extractId from 'src/lib/injection/extract.js';
import followLink from 'src/lib/injection//followLink.js';
import isPresent from 'src/lib/injection//isPresent.js';

export default { isPresent, followLink, extractId };
