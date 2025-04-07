
# Testprotokoll: M183 LB2 ToDo-Applikation
Datum: 2/31/2025

Tester: Daniels, Kohler, Vennemann

### Authentifizierung-Tests 🔑

| Test-ID | Beschreibung | Voraussetzungen | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|----------|---------------------|---------|
| AUTH-01 | Registrieren  | keine | 1. Startseite öffnen<br>2. Auf sign up klicken<br>3. Mit der Authenticater App auf dem Smartphone den QR-Code scannen<br>4. Den einmaligen Passwort Code von der Authenticater app eingeben| Weiterleitung zur Todo-Liste | ... |
| AUTH-02 | Mit Google anmelden | keine | 1. Startseite öffnen<br>2. Auf "Continue with Google" klicken | Weiterleitung zur Todo-Liste | ... |
| AUTH-03 | Anmelden mit korrekten Angabenen | keine | 1. Startseite öffnen<br>2. Gültige Credentials eingeben<br>3. Continue klicken<br>4. Onetime Code aus der Authenticater app eingeben<br>5. Continue klicken | Weiterleitung zur Todo-Liste | ... |
| AUTH-04 | Anmelden mit falschen Angaben | keine | 1. Startseite öffnen<br>2. Ungültige Credentials eingeben<br>3. Continue klicken | Fehlermeldung wird angezeigt | ... |
| AUTH-05 | Abmelden | keine | 1. Eingeloggt sein<br>2. Logout klicken | Weiterleitung zur Login-Seite | ... |


### ToDo-Listen Tests 📝

| Test-ID | Beschreibung | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|----------|---------------------|---------|
| ToDo-01 | ToDo erstellen | 1. Eingeloggt sein<br>2. Zur ToDo Seite gehen<br>3. ToDo erstellen | Weiterleitung zur Todo-Liste | ... |
| ToDo-02 | ToDo bearbeiten | 1. Bestehendes ToDo wählen<br>2. Bearbeiten klicken<br>3. Text ändern<br>4. Speichern | Änderungen werden gespeichert | ... |
| ToDo-03 | ToDo löschen | 1. ToDo auswählen<br>2. ToDo Löschen | ToDo sollte erfolgreich gelöscht werden | ... |
| ToDo-04 | ToDo Task Status ändern | 1. ToDo auswählen<br>2. Status ändern | ToDo sollte erfolgreich den neuen Status besitzen | ... |
| ToDo-05 | Suche nach Task | 1. ToDo Seite gehen<br>2. IM Suchfeld nach dem Task Namen suchen | Task sollte erfolgreich den angezeigt werden | ... |



### Sicherheitstests 🛡️

| Test-ID | Beschreibung | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|----------|---------------------|---------|
| SEC-01 | Zugriff ohne Login | 1. Browser öffnen<br>2. Direkt zur Todo-URL | Redirect zum Login | ... |
| SEC-02 | XSS Prevention | 1. Todo mit Script-Tag erstellen<br>`<script>alert('xss')</script>` | Script wird escaped angezeigt | ... |
| SEC-03 | CSRF Protection | 1. POST Request ohne CSRF Token | Request wird abgelehnt | ... |
