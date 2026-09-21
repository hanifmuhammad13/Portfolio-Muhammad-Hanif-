(function () {
  const icons = document.querySelectorAll(".icon[data-window]");
  const closeButtons = document.querySelectorAll("[data-close]");
  const taskbarApps = document.getElementById("taskbar-apps");
  const clock = document.getElementById("clock");
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
    document.querySelectorAll(".task-btn").forEach(function (btn) {
      btn.classList.toggle(
        "is-active",
        btn.dataset.focus === win.id.replace("window-", ""),
      );
    });
  }

  function renderTaskbar() {
    const openWindows = document.querySelectorAll(".window:not([hidden])");
    taskbarApps.innerHTML = "";
    openWindows.forEach(function (win) {
      const id = win.id.replace("window-", "");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "task-btn is-active";
      btn.dataset.focus = id;
      btn.textContent = win.dataset.title || id;
      btn.addEventListener("click", function () {
        focusWindow(win);
      });
      taskbarApps.appendChild(btn);
    });
  }

  function openWindow(id) {
    const win = getWindow(id);
    if (!win) return;
    win.hidden = false;
    focusWindow(win);
    renderTaskbar();
  }

  function closeWindow(id) {
    const win = getWindow(id);
    if (!win) return;
    win.hidden = true;
    renderTaskbar();
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
  });

  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = now.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    clock.textContent = date + "  " + time;
    clock.dateTime = now.toISOString();
  }

  updateClock();
  setInterval(updateClock, 1000);

  window.onload = function () {
    openWindow("about");
  };
})();
