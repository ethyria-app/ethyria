(function () {
    var statusClassMap = {
        success: ['text-cyan-400'],
        info: ['text-sky-300'],
        warning: ['text-amber-300'],
        error: ['text-rose-400']
    };
    var toastPalette = {
        success: { border: 'rgba(34, 211, 238, 0.35)', text: '#67e8f9' },
        info: { border: 'rgba(125, 211, 252, 0.35)', text: '#bae6fd' },
        warning: { border: 'rgba(252, 211, 77, 0.35)', text: '#fde68a' },
        error: { border: 'rgba(251, 113, 133, 0.35)', text: '#fda4af' }
    };
    var toastElement;
    var toastTimer;

    function getConfig() {
        return window.ethyriaBetaConfig || {};
    }

    function getStatusElement() {
        return document.getElementById('betaStatus') || document.getElementById('betaSuccess');
    }

    function resetStatusClasses(element) {
        element.classList.remove('hidden', 'animate-pulse');
        element.classList.remove('text-cyan-400', 'text-sky-300', 'text-amber-300', 'text-rose-400');
    }

    function showStatus(message, tone) {
        var element = getStatusElement();
        if (!element) {
            return;
        }

        resetStatusClasses(element);
        element.textContent = message;
        (statusClassMap[tone] || statusClassMap.info).forEach(function (className) {
            element.classList.add(className);
        });

        if (tone === 'success') {
            element.classList.add('animate-pulse');
        }
    }

    function ensureToast() {
        if (toastElement) {
            return toastElement;
        }

        toastElement = document.createElement('div');
        toastElement.setAttribute('role', 'status');
        toastElement.setAttribute('aria-live', 'polite');
        toastElement.style.position = 'fixed';
        toastElement.style.left = '50%';
        toastElement.style.bottom = '24px';
        toastElement.style.transform = 'translateX(-50%) translateY(24px)';
        toastElement.style.minWidth = '280px';
        toastElement.style.maxWidth = '92vw';
        toastElement.style.padding = '14px 18px';
        toastElement.style.borderRadius = '18px';
        toastElement.style.border = '1px solid rgba(255, 255, 255, 0.12)';
        toastElement.style.background = 'rgba(5, 10, 27, 0.94)';
        toastElement.style.backdropFilter = 'blur(14px)';
        toastElement.style.boxShadow = '0 18px 60px rgba(0, 0, 0, 0.4)';
        toastElement.style.fontSize = '14px';
        toastElement.style.lineHeight = '1.5';
        toastElement.style.opacity = '0';
        toastElement.style.pointerEvents = 'none';
        toastElement.style.transition = 'opacity 180ms ease, transform 180ms ease';
        toastElement.style.zIndex = '9999';
        document.body.appendChild(toastElement);
        return toastElement;
    }

    function showToast(message, tone) {
        var palette = toastPalette[tone] || toastPalette.info;
        var element = ensureToast();
        element.textContent = message;
        element.style.color = palette.text;
        element.style.borderColor = palette.border;
        element.style.opacity = '1';
        element.style.transform = 'translateX(-50%) translateY(0)';

        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
            element.style.opacity = '0';
            element.style.transform = 'translateX(-50%) translateY(24px)';
        }, 4200);
    }

    function setButtonState(button, label, disabled) {
        if (!button) {
            return;
        }

        button.textContent = label;
        button.disabled = disabled;
        button.style.opacity = disabled ? '0.72' : '1';
        button.style.cursor = disabled ? 'wait' : '';
    }

    function normalizeEmail(value) {
        return String(value || '').trim().toLowerCase();
    }

    function parseResponse(text) {
        try {
            return JSON.parse(text);
        } catch (error) {
            return {};
        }
    }

    function getPageName() {
        var path = window.location.pathname.split('/');
        return path[path.length - 1] || 'index.html';
    }

    window.handleBetaSignup = async function handleBetaSignup(event) {
        event.preventDefault();

        var config = getConfig();
        var messages = config.messages || {};
        var form = event.currentTarget;
        var input = form.querySelector('#betaEmail');
        var button = form.querySelector('button[type="submit"]');
        var honeypot = form.querySelector('input[name="website"]');

        if (!input || !button) {
            return;
        }

        if (honeypot && honeypot.value) {
            return;
        }

        if (!input.checkValidity()) {
            input.reportValidity();
            return;
        }

        var endpoint = String(config.endpoint || '').trim();
        if (!endpoint || endpoint.indexOf('REPLACE_WITH_') === 0) {
            showStatus(messages.setup || messages.error || 'Signup is not ready yet.', 'warning');
            showToast(messages.setup || messages.error || 'Signup is not ready yet.', 'warning');
            return;
        }

        var email = normalizeEmail(input.value);
        var idleLabel = messages.buttonIdle || button.textContent.trim();
        var loadingLabel = messages.buttonLoading || idleLabel;
        setButtonState(button, loadingLabel, true);
        showStatus(messages.sending || loadingLabel, 'info');

        var payload = new URLSearchParams();
        payload.set('email', email);
        payload.set('locale', config.locale || document.documentElement.lang || 'en');
        payload.set('sourcePage', config.sourcePage || getPageName());
        payload.set('pageUrl', window.location.href);
        payload.set('userAgent', navigator.userAgent || '');

        try {
            var response = await fetch(endpoint, {
                method: 'POST',
                body: payload,
                redirect: 'follow'
            });
            var responseText = await response.text();
            var result = parseResponse(responseText);
            var status = result.status || (response.ok ? 'success' : 'error');

            if (status === 'success') {
                input.value = '';
                showStatus(messages.success, 'success');
                showToast(messages.success, 'success');
            } else if (status === 'already_registered') {
                input.value = '';
                showStatus(messages.alreadyRegistered, 'info');
                showToast(messages.alreadyRegistered, 'info');
            } else if (status === 'saved_no_email') {
                input.value = '';
                showStatus(messages.savedNoEmail || messages.success, 'warning');
                showToast(messages.savedNoEmail || messages.success, 'warning');
            } else if (status === 'invalid_email') {
                showStatus(messages.invalidEmail, 'error');
                showToast(messages.invalidEmail, 'error');
                input.focus();
            } else {
                throw new Error(result.message || 'request_failed');
            }
        } catch (error) {
            showStatus(messages.error, 'error');
            showToast(messages.error, 'error');
        } finally {
            setButtonState(button, idleLabel, false);
        }
    };
})();