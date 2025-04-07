
# Testprotokoll: M183 LB2 ToDo-Applikation
Datum: 2/31/2025

Tester: Daniels, Kohler, Vennemann

### Authentifizierung Tests 🔑

| Test-ID | Beschreibung | Voraussetzungen | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|-----------------|----------|---------------------|--------|
| AUTH-01 | Registrieren  | keine | 1. Startseite öffnen<br>2. Auf sign up klicken<br>3. Mit der Authenticater App auf dem Smartphone den QR-Code scannen<br>4. Den einmaligen Passwort Code von der Authenticater app eingeben<br>5. Continue klicken | Weiterleitung zur Todo-Liste | ✅ |
| AUTH-02 | Mit Google anmelden | keine | 1. Startseite öffnen<br>2. Auf "Continue with Google" klicken | Weiterleitung zur Todo-Liste | ✅ |
| AUTH-03 | Anmelden mit korrekten Angabenen | keine | 1. Startseite öffnen<br>2. Gültige Credentials eingeben<br>3. Continue klicken<br>4. Den einmaligen Passwort Code von der Authenticater app eingeben<br>5. Continue klicken | Weiterleitung zur Todo-Liste | ✅ |
| AUTH-04 | Anmelden mit falschen Angaben | keine | 1. Startseite öffnen<br>2. Ungültige Credentials eingeben<br>3. Continue klicken | Fehlermeldung wird angezeigt | ✅ |
| AUTH-05 | Abmelden | - Eingeloggt sein | 1. Logout klicken | Weiterleitung zur Login-Seite | ✅ |


### Task Tests 📝

| Test-ID | Beschreibung | Voraussetzungen | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|-----------------|----------|---------------------|--------|
| ToDo-01 | Task erstellen | - Eingeloggt sein | 1. Task Seite öffnen<br>2. auf Create Task klicken<br>3. Beschreibung und Status im Formular ausfüllen<br>4. Auf Submit klicken<br>5. Zurück zur Task Seite navigieren | Die erstellte Task wird auf der Task Seite aufgelistet | ✅ |
| ToDo-02 | Task bearbeiten | - Eingeloggt sein | 1. Bestehende Task wählen<br>2. Auf edit klicken<br>3. Die Description zu "Clean my room" ändern<br>4. Speichern | Die angepasste beschreibung wird in der Task Liste angezeit | ✅ |
| ToDo-03 | Task löschen | - Eingeloggt sein | 1. ToDo auswählen<br>2. ToDo Löschen | ToDo sollte erfolgreich gelöscht werden | ✅ |
| ToDo-04 | ToDo Task Status ändern | - Eingeloggt sein | 1. ToDo auswählen<br>2. Status ändern | ToDo sollte erfolgreich den neuen Status besitzen | ✅ |
| ToDo-05 | Suche nach Task | - Eingeloggt sein | 1. ToDo Seite gehen<br>2. IM Suchfeld nach dem Task Namen suchen | Task sollte erfolgreich den angezeigt werden | ✅ |



### Sicherheitstests 🛡️

| Test-ID | Beschreibung | Voraussetzungen | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|-----------------|----------|---------------------|--------|
| SEC-01 | Zugriff ohne Login | keine | 1. Browser öffnen<br>2. Direkt zur Todo-URL | Redirect zum Login | ✅ |
| SEC-02 | XSS Prevention | keine | 1. Todo mit Script-Tag erstellen<br>`<script>alert('xss')</script>` | Script wird escaped angezeigt | ✅ |
| SEC-03 | CSRF Protection | keine | 1. POST Request ohne CSRF Token | Request wird abgelehnt | ✅ |
