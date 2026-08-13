/* =====================================================
   Thomas Colin — Data Visualization Portfolio
   Single source of truth: /projects/manifest.json
   Drives both the gallery (index.html) and each project
   page (project.html?slug=). Add a viz = add a manifest
   entry; it appears everywhere automatically.
   ===================================================== */

const FOCUS_LABELS = {
  network: "Networks",
  story: "Scrollytelling",
  personal: "Personal Data",
  fun: "Creative",
  reference: "Reference",
  experimental: "Lab"
};

async function loadManifest() {
  const res = await fetch("/projects/manifest.json", { cache: "no-store" });
  if (!res.ok) throw new Error("manifest fetch failed: " + res.status);
  return res.json();
}

/* GitHub source link, honouring the preview branch vs. master */
function sourceUrl(manifest, proj) {
  const branch = manifest.blobBranch || "master";
  return `https://github.com/${manifest.github}/${manifest.repo}/tree/${branch}/${proj.sourceDir}`;
}

/* ---------- Gallery ---------- */
function renderGallery(manifest) {
  const projects = manifest.projects;
  const holder = document.getElementById("cards");
  if (!holder) return;
  holder.innerHTML = "";

  const fragment = document.createDocumentFragment();
  projects.forEach(p => {
    const a = document.createElement("a");
    a.className = "card" + (p.featured ? " wide" : "");
    a.dataset.focus = p.focus || "";
    a.href = `project.html?slug=${p.slug}`;

    a.innerHTML = `
      <div class="card-frame">
        <img src="${p.thumbnail}" alt="${p.title}" loading="lazy">
        <span class="live-tag">Live · ${FOCUS_LABELS[p.focus] || ""}</span>
      </div>
      <div class="card-body">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="card-meta">
          <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
          <span class="card-arrow">→</span>
        </div>
        <div style="margin-top:.7rem;"><span class="card-year">${p.year}</span></div>
      </div>`;
    fragment.appendChild(a);
  });
  holder.appendChild(fragment);
  bindFilters();
}

function bindFilters() {
  const active = document.querySelector(".chip.on");
  const on = active ? active.dataset.f : "all";
  applyFilter(on);
}

function applyFilter(f) {
  const cards = document.querySelectorAll("#cards .card");
  cards.forEach(c => {
    const show = f === "all" || c.dataset.focus === f;
    c.classList.toggle("is-hidden", !show);
  });
}

function initFilters(manifest) {
  const bar = document.getElementById("filters");
  if (!bar) return;
  const chips = new Set(manifest.projects.map(p => p.focus));
  const labelFor = id => FOCUS_LABELS[id] || id;

  const all = document.createElement("button");
  all.className = "chip on"; all.dataset.f = "all"; all.textContent = "All";
  bar.appendChild(all);

  [...chips].forEach(f => {
    const b = document.createElement("button");
    b.className = "chip"; b.dataset.f = f; b.textContent = labelFor(f);
    bar.appendChild(b);
  });

  bar.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    bar.querySelectorAll(".chip").forEach(c => c.classList.remove("on"));
    chip.classList.add("on");
    applyFilter(chip.dataset.f);
  });
  applyFilter("all");
}

/* ---------- Project page ---------- */
function renderProject(manifest) {
  const params = new URLSearchParams(location.search);
  const slug = params.get("slug");
  const proj = manifest.projects.find(p => p.slug === slug);

  const nav = document.getElementById("projectNav");
  const head = document.getElementById("projectHead");
  const stage = document.getElementById("projectStage");

  if (!proj) {
    if (head) head.innerHTML = `<h1>Project not found.</h1><p class="desc"><a href="/">Back to the gallery.</a></p>`;
    return;
  }

  document.title = `${proj.title} — ${manifest.owner}`;

  if (nav) nav.querySelector(".source-link").href = sourceUrl(manifest, proj);
  if (head) {
    head.innerHTML = `
      <h1>${proj.title}</h1>
      <p class="desc">${proj.description}</p>
      <div class="pmeta">
        <span>Focus — <b>${FOCUS_LABELS[proj.focus] || proj.focus}</b></span>
        <span>Stack — <b>${proj.stack.join(" · ")}</b></span>
        <span>${proj.year}</span>
      </div>`;
  }
  if (stage) {
    stage.innerHTML = `
      <iframe class="viz-frame" src="${proj.entry}" title="${proj.title}"
        loading="eager" allowfullscreen></iframe>
      <div class="viz-caption">
        <span>${proj.tags.join(" · ")}</span>
        <a href="${sourceUrl(manifest, proj)}" target="_blank" rel="noopener">View source on GitHub →</a>
      </div>`;
  }
}

/* ---------- Boot ---------- */
(async function boot() {
  try {
    const manifest = await loadManifest();
    if (document.getElementById("cards")) {
      initFilters(manifest);
      renderGallery(manifest);
    }
    if (document.getElementById("projectStage")) {
      renderProject(manifest);
    }
  } catch (err) {
    console.error("[portfolio] failed to initialise:", err);
    const holder = document.getElementById("cards");
    if (holder) holder.innerHTML = `<p style="color:#a22;padding:2rem;">Could not load the project registry. Check that <code>/projects/manifest.json</code> is present.</p>`;
  }
})();
