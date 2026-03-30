(function () {
    'use strict';

    // Nota: en frontend no existe proteccion total contra DevTools.
    // Esta version evita bloqueos falsos en moviles (Safari/iPhone)
    // y mantiene solo medidas basicas no intrusivas.

    const isLikelyDesktop =
        window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const blockedKey = (event) => {
        if (!isLikelyDesktop) {
            return;
        }

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
        if (!isLikelyDesktop) {
            return;
        }
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

    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', blockedKey, true);

    preventFrameEmbedding();
})();
