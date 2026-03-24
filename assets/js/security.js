(function () {
    'use strict';

    // Nota: en frontend no existe proteccion total contra DevTools,
    // estas medidas son disuasivas y de endurecimiento basico.

    const blockedKey = (event) => {
        const key = event.key.toUpperCase();
        const ctrlOrCmd = event.ctrlKey || event.metaKey;

        const blocked =
            key === 'F12' ||
            (ctrlOrCmd && event.shiftKey && ['I', 'J', 'C', 'K'].includes(key)) ||
            (ctrlOrCmd && ['U', 'S', 'P'].includes(key));

        if (blocked) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const preventContextMenu = (event) => {
        event.preventDefault();
    };

    const preventFrameEmbedding = () => {
        if (window.top !== window.self) {
            try {
                window.top.location = window.self.location.href;
            } catch (error) {
                window.self.location.href = window.self.location.href;
            }
        }
    };

    const removeSuspiciousNodes = (node) => {
        if (!(node instanceof Element)) {
            return;
        }

        const suspiciousTags = ['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED'];
        if (suspiciousTags.includes(node.tagName) && !node.hasAttribute('data-trusted')) {
            node.remove();
            return;
        }

        const nestedSuspicious = node.querySelectorAll('script, iframe, object, embed');
        nestedSuspicious.forEach((element) => {
            if (!element.hasAttribute('data-trusted')) {
                element.remove();
            }
        });
    };

    const initMutationGuard = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    removeSuspiciousNodes(node);
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    };

    const showSecurityOverlay = () => {
        let overlay = document.getElementById('security-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            return;
        }

        overlay = document.createElement('div');
        overlay.id = 'security-overlay';
        overlay.setAttribute('data-trusted', 'true');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.zIndex = '99999';
        overlay.style.background = 'rgba(0, 0, 0, 0.92)';
        overlay.style.color = '#ffffff';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.textAlign = 'center';
        overlay.style.padding = '24px';
        overlay.style.fontFamily = 'Montserrat, sans-serif';
        overlay.textContent = 'Herramientas de desarrollo detectadas. La sesion fue bloqueada por seguridad basica.';

        document.body.appendChild(overlay);
    };

    const initDevToolsDetection = () => {
        let hasTriggered = false;

        setInterval(() => {
            const widthDiff = window.outerWidth - window.innerWidth > 160;
            const heightDiff = window.outerHeight - window.innerHeight > 160;
            const devtoolsDetected = widthDiff || heightDiff;

            if (devtoolsDetected && !hasTriggered) {
                hasTriggered = true;
                document.body.classList.add('devtools-open');
                showSecurityOverlay();
            }
        }, 1000);
    };

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', blockedKey, true);

    preventFrameEmbedding();
    initMutationGuard();
    initDevToolsDetection();
})();
