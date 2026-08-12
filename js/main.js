/* ==========================================================================
   MEDULOC MEDICAL DEVICES — PRECISION / MOTION SCRIPT
   Reversible Animations, Category Explorer & Form Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initReversibleScrollObserver();
  initCategoryTabs();
  initModalAndForm();
  initSystemHotspots();
});

/* ==========================================================================
   1. Reversible Scroll Observer Engine
   ========================================================================== */
function initReversibleScrollObserver() {
  const animatedElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
  if (!animatedElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   2. Category Tabs (Section 04)
   ========================================================================== */
const catData = [
  {
    title: "Trauma Fixation",
    desc: "Sparing periosteal blood flow and joint capsules in acute diaphyseal and metaphyseal long-bone fractures.",
    stat1: "1.5 mm", stat1Label: "Entry Footprint",
    stat2: "100%", stat2Label: "Sterile Kit Integrity"
  },
  {
    title: "Joint Replacement & Reconstruction",
    desc: "Minimally invasive intramedullary alignment supporting rapid joint load restoration without joint capsule invasion.",
    stat1: "0", stat1Label: "Capsular Incisions",
    stat2: "Ti-6Al-4V", stat2Label: "Anchor Material"
  },
  {
    title: "Spine & Dynamic Stabilization",
    desc: "Nitinol superelastic load sharing engineered to distribute axial strain continuously along natural motion segments.",
    stat1: "8.0%", stat1Label: "Max Elastic Strain",
    stat2: "Niti-01", stat2Label: "Alloy Spec"
  },
  {
    title: "Sports Medicine",
    desc: "Soft-tissue envelope protection for upper and lower extremity athletic trauma enabling accelerated rehabilitation.",
    stat1: "-35 min", stat1Label: "OR Time Reduction",
    stat2: "Single-Use", stat2Label: "Instrumentation"
  },
  {
    title: "Extremities (Hand & Foot)",
    desc: "High-precision fixation for metacarpals, metatarsals, clavicle, radius, ulna, and fibula fractures.",
    stat1: "5+", stat1Label: "Cleared Indications",
    stat2: "510(k)", stat2Label: "FDA Clearance"
  }
];

function initCategoryTabs() {
  const buttons = document.querySelectorAll('.cat-tab-btn');
  if (!buttons.length) return;

  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = catData[idx];
      if (data) {
        document.getElementById('catTitle').textContent = data.title;
        document.getElementById('catDesc').textContent = data.desc;
        document.getElementById('catStat1').textContent = data.stat1;
        document.getElementById('catStat1Label').textContent = data.stat1Label;
        document.getElementById('catStat2').textContent = data.stat2;
        document.getElementById('catStat2Label').textContent = data.stat2Label;
      }
    });
  });
}

/* ==========================================================================
   3. Form & Toast Notification System
   ========================================================================== */
function initModalAndForm() {
  const backdrop = document.getElementById('modalBackdrop');
  const form = document.getElementById('infoRequestForm');
  const toast = document.getElementById('toast');

  window.openModal = function() {
    if (backdrop) backdrop.classList.add('active');
  };

  window.closeModal = function() {
    if (backdrop) backdrop.classList.remove('active');
  };

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();

      if (toast) {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
        }, 4500);
      }
      form.reset();
    });
  }
}

/* ==========================================================================
   4. Interactive System Hotspot Inspector
   ========================================================================== */
function initSystemHotspots() {
  const pins = document.querySelectorAll('.hotspot-pin');
  const tooltipCard = document.getElementById('systemTooltip');
  const tagEl = document.getElementById('tooltipTag');
  const titleEl = document.getElementById('tooltipTitle');
  const descEl = document.getElementById('tooltipDesc');
  const specEl = document.getElementById('tooltipSpec');

  if (!pins.length || !tooltipCard || !titleEl || !descEl || !specEl) return;

  pins.forEach((pin, idx) => {
    const componentNum = String(idx + 1).padStart(2, '0');
    const tag = `COMPONENT // ${componentNum}`;
    const title = pin.getAttribute('data-title');
    const desc = pin.getAttribute('data-desc');
    const spec = pin.getAttribute('data-spec');

    pin.addEventListener('mouseenter', () => {
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');
      updateTooltip(tag, title, desc, spec);
      tooltipCard.classList.add('visible');
    });

    pin.addEventListener('mouseleave', () => {
      pin.classList.remove('active');
      // Only hide tooltip if no hotspot pin is currently being hovered
      const anyHovered = Array.from(pins).some(p => p.matches(':hover'));
      if (!anyHovered) {
        tooltipCard.classList.remove('visible');
      }
    });

    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = pin.classList.contains('active');
      pins.forEach(p => p.classList.remove('active'));
      
      if (!isActive) {
        pin.classList.add('active');
        updateTooltip(tag, title, desc, spec);
        tooltipCard.classList.add('visible');
      } else {
        tooltipCard.classList.remove('visible');
      }
    });
  });

  // Hide explanation if user clicks outside of hotspots
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hotspot-pin')) {
      pins.forEach(p => p.classList.remove('active'));
      tooltipCard.classList.remove('visible');
    }
  });

  function updateTooltip(tag, title, desc, spec) {
    if (tagEl) tagEl.textContent = tag;
    titleEl.textContent = title;
    descEl.textContent = desc;
    specEl.textContent = spec;
  }
}

