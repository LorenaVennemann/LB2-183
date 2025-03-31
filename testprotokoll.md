
# Testprotokoll

### Authentifizierung-Tests 🔑

| Test-ID | Beschreibung | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|----------|---------------------|---------|
| AUTH-01 | Login mit korrekten Angabenen | 1. Zur Login-Seite navigieren<br>2. Gültige Credentials eingeben<br>3. Login klicken | Weiterleitung zur Todo-Liste | ... |
| AUTH-02 | Login mit falschen Angaben | 1. Zur Login-Seite navigieren<br>2. Ungültige Credentials eingeben<br>3. Login klicken | Fehlermeldung wird angezeigt | ... |
| AUTH-03 | Logout Test | 1. Eingeloggt sein<br>2. Logout klicken | Weiterleitung zur Login-Seite | ... |


### ToDo-Listen Tests 📝

| Test-ID | Beschreibung | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|----------|---------------------|---------|
| ToDo-01 | ToDo erstellen | 1. Eingeloggt sein<br>2. Zur ToDo Seite gehen<br>3. ToDo erstellen | Weiterleitung zur Todo-Liste | ... |
| ToDo-02 | ToDo bearbeiten | 1. Bestehendes ToDo wählen<br>2. Bearbeiten klicken<br>3. Text ändern<br>4. Speichern | Änderungen werden gespeichert | ... |
| ToDo-03 | ToDo löschen | 1. ToDo auswählen<br>2. ToDo Löschen | ToDo sollte erfolgreich gelöscht werden | ... |


### Sicherheitstests 🛡️

| Test-ID | Beschreibung | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|----------|---------------------|---------|
| SEC-01 | Zugriff ohne Login | 1. Browser öffnen<br>2. Direkt zur Todo-URL | Redirect zum Login | ... |
| SEC-02 | XSS Prevention | 1. Todo mit Script-Tag erstellen<br>`<script>alert('xss')</script>` | Script wird escaped angezeigt | ... |
| SEC-03 | CSRF Protection | 1. POST Request ohne CSRF Token | Request wird abgelehnt | ... |