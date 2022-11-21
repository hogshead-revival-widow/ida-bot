IDA-Bot erlaubt prototypisch die Teilautomatisierung des Suchvorgangs nach korrespondierenden Volltexten deutscher Medienseiten im Archiv. Der Suchvorgang muss initial je durch die Nutzer:in ausgelöst werden.

# Überblick

Einen Überblick über den Programmablauf findest Du [hier](#programmablauf-schema). Zudem sind die [Beispieldateien](examples/) ausführlich kommentiert.

# Entwicklung

1. Klone das Repo.
2. CD in das Verzeichnis.
3. Installiere die Pakete: `npm i`. [Dazu muss npm und Node.js installiert sein.](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
4. Passe die Konfiguration ggf. an, entsprechend der Anleitungen der Dateien in [`examples`](examples/) und kopiere die angepassten Dateien entsprechend der dort angegebenen Pfadangaben in das richtige Verzeichnis.
5. Bau die Browserweiterung: `npm run dev`.
    - Das Skript bleibt aktiv, da die Browserweiterung bei Veränderungen automatisch aktualisiert wird ([mehr dazu](https://www.extend-chrome.dev/rollup-plugin)).
6. Die gebauten Dateien findest du in `build/`.
    - Du kannst sie zum Testen mit Chrome als entpackte Erweiterung unter `chrome://extensions` laden. [Dazu musst Du ggf. vorab den Chrome-Developer-Modus aktivieren (Schieberegler betätigen)](https://support.google.com/chrome/a/answer/2714278?hl=en).
    - Der Reloader ist recht simpel; prüfe bei Problemen, ob er hängen geblieben ist, indem Du dir die Ausgabe von `npm run dev`ansiehst. Bleibt er hängen, musst Du ihn händisch abbrechen (`STRG-C`) und wieder neu mit `npm run dev` starten.

Willst Du später deine fertige Version verteilen, solltest Du sie mit `npm run bundle` (ruft `bundle.sh` auf) bauen. Dort ist sowohl das Logging deaktiviert als auch der Reloader. Die Releaseversion findest Du in `bundle/`; die dortige `bot.zip` kann schließlich in den Chrome Web Store hochgeladen werden.

## Logging

-   Beachte: Für `npm run dev` ist das Log aktiviert, für `npm run build` bzw. `npm run bundle` nicht. Vgl. für Details: [`src/lib/utils/logger.ts`](src/lib/utils/logger.ts).
-   Du kannst das Logging-Verhalten über die Umgebungsvariable `LOGGING` ändern (in den Run-Skripten in [package.json](package.json))); hat sie den Wert `on`, wird in die Konsole geloggt, andernfalls wird das Logging deaktiviert.
-   Die nützlichsten Informationen sind im Log des **Serviceworkers** zu finden (`chrome://extensions`, Klick auf "Serviceworker").

# Konfiguration

## Allgemeine Einstellungen

Allgemeine Einstellungen können in der [Konfigurationsdatei](src/settings/config.json) vorgenommen werden. Aus dieser wird auch das Manifest generiert, daher ist eine Manipulation der Manifest-Dateien in aller Regel nicht nötig.

## Seite anpassen/hinzufügen

Seiten hinzufügen wurde stark vereinfacht und ist in drei Schritten möglich. Unter _Seite/site_ wird dabei eine Website verstanden, die einen Artikel besitzt, von dem ein Query extrahiert werden soll.

1. Trage deine Seite in [`src/settings/sites.ts`](examples/site.ts) ein.

    - Diese Datei existiert bei Neuinstallation nicht. [Hier](examples/site.ts) findest Du eine ausführlich kommentierte Beispielseite.
    - Ein zusätzlicher Eintrag im Manifest ist nicht mehr nötig. Die neue Seite wird _automatisch im Manifest aufgenommen_.
    - Nützlich: [Hier unter `Site`](src/lib/globals/types.d.ts) findest Du den korrespondierenden Typen.

2. Passe ggf. die Versionsnummer in der [`src/settings/config.json` unter `VERSION`](examples/config.jsonc) an.

    - Die Konfigurationsdatei existiert bei Neuinstallation nicht. [Hier](examples/config.jsonc) findest Du eine ausführlich kommentierte Beispiel-Konfiguration.
    - Diese wird ebenfalls automatisch ins Manifest übernommen.

3. Bau die Produktivversion mit `npm run bundle`.

    - In `bundle/` findest Du nun die gebaute, entpackte Produktivversion der Erweiterung selbst (zum ggf. Testen vor Release)
    - Zusätzlich findest Du ebenfalls in `bundle/` eine ZIP-Datei zum Verteilen (kann so direkt z. B. in den Chrome Web Store hochgeladen werden)

## Quelle anpassen/hinzufügen

Das Abrufverhalten kann in der Datei [`src/settings/source.ts`](examples/source.ts) geändert werden. Unter _Quelle_ bzw _source_ wird dabei das Archiv verstanden, in dem
auf Basis des von der _Site_ extrahierten Querys nach weiteren Informationen gefragt wird. Die Source-Datei existiert bei Neuinstallation nicht. [Hier](examples/source.ts) findest Du eine ausführlich kommentierte Beispiel-Source-Datei.

Das Abrufverhalten ist vollständig in der [`src/settings/source.ts`](examples/source.ts) konfigurierbar. Weitere Informationen zu Anpassungsmöglichkeiten finden sich in der [Beispieldatei](examples/source.ts), dort sind auch die verfügbaren Aktionen sowie Umgangsweisen mit Fehlern dokumentiert.

Weitere Informationen:

-   [Hier unter `Source`](src/lib/globals/types.d.ts) findest Du den korrespondierenden Typen
-   [Und hier](src/lib/injection/) alle injizierbaren Aktionen.
-   Aktionen können bei Fehlern auf Wunsch wiederholt werden; vgl. dazu ebenfalls die [Source-Beispieldatei](src/settings/sources.ts)

## Weitere Einstellungen

-   Angezeigte Texte: Alle angezeigten Texte können in `src/lib/settings/strings.ts` geändert werden. Die Datei existiert nicht bei Neuinstallation und kann nach diesem [ausführlich kommentierten Beispiel](examples/strings.ts) angelegt werden. Tiefgreifende Änderungen können zudem in an den [Templates](src/lib/ui/templates/) vorgenommen werden.
-   Layout: Passe [Bulma](https://bulma.io/) nach deinen Vorstellungen an und ersetze die Datei `src/css/bulma.min.css` durch die von dir generierte.
-   Retrieval: Die eigentliche Retrieval-Logik findet sich in der Datei [`src/lib/sourcebot.ts`](src/lib/sourcebot.ts) in der SourceBot-Methode `_getRetrievalURL`. Sie wird sinnvollerweise am besten über die die [Konfigurationsdatei](#allgemeine-einstellungen) geändert.
-   Logging: Das Logging-Verhalten wird über eine Umgebungsvariable gesteuert. [Mehr dazu hier](#logging).

# Programmablauf (Schema)

1. Das [Background-Skript](src/background.ts) läuft im Hintergrund des Browsers. Bei Installation wird die FAQ angezeigt. Solange nichts weiter passiert, bleibt es inaktiv.

2. Ruft die Nutzer:in eine Pressewebsite auf, die zu einem Matchpattern einer Seite passt, die in der Datei [`src/settings/sites.ts`](examples/site.ts) (Property `match`) definiert ist, startet das [Content-Skript](src/content.ts) den [_SiteBot _](src/lib/sitebot.ts).

3. Der _SiteBot_ prüft, ob etwas zu tun ist. Liegt der Artikel im Volltext vor, passiert nichts weiter.

4. Liegt der Artikel auf der Pressewebsite nicht im Volltext vor und ist das Archiv (direkt oder per Fallback unter der in der Konfiguration [`src/settings/config.json`](examples/config.jsonc) angegebenen URL) erreichbar, wird der Nutzer:in angeboten, im Archiv nach dem Text zu suchen. Das geschieht allerdings erst auf ihren ausdrücklichen Wunsch hin. Ein automatischer Abruf findet nicht statt.

5. Verlangt die Nutzer:in nach dem Volltext, wird der Query für die Archivseite extrahiert (entsprechend der Weise, die die in der Datei [`src/settings/sites.ts`](examples/site.ts) definiert ist).

6. Der _SiteBot_ öffnet einen Port (mehr dazu: [MDN](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/Port), [Chrome-Doku](https://developer.chrome.com/docs/extensions/mv3/messaging/#connect)) und lauscht auf diesem. Wird eine Message über den Port gesendet, empfängt er diese; schickt er eine Nachricht, verschickt er sie über den Port.

7. Das [Hintergrund-Skript](src/background.ts) wird wieder wach, sobald der _SiteBot_ den Port öffnet.

8. Es startet dann den [_Reader_](src/lib/reader.ts), der sich ebenfalls mit dem Port verbindet. _SiteBot_ und _Reader_ können sich nun gegenseitig Nachrichten schicken. Während der _SiteBot_ auf die Pressewebsite zugreifen kann (da er im Kontext dieser Seite läuft), kann das der Reader nicht. Der _Reader_ kann hingegen einen neuen Tab öffnen (nötig, um parallel auf das Archiv zuzugreifen), was wiederum aus dem Contentskript heraus nicht möglich ist.

9. Der _SiteBot_ sendet nun an den _Reader_, dass er gerne den Retrievalprozess beginnen möchte (vgl. dazu [`MessageInit`](src/lib/globals/types.d.ts)). Er schickt dabei den extrahierten Query und weitere Informationen an den _Reader_.

10. Sobald der _Reader_ diese Nachricht erhält, startet er den _SourceBot_ und übergibt ihm die für die Suche relevanten Informationen aus der `MessageInit`-Nachricht.

11. Der [_SourceBot_](src/lib/sourcebot.ts) öffnet nun das Archiv in einem neuen Browser-Tab. Die URL dazu wird auf Basis der in der Konfiguration [`src/settings/config.json`](examples/config.jsonc) angebenen URL (also `config.HOST` bzw. `config.FALLBACK_HOST`) und der `SEARCH_PARAMS` generiert. Es startet den [_Injector_](src/lib/utils/injector.ts). Der _SourceBot_ lauscht auf Veränderungen im Tab; von sich aus tut der Injector zunächst nichts.

12. Sobald der Tab vollständig geladen ist, ruft _SourceBot_ den erste Schritt auf. Ein Schritt ist alles, was [unterhalb der LOGIN bzw. SEARCH-Phase für diese Quelle angegeben in `src/settings/source.ts`](examples/source.ts) ist. Der nächste Schritt wird ausgelöst, wenn sich der Tab verändert.

13. Vor jedem Schritt prüft der _SourceBot_, ob die Nutzer:in eingeloggt ist (entsprechend `isLoggedIn` in der [Source-Datei `src/settings/source.ts`](examples/source.ts)). Ist sie eingeloggt, wird zur Such-Phase gesprungen. Sie gilt als eingeloggt, wenn im aktuellen Dokument mit dem CSS-Selektor, der in `source` bei `isLoggedIn` angegeben ist, ein Element gefunden wird.

14. Der _SourceBot_ führt nun alle Aktionen des jeweiligen Schrittes aus. Die Ausführungsreihenfolge richtet sich der dort angegebenen Reihenfolge.

15. Wird nur die Statusmeldung (Anzeige unterhalb des Fortschrittsbalkens) geändert, braucht es keine Interaktion mit dem Tab. Daher wird sie vom _SourceBot_ direkt an den _Reader_ zurückgemeldet, der sie wiederum an den _SiteBot_ weiterreicht. Der _SiteBot_ zeigt daraufhin der Nutzer:in die Statusänderung an.

16. Der _SourceBot_ bittet den _Injector_ um das Durchführen der Aktion.

17. Der _Injector_ injiziert nun die Aktion. Dabei sind [einige Besonderheiten zu berücksichtigen, so wird etwa die Aktionsfunktion vom Ausführungskontext isoliert ausgeführt](https://developer.chrome.com/docs/extensions/reference/scripting/#runtime-functions).

18. Tritt ein Fehler während der Ausführung der Aktion auf, **bricht der Suchvorgang ab**. Der Nutzer:in wird vom _SiteBot_ via _Reader_ und _SourceBot_ der Misserfolg gemeldet. Der Archiv-Tab bleibt offen, damit die Nutzer:in ggf. selbst dort nach dem Artikel suchen kann. **Ausnahme**: Hat die Aktion allerdings das Property `onErrorRetry` in der [Source-Datei `src/settings/source.ts`](examples/source.ts) , wird sie diesem entsprechend wiederholt, statt direkt abzubrechen.

19. Gibt es einen weiteren Schritt, wird nun dieser ausgeführt und es geht mit der nächsten Aktion wieder neu mit (16) weiter.

20. Ist der Schritt der letzte Schritt der Suchphase und sind alle Aktionen durchgeführt, übergibt der _Sourcebot_ den Rückgabewert der letzten Aktion und meldet den Abschluss an den _Reader_ zurück.

21. Der _Reader_ meldet den Abschluss an den _SiteBot_, der nun wiederum weitere Informationen zu dem Treffer abfragt, via [src/lib/utils/result.ts](src/lib/utils/result.ts) serialisiert
    und schließlich **die Nutzer:in auf den Archiv-Artikel verweist** (wenn der Artikel gefunden wurde) **bzw. eine Fehlermeldung anzeigt** (wenn der Artikel nicht gefunden wurde).

# Nachweise

Entsprechend der Originallizenz steht auch der Quellcode hier unter GPLv3.
**Abweichend davon** gelten folgende Lizenzen:

-   bulma.min.css (MIT-Lizenz): [Quelle](https://github.com/jgthms/bulma)
-   Bot-Icon (GPLv3): [Quelle](https://github.com/stefanw/bibbot)
-   PDF-, Link- & Lupen-Icon (MIT-Lizenz): [Quelle](https://github.com/twbs/icons)

# Attribution

IDA-Bot basiert auf und wurde inspiriert von Stefan Wehrmeyers [Bibbot](https://github.com/stefanw/bibbot).
