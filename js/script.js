(function () {
    const icons = document.querySelectorAll(".icon[data-window]");
    const closeButtons = document.querySelectorAll("[data-close]");
    const windowsLayer = document.getElementById("windows-layer");
    let zIndex = 10;

    function getWindow(id) {
        return document.getElementById("window-" + id);
    }

    function isOpen(win) {
        return win && !win.hasAttribute("hidden");
    }

    function focusWindow(win) {
        zIndex += 1;
        win.style.zIndex = String(zIndex);
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function makeWindowDraggable(win) {
        const bar = win.querySelector(".window-bar");
        let dragState = null;

        if (!bar || !windowsLayer) return;

        bar.addEventListener("pointerdown", function (event) {
            if (event.button !== 0 && event.pointerType === "mouse") return;
            if (event.target.closest(".window-close")) return;
            if (!isOpen(win)) return;

            const layerRect = windowsLayer.getBoundingClientRect();
            const winRect = win.getBoundingClientRect();

            focusWindow(win);
            win.style.transform = "none";
            win.style.left = winRect.left - layerRect.left + "px";
            win.style.top = winRect.top - layerRect.top + "px";

            dragState = {
                offsetX: event.clientX - winRect.left,
                offsetY: event.clientY - winRect.top,
            };

            win.classList.add("is-dragging");
            bar.setPointerCapture(event.pointerId);
            event.preventDefault();
        });

        bar.addEventListener("pointermove", function (event) {
            if (!dragState) return;

            const layerRect = windowsLayer.getBoundingClientRect();
            const maxLeft = Math.max(0, layerRect.width - win.offsetWidth);
            const maxTop = Math.max(0, layerRect.height - win.offsetHeight);
            const nextLeft = event.clientX - layerRect.left - dragState.offsetX;
            const nextTop = event.clientY - layerRect.top - dragState.offsetY;

            win.style.left = clamp(nextLeft, 0, maxLeft) + "px";
            win.style.top = clamp(nextTop, 0, maxTop) + "px";
        });

        function stopDrag(event) {
            if (!dragState) return;

            dragState = null;
            win.classList.remove("is-dragging");

            if (bar.hasPointerCapture(event.pointerId)) {
                bar.releasePointerCapture(event.pointerId);
            }
        }

        bar.addEventListener("pointerup", stopDrag);
        bar.addEventListener("pointercancel", stopDrag);
    }

    function openWindow(id) {
        const win = getWindow(id);
        if (!win) return;
        win.hidden = false;
        focusWindow(win);
    }

    function closeWindow(id) {
        const win = getWindow(id);
        if (!win) return;
        win.hidden = true;
    }

    icons.forEach(function (icon) {
        icon.addEventListener("click", function () {
            openWindow(icon.dataset.window);
        });
    });

    closeButtons.forEach(function (btn) {
        btn.addEventListener("click", function (event) {
            event.stopPropagation();
            closeWindow(btn.dataset.close);
        });
    });

    document.querySelectorAll(".window").forEach(function (win) {
        win.addEventListener("mousedown", function () {
            if (isOpen(win)) focusWindow(win);
        });
        makeWindowDraggable(win);
    });

    window.onload = function () {
        openWindow("about");
    };
})();
