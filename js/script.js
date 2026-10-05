(function () {
  "use strict";

  /* ---------- Project data ---------- */
  const projectDetails = {
    swarna: {
      title: "SWARNA",
      image: "assets/images/proyek/SWARNA.webp",
      imageAlt: "SWARNA project preview",
      stack: ["UX Design", "FIGMA", "Mobile App", "Smart Contract"],
      description:
        "SWARNA is a Web3 and NFC ecosystem designed to help artisans protect copyright ownership, verify product authenticity, and receive resale royalties through smart contract logic.",
      url: "https://github.com/hanifmuhammad13",
      linkLabel: "Open project",
    },
    cardguard: {
      title: "Card Guard",
      image: "assets/images/proyek/CardGuard.webp",
      imageAlt: "Card Guard project preview",
      stack: ["FastAPI", "Machine Learning", "Python", "Mobile App"],
      description:
        "Card Guard is a credit card fraud detection web application that combines machine learning prediction with a FastAPI backend to classify transaction risk in a clear, usable interface.",
      url: "https://github.com/hanifmuhammad13",
      linkLabel: "Open project",
    },
    fuelmate: {
      title: "FuelMate",
      image: "assets/images/proyek/FuelMate.webp",
      imageAlt: "FuelMate project preview",
      stack: ["Mobile App", "UI/UX", "Product Design"],
      description:
        "FuelMate is a mobile app concept for tracking fuel activity and finding stations more efficiently, with a workflow focused on fast logging, organized history, and accessible trip planning.",
      url: "https://github.com/hanifmuhammad13",
      linkLabel: "Open project",
    },
    clashofbang: {
      title: "ClashofBaNG",
      image: "assets/images/proyek/ClashofBaNG.webp",
      imageAlt: "ClashofBaNG project preview",
      stack: ["Community Web", "HTML/CSS/JS", "Figma"],
      description:
        "ClashofBaNG is a frontend prototype for a gaming community website, not a strategy game. The project workflow encompassed UI/UX design in Figma followed by pure frontend implementation using HTML, CSS, and JavaScript.",
      url: "https://github.com/hanifmuhammad13",
      linkLabel: "Open project",
    },
  };

  const header = document.getElementById("site-header");
  const progress = document.getElementById("progress");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const links = Array.from(document.querySelectorAll("[data-link]"));

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  links.forEach(function (a) {
    a.addEventListener("click", function () {
      setMenu(false);
    });
  });
  document.addEventListener("click", function (e) {
    if (!header.contains(e.target)) setMenu(false);
  });

  /* ---------- Scroll: header state + progress bar ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.classList.toggle("is-scrolled", y > 8);
      progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  const sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  function updateActive() {
    const probe = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= probe) current = sec.id;
    });
    links.forEach(function (a) {
      const on = a.getAttribute("href") === "#" + current;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();

  /* ---------- Scroll-triggered animations ---------- */
  const animated = document.querySelectorAll("[data-animate]");
  animated.forEach(function (el) {
    if (el.dataset.delay) el.style.setProperty("--delay", el.dataset.delay + "ms");
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    animated.forEach(function (el) {
      io.observe(el);
    });
  } else {
    animated.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Project modal ---------- */
  const modal = document.getElementById("project-modal");
  const modalClose = modal.querySelector(".modal__close");
  const mImage = document.getElementById("project-modal-image");
  const mTitle = document.getElementById("project-modal-title");
  const mBadges = document.getElementById("project-modal-badges");
  const mDesc = document.getElementById("project-modal-description");
  const mLink = document.getElementById("project-modal-link");
  let lastFocus = null;

  function openProject(id) {
    const p = projectDetails[id];
    if (!p) return;

    lastFocus = document.activeElement;
    mImage.src = p.image;
    mImage.alt = p.imageAlt;
    mTitle.textContent = p.title;
    mDesc.textContent = p.description;
    mLink.href = p.url;
    mLink.textContent = p.linkLabel + " ";
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    mLink.appendChild(arrow);

    mBadges.innerHTML = "";
    p.stack.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      mBadges.appendChild(li);
    });

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }

  function closeProject() {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  modal.addEventListener("close", function () {
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  });
  modalClose.addEventListener("click", closeProject);
  // klik di luar panel menutup modal
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeProject();
  });

  document.querySelectorAll("[data-project]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openProject(btn.dataset.project);
    });
  });
})();
