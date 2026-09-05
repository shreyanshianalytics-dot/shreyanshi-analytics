(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  var form = document.getElementById("contact-form");
  var statusEl = document.getElementById("form-status");
  var navLinks = document.querySelectorAll("[data-nav]");
  var sections = document.querySelectorAll("main section[id]");
  var desktopQuery = window.matchMedia("(min-width: 1101px)");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add("is-open");
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }

  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.addEventListener("click", function (event) {
      var target = event.target;
      if (target instanceof Element && target.closest("a")) {
        closeNav();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  function onViewportChange() {
    if (desktopQuery.matches) closeNav();
  }

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener("change", onViewportChange);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(onViewportChange);
  }

  function setActive() {
    if (!header || !navLinks.length || !sections.length) return;
    var offset = header.offsetHeight + 48;
    var current = "home";
    for (var i = 0; i < sections.length; i += 1) {
      if (sections[i].getBoundingClientRect().top - offset <= 0) {
        current = sections[i].id;
      }
    }
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("hashchange", function () {
    requestAnimationFrame(setActive);
  });
  setActive();

  if (form && statusEl) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      statusEl.classList.remove("error");

      var nameField = form.elements.namedItem("name");
      var emailField = form.elements.namedItem("email");
      var messageField = form.elements.namedItem("message");
      var name = nameField && "value" in nameField ? nameField.value.trim() : "";
      var email = emailField && "value" in emailField ? emailField.value.trim() : "";
      var message = messageField && "value" in messageField ? messageField.value.trim() : "";
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email || !message) {
        statusEl.classList.add("error");
        statusEl.textContent = "Please complete name, email and your requirement.";
        return;
      }

      if (!emailOk) {
        statusEl.classList.add("error");
        statusEl.textContent = "Please enter a valid email address.";
        return;
      }

      form.reset();
      statusEl.textContent = "Thank you, " + name + ". Your inquiry is prepared in this preview. Add a business email to this page before publishing so messages can be delivered.";
    });
  }
})();
