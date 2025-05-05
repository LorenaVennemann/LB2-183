# Testprotokoll Feedback

## Testfälle

### 2.2

Captcha wird nur für MFA gebraucht, also ja man kann sich ohne Captcha einloggen solange der Benutzer MFA nicht eingerichtet ist. Captcha wird einfach dafür verwendet, dass nicht unnötig viele SMS versendet werden.

### 3.8

Den versuch mit der SQL-Injection mit ' OR '1'='1 und dem Ergebnis `No results found!` ist okay, weil für diese Injection nichts zurückgegeben werden muss, eine SQL Injection würde an sich nicht funktionieren mit unserem Tech Stack.

### 7.1

Der Fehler beim SMS senden ist sehr wahrscheinlich darauf zurückzuführen, dass nicht 127.0.0.1:3000 verwendet wurde wie in der Doku beschrieben, sondern [localhost:3000](http://localhost:3000) → der ganze MFA Workflow funktioniert, falls nicht ist es ein Layer 8 Problem.

## Empfehlungen

### 3.1

1

Wie schon bei Testfall 2.2 beschrieben, das ist kein Problem. Für Bots gibt es bereits einen Honeypot auf dieser Seite.

2

Wurde implementiert.

### 3.2

1

Wie schon bei Testfall 7.2 beschriben funktioniert der SMS-Versand, sowie der ganze MFA-Workflow und eine weitere MFA-Methode zu implementieren macht aktuell keinen Sinn.

2

Die Firebase Konfig so wie sie ist passt, die Konfig wird verwendet und so benutzt, es scheint vielleicht nicht so sinvoll die Konfiguration doppelt zu haben, aber es funktioniert so.