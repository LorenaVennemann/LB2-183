# Testkonzept: M183 LB2 ToDo-Applikation

## 1. Zielsetzung 🎯

Ziel dieses Testkonzepts ist es, die Qualität und Sicherheit der ToDo-Applikation zu gewährleisten. Es soll sichergestellt werden, dass alle Funktionen wie erwartet arbeiten, keine sicherheitsrelevanten Schwachstellen vorhanden sind und die Applikation unter realen Nutzungsbedingungen stabil läuft.

## 2. Testarten 🧪

Folgende Testarten kommen zum Einsatz:

- **Funktionale Tests:** Überprüfung der Basisfunktionen wie Registrierung, Login, Task-Erstellung etc.
- **Sicherheitstests:** Tests auf Schwachstellen wie XSS, CSRF, SQL-Injection, Zugriffskontrolle etc.
- **Usability-Tests (optional):** Subjektive Einschätzung zur Benutzerfreundlichkeit.
- **Kompatibilitätstests:** Überprüfung der Applikation in verschiedenen Browsern (Chrome, Firefox, Edge).
- **Performance-Tests (optional):** Reaktion der App bei hoher Last oder vielen Tasks.

## 3. Testumfang 📋

Der Test konzentriert sich auf folgende Kernbereiche der Applikation:

- Registrierung & Authentifizierung (inkl. 2FA und Google Login)
- Task-Management (Erstellen, Bearbeiten, Löschen, Filtern)
- Zugriffskontrolle (Benutzerrollen, Sessions)
- Web-Security (XSS, CSRF, SQLi, etc.)
- Datenvalidierung & Fehlerbehandlung

## 4. Testmethodik ✅

- **Manuelles Testen:** Der Großteil der Tests wird manuell anhand eines Testprotokolls durchgeführt.
- **Exploratives Testen:** Zusätzliche Tests außerhalb des Protokolls zur Identifikation unentdeckter Fehler.
- **Fehlertickets:** Festgestellte Fehler werden dokumentiert und ggf. priorisiert.

## 5. Testumgebung 🖥️

- **Frontend:** React (bzw. verwendet im Projekt)
- **Backend:** Node.js / Express (sofern verwendet)
- **Datenbank:** MariaDB
- **Browser:** Google Chrome (Haupttest), Firefox & Edge (Kompatibilität)

## 6. Testkriterien 🎯

**Ein Test gilt als bestanden, wenn:**

- Das tatsächliche Verhalten mit dem erwarteten Ergebnis übereinstimmt.
- Keine sicherheitsrelevanten Schwachstellen nachweisbar sind.
- Die Anwendung in den definierten Zielbrowsern funktioniert.

## 7. Testdurchführung 👥

- **Tester:** Daniels, Kohler, Vennemann
- **Zeitraum:** KW 9–10
- **Dokumentation:** In einem Testprotokoll im Markdown-Format (siehe separate Datei)

## 8. Abnahmekriterien ✅

Die Applikation gilt als **abgenommen**, wenn:

- Alle kritischen Tests erfolgreich bestanden wurden
- Es keine Blocker- oder kritische Fehler mehr gibt
- Die funktionalen Kernbereiche zuverlässig arbeiten

---

