document.addEventListener('DOMContentLoaded', function() {
    let currentUser = null;
    let recaptchaVerifier = null;
    let verificationId = null;

    // Auth-Status überwachen
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            // Benutzer ist angemeldet
            currentUser = user;
            document.getElementById('userEmail').textContent = user.email;

            // Überprüfe den MFA-Status
            await user.reload();
            const mfaStatusDiv = document.getElementById('mfaStatus');
            const authSection = document.getElementById('authSection');
            if (user.multiFactor.enrolledFactors.length > 0) {
                mfaStatusDiv.textContent = 'Multi-Factor Authentication is enabled.';
                mfaStatusDiv.classList.remove('alert-info');
                mfaStatusDiv.classList.add('alert-success');
                authSection.classList.add('d-none');
            } else {
                mfaStatusDiv.textContent = 'Multi-Factor Authentication is not enabled.';
                mfaStatusDiv.classList.remove('alert-info');
                mfaStatusDiv.classList.add('alert-warning');
                authSection.classList.remove('d-none');
            }
        } else {
            // Benutzer ist nicht angemeldet, zur Anmeldeseite weiterleiten
            window.location.href = '/login';
        }
    });

    // Erneute Authentifizierung
    document.getElementById('reauthForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, password);

        currentUser.reauthenticateWithCredential(credential)
            .then(() => {
                // Erfolgreich erneut authentifiziert
                if (!currentUser.emailVerified) {
                    // E-Mail ist nicht verifiziert, Verifikation erforderlich
                    currentUser.sendEmailVerification().then(() => {
                        // E-Mail-Verifikationsbereich anzeigen
                        document.getElementById('authSection').classList.add('d-none');
                        document.getElementById('emailVerificationSection').classList.remove('d-none');
                    });
                } else {
                    // E-Mail ist bereits verifiziert, zum Setup-Bereich wechseln
                    document.getElementById('authSection').classList.add('d-none');
                    document.getElementById('setupSection').classList.remove('d-none');

                    // reCAPTCHA initialisieren
                    recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                        'size': 'normal',
                        'callback': function(response) {
                            // reCAPTCHA wurde gelöst
                        }
                    });
                    recaptchaVerifier.render();
                }
            })
            .catch((error) => {
                console.error('Fehler bei der erneuten Authentifizierung');
                alert('Fehler bei der erneuten Authentifizierung');
            });
    });

    // Verifikations-E-Mail erneut senden
    document.getElementById('resendVerificationEmailBtn').addEventListener('click', function() {
        currentUser.sendEmailVerification().then(() => {
            alert('Verifikations-E-Mail wurde erneut gesendet.');
        }).catch((error) => {
            console.error('Fehler beim Senden der Verifikations-E-Mail, versuche es später erneut.');
            alert('Fehler beim Senden der Verifikations-E-Mail');
        });
    });

    // MFA-Setup-Formular
    document.getElementById('setupForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Zuerst überprüfen, ob E-Mail verifiziert ist
        if (!currentUser.emailVerified) {
            alert('Bitte verifizieren Sie zuerst Ihre E-Mail-Adresse, bevor Sie MFA einrichten.');
            return;
        }

        const phoneNumber = document.getElementById('phoneNumber').value;

        // MFA-Sitzung starten
        currentUser.multiFactor.getSession()
            .then((multiFactorSession) => {
                // Telefonnummer-Informationen
                const phoneInfoOptions = {
                    phoneNumber: phoneNumber,
                    session: multiFactorSession
                };

                // SMS-Code senden
                const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
                return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
            })
            .then((vId) => {
                // Verifikations-ID speichern
                verificationId = vId;

                // Zum Verifikations-Bereich wechseln
                document.getElementById('setupSection').classList.add('d-none');
                document.getElementById('verificationSection').classList.remove('d-none');
            })
            .catch((error) => {
                console.error('Fehler beim Senden der SMS');
                alert('Fehler beim Senden der SMS');

                // reCAPTCHA zurücksetzen
                recaptchaVerifier.clear();
                recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    'size': 'normal'
                });
                recaptchaVerifier.render();
            });
    });

    // SMS-Code-Verifikation
    document.getElementById('verificationForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const verificationCode = document.getElementById('verificationCode').value;

        // SMS-Code verifizieren
        const cred = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
        const multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);

        // MFA-Registrierung abschließen
        currentUser.multiFactor.enroll(multiFactorAssertion)
            .then(() => {
                // MFA erfolgreich eingerichtet
                document.getElementById('verificationSection').classList.add('d-none');
                document.getElementById('successSection').classList.remove('d-none');
            })
            .catch((error) => {
                console.error('Fehler bei der MFA-Einrichtung');
                alert('Fehler bei der MFA-Einrichtung');
            });
    });
});