/* Flametree Attribution — site behaviour
   nav, mobile menu, scroll reveal, Netlify-native form submit
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector(".nav__burger");
  var menu = document.querySelector(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Forms (Netlify native, AJAX) ---------- */
  function setStatus(form, ok, message) {
    var box = form.querySelector(".form__status");
    if (!box) {
      box = document.createElement("div");
      box.className = "form__status";
      form.appendChild(box);
    }
    box.className = "form__status " + (ok ? "form__status--ok" : "form__status--err");
    box.textContent = message;
  }

  function encode(data) {
    var params = new URLSearchParams();
    data.forEach(function (value, key) { params.append(key, value); });
    return params.toString();
  }

  document.querySelectorAll("form[data-netlify='true']").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var btn = form.querySelector("button[type='submit']");
      var oldLabel = btn ? btn.innerHTML : null;
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(new FormData(form))
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed (" + res.status + ")");
          setStatus(form, true, form.dataset.success || "Thanks — we'll be in touch.");
          form.reset();
        })
        .catch(function () {
          setStatus(form, false, "Something went wrong. Please try again, or email us directly.");
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = oldLabel || "Subscribe"; }
        });
    });
  });
})();
