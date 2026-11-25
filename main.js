/* ============================================================
   ADIYASH GYM — KANDIVALI · interactions
   Vanilla JS, no build step, no external requests.
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const PHONE = "919324337728";
  const IST = "Asia/Kolkata";

  /* ── header state + reading progress ─────────────────────── */
  const head = $("#siteHead");
  const bar  = $("#progressBar");
  const toTop = $("#toTop");

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      head.classList.toggle("scrolled", y > 14);
      toTop.classList.toggle("show", y > 700);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + "%";
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ── mobile drawer ───────────────────────────────────────── */
  const burger = $("#burger");
  const drawer = $("#drawer");
  const scrim  = $("#scrim");
  const drawerClose = $("#drawerClose");
  let lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    scrim.hidden = false;
    requestAnimationFrame(() => scrim.classList.add("show"));
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("lock");
    drawerClose.focus();
  }
  function closeDrawer() {
    scrim.classList.remove("show");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("lock");
    setTimeout(() => { scrim.hidden = true; }, 400);
    if (lastFocus) lastFocus.focus();
  }
  burger.addEventListener("click", openDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  $$(".drawer-nav a, .drawer-foot a").forEach(a => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
    if (e.key === "Tab" && drawer.classList.contains("open")) {
      const f = $$("a, button", drawer).filter(el => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ── scroll reveal ───────────────────────────────────────── */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ── counting numbers ────────────────────────────────────── */
  const fmt = (n, dec) => dec
    ? n.toFixed(dec)
    : Math.round(n).toLocaleString("en-IN");

  function runCount(el) {
    const target = parseFloat(el.dataset.target);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    if (reduceMotion) { el.textContent = fmt(target, dec); return; }
    const dur = 1500, t0 = performance.now();
    function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, dec);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target, dec);
    }
    requestAnimationFrame(step);
  }

  const counts = $$(".count");
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counts.forEach(c => cio.observe(c));
  } else counts.forEach(c => (c.textContent = fmt(parseFloat(c.dataset.target), parseInt(c.dataset.decimals || "0", 10))));

  /* ── Mumbai clock + open status ──────────────────────────── */
  const liveClock = $("#liveClock");
  const liveStatus = $("#liveStatus");
  const footClock = $("#footClock");
  $("#year").textContent = new Date().getFullYear();

  function istParts() {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: IST, hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short"
    });
    const parts = {};
    f.formatToParts(new Date()).forEach(p => (parts[p.type] = p.value));
    return { h: parseInt(parts.hour, 10), m: parts.minute, day: parts.weekday };
  }
  function tickClock() {
    const { h, m, day } = istParts();
    const h12 = ((h + 11) % 12) + 1;
    const ap = h < 12 ? "AM" : "PM";
    const t = `${h12}:${m} ${ap}`;
    if (liveClock) liveClock.textContent = `${t} IST · open 24×7`;
    if (footClock) footClock.textContent = t;
    if (liveStatus) liveStatus.textContent = "Open now · never closes";
    highlightNow(h);
  }

  /* ── footfall chart ──────────────────────────────────────── */
  // 24-hour typical traffic model, index = hour of day
  const TRAFFIC = [.16,.12,.09,.07,.10,.24,.52,.68,.60,.46,.34,.26,.22,.18,.16,.20,.32,.50,.74,.92,.96,.80,.52,.30];
  const chart = $("#footChart");
  const chartNow = $("#chartNow");
  let bars = [];

  function buildChart() {
    if (!chart) return;
    TRAFFIC.forEach((v, h) => {
      const b = document.createElement("div");
      b.className = "bar " + (v >= .72 ? "peak" : v >= .28 ? "busy" : "quiet");
      b.style.height = Math.max(8, v * 100) + "%";
      b.style.transitionDelay = (h * 14) + "ms";
      b.dataset.hour = h;
      b.title = `${String(h).padStart(2, "0")}:00 — ${v >= .72 ? "peak" : v >= .28 ? "busy" : "quiet"}`;
      chart.appendChild(b);
      bars.push(b);
    });

    const labels = document.createElement("div");
    labels.className = "chart-labels";
    for (let h = 0; h < 24; h++) {
      const s = document.createElement("span");
      s.textContent = h % 3 === 0 ? String(h).padStart(2, "0") : "";
      labels.appendChild(s);
    }
    chart.after(labels);

    requestAnimationFrame(() => requestAnimationFrame(() => chart.classList.add("ready")));

    if ("IntersectionObserver" in window && !reduceMotion) {
      const co = new IntersectionObserver((en) => {
        if (en[0].isIntersecting) { chart.classList.add("ready"); co.disconnect(); }
      }, { threshold: 0.35 });
      co.observe(chart);
    }
  }
  function highlightNow(h) {
    bars.forEach(b => b.classList.remove("now"));
    const b = bars[h];
    if (b) {
      b.classList.add("now");
      if (chartNow) chartNow.innerHTML = `<i aria-hidden="true"></i>Now · ${String(h).padStart(2, "0")}:00`;
    }
  }
  buildChart();
  tickClock();
  setInterval(tickClock, 30000);

  /* ── programme matcher ───────────────────────────────────── */
  const chips = $$(".chip");
  const progs = $$(".prog:not(.prog-cta)");
  const hint = $("#matcherHint");
  const HINTS = {
    fat:    "Start with Cardio & conditioning + the Nutrition desk.",
    muscle: "Start with Strength, then add CrossFit-style days.",
    fit:    "General fitness? Conditioning + CrossFit-style is the sweet spot.",
    pt:     "1:1 coaching — Personal training is where you start.",
    all:    "Tap a goal — we’ll flag where to start."
  };

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const goal = chip.dataset.goal;
      const isReset = goal === "all";
      const wasActive = chip.getAttribute("aria-pressed") === "true";

      chips.forEach(c => c.setAttribute("aria-pressed", "false"));

      if (isReset || wasActive) {
        progs.forEach(p => p.classList.remove("is-dim"));
        if (hint) hint.textContent = HINTS.all;
        return;
      }

      chip.setAttribute("aria-pressed", "true");
      progs.forEach(p => {
        const goals = (p.dataset.goals || "").split(" ");
        p.classList.toggle("is-dim", !goals.includes(goal));
      });
      if (hint) hint.textContent = HINTS[goal] || HINTS.all;
    });
  });

  /* ── gallery scroller ────────────────────────────────────── */
  const track = $("#galTrack");
  const step = () => (track ? Math.max(280, track.clientWidth * 0.72) : 300);
  $("#galNext")?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));
  $("#galPrev")?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));

  if (track) {
    // drag-to-scroll for mouse users
    let down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
    });
    track.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    const up = () => { down = false; };
    track.addEventListener("pointerup", up);
    track.addEventListener("pointerleave", up);
    track.addEventListener("click", (e) => { if (moved) e.preventDefault(); });
  }

  /* ── FAQ accordion ───────────────────────────────────────── */
  const faqs = $$(".faq-item");
  faqs.forEach(d => d.addEventListener("toggle", () => {
    if (d.open) faqs.forEach(o => { if (o !== d) o.open = false; });
  }));

  /* ── trial form → WhatsApp ───────────────────────────────── */
  const form = $("#trialForm");
  const nameEl = $("#name");
  const phoneEl = $("#phone");
  const success = $("#tfSuccess");

  // earliest selectable day = today (IST)
  const dateEl = $("#date");
  if (dateEl) {
    const now = new Date();
    const ist = new Date(now.getTime() + (330 + now.getTimezoneOffset()) * 60000);
    dateEl.min = ist.toISOString().slice(0, 10);
  }

  phoneEl?.addEventListener("input", () => {
    phoneEl.value = phoneEl.value.replace(/\D/g, "").slice(0, 10);
  });

  function setError(input, msg, wrap) {
    const errEl = $(`.err[data-for="${input.id}"]`);
    if (errEl) errEl.textContent = msg || "";
    (wrap || input).classList.toggle("bad", Boolean(msg));
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    if (nameEl.value.trim().length < 2) {
      setError(nameEl, "Please tell us your name."); ok = false;
    } else setError(nameEl, "");

    const digits = phoneEl.value.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setError(phoneEl, "Enter a valid 10-digit Indian mobile number.", phoneEl.closest(".phone-wrap")); ok = false;
    } else setError(phoneEl, "", phoneEl.closest(".phone-wrap"));

    if (!ok) {
      const firstBad = $(".bad", form);
      if (firstBad) (firstBad.tagName === "INPUT" ? firstBad : $("input", firstBad))?.focus();
      return;
    }

    const goal = $("#goal").value;
    const slot = $("#slot").value;
    const date = dateEl?.value
      ? new Date(dateEl.value + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })
      : "any day";

    const msg =
      `Hi Adiyash Kandivali! I'd like to book a free trial.\n` +
      `Name: ${nameEl.value.trim()}\n` +
      `Mobile: +91 ${digits}\n` +
      `Goal: ${goal}\n` +
      `Preferred time: ${slot}\n` +
      `Preferred day: ${date}`;

    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");

    success.hidden = false;
    if (!reduceMotion) success.scrollIntoView({ block: "nearest", behavior: "smooth" });
    form.querySelector("button[type=submit]").textContent = "Open WhatsApp again";
    form.querySelector("button[type=submit]").insertAdjacentHTML("beforeend", '<svg class="ic"><use href="#i-wa"/></svg>');
  });

  /* ── active nav link ────────────────────────────────────── */
  const navLinks = $$(".nav a");
  const targets = navLinks
    .map(a => ({ a, el: document.getElementById(a.getAttribute("href").slice(1)) }))
    .filter(t => t.el);

  if ("IntersectionObserver" in window && targets.length) {
    const nio = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(l => l.removeAttribute("aria-current"));
        const hit = targets.find(t => t.el === en.target);
        if (hit) hit.a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach(t => nio.observe(t.el));
  }
})();
