# Things

## Aufgabe
Phase 2: Die Entwickler übergeben Ihre Applikation den Testern. Jetzt wechseln Sie Ihre Rolle und werden von Entwicklern zu Testern. Die Tester (also Sie) analysieren die Applikation auf noch vorhandene Schwachstellen und erstellen ein Testprotokoll aus welchem hervorgeht, was getestet wurde und welche allfälligen Schwachstellen noch gefunden wurden.

## Kriterien

Kriterium Testabdeckung (maximal 4 P.)

0 P. = Testbericht nicht abgegeben / keine Tests vorhanden
1 P. = Testbericht vorhanden, aber sehr einseitige Testabdeckung und sehr wenige Testcases
2 P. = Keine Systematik bezüglich der Testdefinition erkennbar, viele wichtige Testcases vergessen
3 P. = ca. 50 - 75 % der unterschiedlichen Sicherheitsaspekte durch Tests abgedeckt
4 P. = > 75% der unterschiedlichen Sicherheitsaspekte durch Tests abgedeckt

## Testing

1. Strukturierter Sicherheitstest-Ansatz
Ich empfehle, deine Tests an einem anerkannten Framework wie OWASP Top 10 oder SANS Top 25 zu orientieren. Das stellt sicher, dass du methodisch vorgehst und keine wichtigen Sicherheitsaspekte vergisst.

2. Ergänzende Tests zum bestehenden Protokoll
Basierend auf deinem aktuellen Testprotokoll würde ich folgende zusätzliche Tests empfehlen:
Erweiterte Authentifizierungs-Tests:

3. Passwort-Regeln testen (Mindestlänge, Komplexität)
Brute-Force-Schutz (z.B. Account-Sperre nach x Fehlversuchen)
Session-Timeout testen
Session-Fixation-Schutz
Cookie-Sicherheit (HttpOnly, Secure, SameSite Flags)

4. Zugriffskontrolle-Tests:
Horizontale Zugriffskontrolle (Kann ein Benutzer die ToDos eines anderen Benutzers sehen?)
Vertikale Zugriffskontrolle (Admin vs. Normal-Benutzer Rechte)
Direkter Objektzugriff (IDOR) testen

5. Daten-Validierung:
SQL-Injection (verschiedene Eingabefelder testen)
XSS in verschiedenen Kontexten (nicht nur im Task-Namen)
CSRF für alle wichtigen Aktionen (nicht nur POST)
Content-Type und Input-Validierung

6. API-Sicherheit (falls vorhanden):
API-Endpunkte testen
Rate Limiting
Parameter-Manipulation

7. Server-Konfiguration:
HTTP Security Headers (X-XSS-Protection, CSP, usw.)
HTTPS-Implementierung
Fehlerbehandlung (werden sensible Informationen in Fehlermeldungen angezeigt?)

8. Statische Code-Analyse
Definitiv! Eine statische Code-Analyse ist sehr wertvoll. Du könntest:
Nach hardcodierten Credentials suchen
Unsichere Funktionen identifizieren
Schwachstellen in Bibliotheken/Abhängigkeiten prüfen
Prüfen, ob Eingabevalidierung konsistent angewendet wird

9. Dokumentation verbessern
Für die Testdokumentation würde ich empfehlen:
Den "Status" für jeden Test auszufüllen (bestanden/nicht bestanden)
Bei Fehlern konkrete Beweise beifügen (Screenshots, HTTP-Requests, usw.)
Die Schweregrad jeder Schwachstelle bewerten (kritisch, hoch, mittel, niedrig)
Vorschläge zur Behebung von Schwachstellen hinzufügen

10. Abschließende Empfehlungen
Füge einen Abschnitt mit einer Zusammenfassung der Ergebnisse und konkreten Empfehlungen hinzu. Das zeigt ein tieferes Verständnis der Sicherheitsprobleme und wie sie gelöst werden können.