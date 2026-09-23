(function () {
  const icons = document.querySelectorAll(".icon[data-window]");
  const closeButtons = document.querySelectorAll("[data-close]");
  const clock = document.getElementById("clock");
  const projectButtons = document.querySelectorAll(".project-link[data-project]");
  const projectModal = document.getElementById("project-modal");
  const projectModalClose = projectModal
    ? projectModal.querySelector(".project-modal__close")
    : null;
  const projectModalImage = document.getElementById("project-modal-image");
  const projectModalTitle = document.getElementById("project-modal-title");
  const projectModalBadges = document.getElementById("project-modal-badges");
  const projectModalDescription = document.getElementById(
    "project-modal-description",
  );
  const projectModalLink = document.getElementById("project-modal-link");
  let zIndex = 10;
  let lastFocusedElement = null;
  let modalTransitionTimer = null;

  const projectDetails = {
    swarna: {
      title: "SWARNA",
      image: "assets/images/proyek/SWARNA.png",
      imageAlt: "SWARNA project preview",
      stack: ["Web3", "NFC", "Smart Contract"],
      description:
        "SWARNA is a Web3 and NFC ecosystem designed to help artisans protect copyright ownership, verify product authenticity, and receive resale royalties through smart contract logic.",
      url: "https://github.com/hanifmuhammad13",
      linkLabel: "Open project",
    },
    cardguard: {
      title: "Card Guard",
      image: "assets/images/proyek/CardGuard.png",
      imageAlt: "Card Guard project preview",
      stack: ["FastAPI", "Machine Learning", "Python"],
      description:
        "Card Guard is a credit card fraud detection web application that combines machine learning prediction with a FastAPI backend to classify transaction risk in a clear, usable interface.",
      url: "https://github.com/hanifmuhammad13",
      linkLabel: "Open project",
    },
    fuelmate: {
      title: "FuelMate",
      image: "assets/images/proyek/FuelMate.png",
      imageAlt: "FuelMate project preview",
      stack: ["Mobile App", "UI/UX", "Product Design"],
      description:
        "FuelMate is a mobile app concept for tracking fuel activity and finding stations more efficiently, with a workflow focused on fast logging, organized history, and accessible trip planning.",
      url: "https://github.com/hanifmuhammad13",
      linkLabel: "Open project",
    },
    clashofbang: {
      title: "ClashofBaNG",
      image: "assets/images/proyek/ClashofBaNG.png",
      imageAlt: "ClashofBaNG project preview",
      stack: ["Game", "Java", "Strategy"],
      description:
        "ClashofBaNG is a Java strategy game project with competitive mechanics, interactive gameplay, and structured progression systems built around player decisions and tactical play.",
      url: "https://github.com/hanifmuhammad13",
      linkLabel: "Open project",
    },
  };

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

  function renderTaskbar() {
    return;
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

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function moveWindow(win, left, top) {
    const layer = document.getElementById("windows-layer");
    const layerRect = layer.getBoundingClientRect();
    const winRect = win.getBoundingClientRect();
    const maxLeft = Math.max(0, layerRect.width - winRect.width);
    const maxTop = Math.max(0, layerRect.height - winRect.height);

    win.style.left = clamp(left, 0, maxLeft) + "px";
    win.style.top = clamp(top, 0, maxTop) + "px";
    win.style.transform = "none";
  }

  function makeWindowDraggable(win) {
    const handle = win.querySelector(".window-bar");
    if (!handle) return;

    let dragState = null;

    handle.addEventListener("pointerdown", function (event) {
      if (event.button !== 0 || event.target.closest("button")) return;

      const layer = document.getElementById("windows-layer");
      const layerRect = layer.getBoundingClientRect();
      const winRect = win.getBoundingClientRect();

      focusWindow(win);
      dragState = {
        offsetX: event.clientX - winRect.left,
        offsetY: event.clientY - winRect.top,
        layerLeft: layerRect.left,
        layerTop: layerRect.top,
      };

      win.classList.add("is-dragging");
      handle.setPointerCapture(event.pointerId);
      moveWindow(
        win,
        winRect.left - layerRect.left,
        winRect.top - layerRect.top,
      );
    });

    handle.addEventListener("pointermove", function (event) {
      if (!dragState) return;

      moveWindow(
        win,
        event.clientX - dragState.layerLeft - dragState.offsetX,
        event.clientY - dragState.layerTop - dragState.offsetY,
      );
    });

    function stopDragging(event) {
      if (!dragState) return;

      dragState = null;
      win.classList.remove("is-dragging");

      if (handle.hasPointerCapture(event.pointerId)) {
        handle.releasePointerCapture(event.pointerId);
      }
    }

    handle.addEventListener("pointerup", stopDragging);
    handle.addEventListener("pointercancel", stopDragging);
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

  function renderProjectLink(label) {
    if (!projectModalLink) return;

    projectModalLink.innerHTML = "";
    projectModalLink.appendChild(document.createTextNode(label + " "));

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    projectModalLink.appendChild(arrow);
  }

  function openProjectModal(projectId) {
    const project = projectDetails[projectId];

    if (
      !project ||
      !projectModal ||
      !projectModalClose ||
      !projectModalImage ||
      !projectModalTitle ||
      !projectModalBadges ||
      !projectModalDescription ||
      !projectModalLink
    ) {
      return;
    }

    clearTimeout(modalTransitionTimer);
    lastFocusedElement = document.activeElement;
    projectModalImage.src = project.image;
    projectModalImage.alt = project.imageAlt;
    projectModalTitle.textContent = project.title;
    projectModalDescription.textContent = project.description;
    projectModalLink.href = project.url;
    renderProjectLink(project.linkLabel);

    projectModalBadges.innerHTML = "";
    project.stack.forEach(function (item) {
      const badge = document.createElement("span");
      badge.className = "project-modal__badge";
      badge.textContent = item;
      projectModalBadges.appendChild(badge);
    });

    projectModal.hidden = false;

    requestAnimationFrame(function () {
      projectModal.classList.add("is-open");
      projectModalClose.focus();
    });
  }

  function closeProjectModal() {
    if (!projectModal || projectModal.hidden) return;

    projectModal.classList.remove("is-open");
    modalTransitionTimer = setTimeout(function () {
      projectModal.hidden = true;

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }, 220);
  }

  projectButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      openProjectModal(button.dataset.project);
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener("click", closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener("click", function (event) {
      if (event.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeProjectModal();
    }
  });

  document.querySelectorAll(".window").forEach(function (win) {
    makeWindowDraggable(win);

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
