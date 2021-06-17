# IDA-Bot

IDA-Bot erlaubt prototypisch die Automatisierung des Suchvorgangs nach korrespondierenden Volltexten deutscher Medienseiten im Archiv. Der Suchvorgang muss initial je durch die Nutzer_in ausgelöst werden.

## Entwicklung

```sh
npm install

npm start
```

Die Erweiterungsdateien werden per `rollup` gebündelt (in `build/`).

## Überblick

Kurzübersicht über wichtige Dateien:

* Logik
	* `src/content.js`: Läuft auf der Nachrichtenseite und kommuniziert mit dem `background`-Skript.
	* `src/background.js`: Öffnet das Pressearchiv in einem neuem Tab, sucht nach dem Artikel und liest den gefundenen Artikeltext aus.
* Daten
	* zur Nutzung der Erweiterung selbst
		* `src/options.js`: Hilfe-Ansicht.
		* `popup/` :  Popup, das geöffnet wird, wenn das Icon in der Toolbar geklickt wird.
		* `src/ui.js`: Nutzer_innen-Interface.
	* zur Interaktion mit dem Pressearchiv und den Nachrichtenseiten
		* `src/providers.js`: Prinzipelle Authentifizierung mit dem Pressearchiv
		* `src/sources.js`: Schritte zur Navigation des Bots im Pressearchiv
		* `src/sites.js`: Enthält die Nachrichtenseiten mit Angaben dazu, wie deren Metadaten extrahiert werden.

## Verweis

IDA-Bot ist eine Anpassung des [VÖBBOT](https://github.com/stefanw/voebbot). 

Kurzübersicht der Anpassungen:

* Anpassung der Struktur 
* Fallback-Modus
* Reduzierung der Metadaten der `sites`
* vollständige Überarbeitung des Userinterfaces
* Hinzufügung von pressearchiv-spezifischen Funktionen
* Anpassung der Suche auf das Pressearchiv
* Entfernung aller nicht benötigten Funktionen

