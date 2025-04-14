# Testprotokoll: M183 LB2 ToDo-Applikation  
**Datum:** 2/31/2025  
**Tester:** Daniels, Kohler, Vennemann  

---

### Authentifizierung Tests 🔑

| Test-ID | Beschreibung | Voraussetzungen | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|-----------------|----------|---------------------|--------|
| AUTH-01 | Registrieren | keine | 1. Startseite öffnen<br>2. Auf sign up klicken<br>3. Mit der Authenticator App auf dem Smartphone den QR-Code scannen<br>4. Den einmaligen Passwort-Code von der App eingeben<br>5. Continue klicken | Weiterleitung zur Todo-Liste | ✅ |
| AUTH-02 | Mit Google anmelden | keine | 1. Startseite öffnen<br>2. Auf "Continue with Google" klicken | Weiterleitung zur Todo-Liste | ✅ |
| AUTH-03 | Anmelden mit korrekten Angaben | keine | 1. Startseite öffnen<br>2. Gültige Credentials eingeben<br>3. Continue klicken<br>4. Den einmaligen Passwort-Code von der Authenticator App eingeben<br>5. Continue klicken | Weiterleitung zur Todo-Liste | ✅ |
| AUTH-04 | Anmelden mit falschen Angaben | keine | 1. Startseite öffnen<br>2. Ungültige Credentials eingeben<br>3. Continue klicken | Fehlermeldung wird angezeigt | ✅ |
| AUTH-05 | Abmelden | Eingeloggt sein | 1. Logout klicken | Weiterleitung zur Login-Seite | ✅ |

---

### Task Tests 📝

| Test-ID | Beschreibung | Voraussetzungen | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|-----------------|----------|---------------------|--------|
| TASK-01 | Task erstellen | Eingeloggt sein | 1. Task Seite öffnen<br>2. Auf Create Task klicken<br>3. Beschreibung und Status im Formular ausfüllen<br>4. Auf Submit klicken<br>5. Zurück zur Task Seite navigieren | Die erstellte Task wird auf der Task Seite aufgelistet | ✅ |
| TASK-02 | Task bearbeiten | Eingeloggt sein | 1. Task Seite öffnen<br>2. Bestehende Task wählen<br>3. Auf Edit klicken<br>4. Die Beschreibung zu "Clean my room" ändern<br>5. Auf Submit klicken | Die angepasste Beschreibung wird in der Task Liste angezeigt | ✅ |
| TASK-03 | Task löschen | Eingeloggt sein | 1. Task Seite öffnen<br>2. Task auswählen<br>3. Auf Delete klicken | Task sollte erfolgreich gelöscht werden und nicht mehr angezeigt werden | ✅ |
| TASK-04 | Task Status ändern | Eingeloggt sein | 1. Task Seite öffnen<br>2. Task auswählen<br>3. Status ändern<br>4. Auf Submit klicken | Die Task sollte mit dem neuen Status in der Task Liste dargestellt werden | ✅ |
| TASK-05 | Suche nach Task | Eingeloggt sein | 1. Task Seite öffnen<br>2. Im Suchfeld den Task Namen eingeben<br>3. Auf Submit klicken | Die Task sollte erfolgreich angezeigt werden | ✅ |

---

### Sicherheitstests 🛡️

| Test-ID | Beschreibung | Voraussetzungen | Schritte | Erwartetes Ergebnis | Status |
|---------|--------------|------------------|----------|----------------------|--------|
| SEC-01 | Zugriff ohne Login | Keine | 1. Browser öffnen<br>2. Direkt zur Todo-URL | Redirect zum Login | ✅ |
| SEC-02 | XSS Prevention | Keine | 1. Todo mit Script-Tag erstellen<br>`<script>alert('xss')</script>` | Script wird escaped angezeigt | ✅ |
| SEC-03 | CSRF Protection | Keine | 1. POST Request ohne CSRF Token | Request wird abgelehnt durch die Firewall | ✅ |
| SEC-04 | SQL Injection | Keine | 1. Zur Task Seite navigieren<br>2. Auf Create Task klicken<br>3. Beschreibung: `; SELECT * FROM tasks;` | Request wird abgelehnt durch die Firewall | ✅ |
| SEC-05 | Zugriff auf fremde Ressourcen | Zwei User-Accounts | 1. Mit User A Task erstellen<br>2. Mit User B Task von A aufrufen mithilfe der UserId | Zugriff wird verweigert | ❌ |
| SEC-06 | HTML Injection | Eingeloggt | 1. Task mit HTML beschreiben: `<h1>Hack</h1>` | HTML wird escaped angezeigt | ✅ (Request wird von der Firewall abgelehnt) |
| SEC-07 | Rate Limiting (Login) | Keine | 1. 10x falsches Passwort eingeben<br>2. Auf Login klicken | Temporäre Sperre oder Captcha erscheint | ✅ |
| SEC-08 | Zugriff auf Admin-Funktionen | Eingeloggt (User) | 1. Admin-URL direkt aufrufen | Zugriff wird verweigert | ✅ |
| SEC-09 | Passwort in Klartext im Netzwerk | Keine | 1. Anmeldung über HTTP, mit Network-Inspector prüfen | Passwort ist nicht im Klartext sichtbar (HTTPS enforced) | ✅ |
| SEC-10 | Directory Traversal | Keine | 1. URL manipulieren: `/../../etc/passwd` | Zugriff wird blockiert / Fehlerseite erscheint | ✅ (Der Request wird einfach auf / weitergeleitet) |