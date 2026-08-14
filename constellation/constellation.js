/* ===========================================================
   Constellation — D3 radial layout with drill-down
   =========================================================== */

const RINGS = {
  knowledge: { radius: 145, r: 7, class: 'knowledge', spread: 0.65 },
  data:      { radius: 260, r: 6, class: 'data',      spread: 0.8  },
  agent:     { radius: 400, r: 10, class: 'agent',     spread: 0.5  },
};
const HUB_R = 28;

let state = {
  zoom: 1,
  activeAgent: null,
  nodes: [],      // { id, type, label, summary, x, y, r, ... }
  edges: [],       // { source: agentId, target: kdId }
  sourceNodes: {}, // keyed by id, reference for rings
};

// ─── STARFIELD BACKGROUND ────────────────────────────────
(function starfield() {
  const c = document.getElementById('starfield');
  const ctx = c.getContext('2d');
  function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  const stars = Array.from({ length: 280 }, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + 0.3,
    o: Math.random() * 0.6 + 0.15,
  }));

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    const w = c.width, h = c.height;
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255,255,255,${s.o})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── LOAD DATA & RENDER ───────────────────────────────────
(async function init() {
  try {
    const spec = await d3.json('department-content-strategy.json');
    buildGraph(spec);
    render();
    bindZoom();
  } catch (e) {
    console.error('Failed to load constellation spec:', e);
    document.querySelector('#constellation').innerHTML =
      '<text x="50%" y="50%" fill="#8890a4" text-anchor="middle" font-family="Inter" font-size="14">Could not load department spec.</text>';
  }
})();

function buildGraph(spec) {
  const nodes = [], edges = [], sourceNodes = {};
  const cx = 0, cy = 0; // hub center (offset by zoom transform in render)

  // Hub
  const hub = { id: 'hub', type: 'hub', label: spec.hub.label, x: 0, y: 0, r: HUB_R, summary: spec.summary };
  nodes.push(hub);

  // Helper: place ring nodes
  function placeRing(items, ringKey, type, extra) {
    const n = items.length;
    if (n === 0) return;
    const cfg = RINGS[ringKey];
    const arcSpan = Math.PI * 2 * cfg.spread;
    const startAngle = (Math.PI * 2 - arcSpan) / 2 - Math.PI / 2; // start from top, arc around

    items.forEach((it, i) => {
      const angle = startAngle + (n === 1 ? arcSpan / 2 : (i / (n - 1)) * arcSpan);
      const x = cx + cfg.radius * Math.cos(angle);
      const y = cy + cfg.radius * Math.sin(angle);
      const node = {
        id: it.id, type, label: it.label, summary: it.summary || '',
        x, y, r: cfg.r,
        source: it.source || '',
        ...(extra || {}),
      };
      nodes.push(node);
      sourceNodes[it.id] = node;
    });
  }

  // Knowledge ring
  placeRing(spec.knowledge || [], 'knowledge', 'knowledge');

  // Data ring
  placeRing(spec.data || [], 'data', 'data');

  // Agent ring
  placeRing(spec.agents || [], 'agent', 'agent', { output: null });
  (spec.agents || []).forEach(a => {
    const an = sourceNodes[a.id];
    if (!an) return;
    an.output = a.output || '';
    // Edges from agent to its knowledge nodes
    (a.uses_knowledge || []).forEach(kid => {
      if (sourceNodes[kid]) edges.push({ source: a.id, target: kid });
    });
    (a.uses_data || []).forEach(did => {
      if (sourceNodes[did]) edges.push({ source: a.id, target: did });
    });
  });

  state.nodes = nodes;
  state.edges = edges;
  state.sourceNodes = sourceNodes;
  state.spec = spec;
}

// ─── RENDER ───────────────────────────────────────────────
function render() {
  const svg = d3.select('#constellation');
  svg.selectAll('*').remove();

  const W = window.innerWidth, H = window.innerHeight;
  svg.attr('viewBox', [0, 0, W, H]);

  // Root group for zoom transform
  const g = svg.append('g').attr('id', 'viz-root');

  // Defs: glow filters
  const defs = svg.append('defs');
  const glow = defs.append('filter').attr('id', 'glow-amber');
  glow.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'blur');
  const mg = glow.append('feMerge');
  mg.append('feMergeNode').attr('in', 'blur');
  mg.append('feMergeNode').attr('in', 'SourceGraphic');

  const glowAgent = defs.append('filter').attr('id', 'glow-agent');
  glowAgent.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
  const mg2 = glowAgent.append('feMerge');
  mg2.append('feMergeNode').attr('in', 'blur');
  mg2.append('feMergeNode').attr('in', 'SourceGraphic');

  // Hub ring (background glow)
  g.append('circle')
    .attr('cx', 0).attr('cy', 0).attr('r', 46)
    .attr('class', 'hub-glow');

  // Hub
  g.append('circle')
    .attr('cx', 0).attr('cy', 0).attr('r', HUB_R)
    .attr('fill', '#1a2030')
    .attr('stroke', 'rgba(255,255,255,0.25)')
    .attr('stroke-width', 1.5);
  g.append('text')
    .attr('x', 0).attr('y', HUB_R + 28)
    .attr('class', 'hub-label')
    .text(state.nodes.find(n => n.id === 'hub')?.label || '');

  // Edges (initially dim)
  state.edges.forEach(e => {
    const src = state.sourceNodes[e.source];
    const tgt = state.sourceNodes[e.target];
    if (!src || !tgt) return;
    g.append('line')
      .attr('class', 'edge-line dimmed')
      .attr('data-source', e.source)
      .attr('data-target', e.target)
      .attr('x1', src.x).attr('y1', src.y)
      .attr('x2', tgt.x).attr('y2', tgt.y);
  });

  // Nodes (non-hub, non-agent first, agents on top)
  const regularNodes = state.nodes.filter(n => n.type !== 'hub' && n.type !== 'agent');
  const agentNodes = state.nodes.filter(n => n.type === 'agent');

  renderNodeGroup(g, regularNodes);
  renderAgentGroup(g, agentNodes);

  // Center the viewport on the hub
  const initialX = W / 2, initialY = H / 2;
  g.attr('transform', `translate(${initialX},${initialY}) scale(0.85)`);

  // Setup zoom
  state.rootG = g;
}

function renderNodeGroup(g, nodes) {
  nodes.forEach(n => {
    const fill = n.type === 'knowledge' ? '#d4a853' : '#4a90d9';
    const shapeClass = n.type === 'knowledge' ? 'knowledge' : 'data';

    g.append('circle')
      .attr('class', `node-circle ${shapeClass}`)
      .attr('data-id', n.id)
      .attr('cx', n.x).attr('cy', n.y)
      .attr('r', n.r)
      .attr('fill', fill)
      .attr('stroke', 'rgba(255,255,255,0.08)')
      .attr('stroke-width', 0.5)
      .attr('opacity', n.type === 'data' ? 0.85 : 1)
      .on('mouseenter', (evt) => onNodeHover(evt, n))
      .on('mouseleave', onNodeLeave)
      .on('click', (evt) => onNodeClick(evt, n));

    // Type marker
    const marker = n.type === 'knowledge' ? 'K' : 'D';
    g.append('text')
      .attr('x', n.x).attr('y', n.y + 4)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(255,255,255,0.65)')
      .attr('font-size', '7')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('pointer-events', 'none')
      .text(marker);

    // Label
    g.append('text')
      .attr('x', n.x).attr('y', n.y - n.r - 9)
      .attr('class', 'node-label')
      .text(n.label);
  });
}

function renderAgentGroup(g, agents) {
  agents.forEach(n => {
    // Pulse ring behind agent
    g.append('circle')
      .attr('class', 'agent-pulse')
      .attr('data-agent-pulse', n.id)
      .attr('cx', n.x).attr('cy', n.y);

    // Agent body
    g.append('circle')
      .attr('class', 'node-circle agent')
      .attr('data-id', n.id)
      .attr('cx', n.x).attr('cy', n.y)
      .attr('r', n.r)
      .attr('fill', '#2ed8a3')
      .attr('stroke', 'rgba(46,216,163,0.4)')
      .attr('stroke-width', 1.5)
      .on('mouseenter', (evt) => onNodeHover(evt, n))
      .on('mouseleave', onNodeLeave)
      .on('click', (evt) => onNodeClick(evt, n));

    // 'A' marker
    g.append('text')
      .attr('x', n.x).attr('y', n.y + 4.5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(8,12,20,0.8)')
      .attr('font-size', '9')
      .attr('font-weight', '700')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('pointer-events', 'none')
      .text('A');

    // Label
    g.append('text')
      .attr('x', n.x).attr('y', n.y - n.r - 12)
      .attr('class', 'node-label')
      .text(n.label);
  });
}

// ─── INTERACTIONS ─────────────────────────────────────────
function onNodeHover(evt, node) {
  const tt = document.getElementById('tooltip');
  tt.innerHTML = `<div class="tt-label">${node.label}</div><div class="tt-summary">${node.summary || ''}</div>`;
  tt.style.opacity = '1';
  tt.style.left = (evt.clientX + 16) + 'px';
  tt.style.top = (evt.clientY - 10) + 'px';

  if (node.type === 'agent') {
    highlightAgentConnections(node.id);
  }
}

function onNodeLeave() {
  document.getElementById('tooltip').style.opacity = '0';
  clearHighlights();
}

function onNodeClick(evt, node) {
  if (node.type === 'agent') {
    openPanel(node);
  }
}

function highlightAgentConnections(agentId) {
  const g = state.rootG;
  // Dim all non-agent nodes
  g.selectAll('.node-circle').classed('node-faded', function() {
    const id = d3.select(this).attr('data-id');
    return id && id !== agentId && !state.edges.some(
      e => e.source === agentId && (e.target === id)
    );
  });

  // Highlight edges for this agent
  g.selectAll('.edge-line').each(function() {
    const d = d3.select(this);
    const src = d.attr('data-source');
    if (src === agentId) {
      d.classed('active', true).classed('dimmed', false);
    } else {
      d.classed('active', false).classed('dimmed', true);
    }
  });
}

function clearHighlights() {
  const g = state.rootG;
  g.selectAll('.node-circle').classed('node-faded', false);
  g.selectAll('.edge-line').classed('active', false).classed('dimmed', true);
}

// ─── DRILL-DOWN PANEL ─────────────────────────────────────
function openPanel(node) {
  const panel = document.getElementById('panel');
  document.getElementById('panelHead').innerHTML = `
    <div class="agent-label">${node.label}</div>
    <div class="agent-type">AI Agent</div>`;
  document.getElementById('panelBody').innerHTML = formatOutput(node.output);

  // Which K+D does this agent use?
  const conns = state.edges.filter(e => e.source === node.id);
  const kNodes = conns
    .map(e => state.sourceNodes[e.target])
    .filter(n => n && n.type === 'knowledge');
  const dNodes = conns
    .map(e => state.sourceNodes[e.target])
    .filter(n => n && n.type === 'data');

  document.getElementById('panelUses').innerHTML = `
    <h4>Draws on</h4>
    <div class="uses-list">
      ${kNodes.map(n => `<span class="uses-chip knowledge">${n.label}</span>`).join('')}
      ${dNodes.map(n => `<span class="uses-chip data">${n.label}</span>`).join('')}
    </div>`;

  panel.classList.add('open');
  state.activeAgent = node.id;
}

function formatOutput(text) {
  if (!text) return '<p>No output data.</p>';
  // Wrap numbers in highlight spans
  const highlighted = text
    .replace(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?%?)/g, '<span class="highlight-num">$1</span>')
    .replace(/(\d+\.?\d*[KM]?\s*(?:reach|likes|saves|shares|followers))/gi,
      '<span class="highlight-num">$1</span>');
  return `<div class="output-text">${highlighted}</div>`;
}

document.getElementById('panelClose').addEventListener('click', () => {
  document.getElementById('panel').classList.remove('open');
  state.activeAgent = null;
});

// ─── ZOOM ─────────────────────────────────────────────────
function bindZoom() {
  const svg = d3.select('#constellation');
  const g = state.rootG;

  const zoom = d3.zoom()
    .scaleExtent([0.3, 3])
    .on('zoom', (evt) => {
      g.attr('transform', evt.transform);
    });

  svg.call(zoom);

  // Also allow click-on-whitespace to close panel + clear highlights
  svg.on('click.background', () => {
    const panel = document.getElementById('panel');
    if (panel.classList.contains('open')) {
      panel.classList.remove('open');
      state.activeAgent = null;
    }
  });

  // Zoom control buttons
  document.getElementById('zoomIn').addEventListener('click', () => {
    svg.transition().duration(250).call(zoom.scaleBy, 1.4);
  });
  document.getElementById('zoomOut').addEventListener('click', () => {
    svg.transition().duration(250).call(zoom.scaleBy, 0.7);
  });
  document.getElementById('zoomFit').addEventListener('click', () => {
    const W = window.innerWidth, H = window.innerHeight;
    svg.transition().duration(500).call(
      zoom.transform,
      d3.zoomIdentity.translate(W / 2, H / 2).scale(0.85)
    );
  });

  // Init transform
  const W = window.innerWidth, H = window.innerHeight;
  svg.call(zoom.transform, d3.zoomIdentity.translate(W / 2, H / 2).scale(0.85));
}

// ─── CLICK-AWAY PANEL CLOSE ───────────────────────────────
document.addEventListener('click', (evt) => {
  const panel = document.getElementById('panel');
  if (!panel.classList.contains('open')) return;
  if (evt.target.closest('.panel')) return;
  if (evt.target.closest('.node-circle')) return;
  if (evt.target.closest('button')) return;
  panel.classList.remove('open');
  state.activeAgent = null;
});
