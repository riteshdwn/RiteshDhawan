/* ============================================================
   RITESH DHAWAN — Spider-Man portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Loader ---------- */
  window.addEventListener('load', function () {
    setTimeout(function () {
      var loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 700);
  });

  /* ---------- Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Custom cursor + web line ---------- */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  var mx = 0, my = 0, rx = 0, ry = 0;
  var isTouch = window.matchMedia('(hover:none)').matches;

  if (!isTouch && dot && ring) {
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function follow() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll('a,button,.case-card,.chips span,.contact-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
    });
  }

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) nav.classList.toggle('scrolled', y > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    revealObserver.observe(el);
  });

  /* ---------- Animated stat counters ---------- */
  var statObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.getAttribute('data-target'));
      var suffix = el.getAttribute('data-suffix') || '';
      var start = 0, dur = 1600, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      statObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-num').forEach(function (el) { statObserver.observe(el); });

  /* ---------- Hero parallax ---------- */
  var heroInner = document.querySelector('.hero-inner');
  if (heroInner && !isTouch) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroInner.style.transform = 'translateY(' + y * 0.18 + 'px)';
        heroInner.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.85));
      }
    }, { passive: true });
  }

  /* ---------- Web canvas background ---------- */
  var canvas = document.getElementById('webCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var W, H, nodes = [];
    var mouse = { x: -9999, y: -9999 };
    var COUNT = 68;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var count = W < 700 ? 34 : COUNT;
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35
        });
      }
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', function () { mouse.x = -9999; mouse.y = -9999; });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j];
          var dx = n.x - m.x, dy = n.y - m.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 140) {
            var a = (1 - d / 140) * 0.28;
            ctx.strokeStyle = 'rgba(230,36,41,' + a + ')';
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        // connect to cursor (web-shooter effect)
        var mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 200) {
          ctx.strokeStyle = 'rgba(34,211,238,' + (1 - md / 200) * 0.5 + ')';
          ctx.lineWidth = 0.7;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,.5)';
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.3, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    if (!window.matchMedia('(prefers-reduced-motion:reduce)').matches) draw();
  }

  /* ---------- Case studies content + modal ---------- */
  var CASES = {
    1: {
      tag: 'Product · Clinical Workflow',
      title: 'Where AI Could Actually Help in Cardiology',
      tagline: 'A practical product view from someone who has studied the science and sat close to the commercial reality.',
      metrics: [
        ['Start here', 'With the workflow'],
        ['Prove value', 'Before adding features'],
        ['Human-led', 'Clinical decision support']
      ],
      html:
        '<h4>My starting point</h4>' +
        '<p>With a B.Pharm and M.Pharm lens, I do not start with the algorithm. I start with the clinical decision: where is a cardiologist losing time, confidence or consistency, and what would make them trust a tool during a real case?</p>' +
        '<h4>The problem I would investigate</h4>' +
        '<p>In coronary imaging, the pain is rarely “we need more data”. Teams already have angiography, CTA and intravascular imaging. The harder problem is turning those images into a decision quickly, especially when a lesion is calcified or the measurements are borderline.</p>' +
        '<ul>' +
        '<li>Different clinicians can interpret the same image differently.</li>' +
        '<li>Manual measurements slow down already pressured cath-lab workflows.</li>' +
        '<li>Calcium, vessel sizing and lesion length can materially change the device choice.</li>' +
        '<li>A report that is hard to explain or verify will not survive clinical adoption.</li>' +
        '</ul>' +
        '<h4>What I would build first</h4>' +
        '<p>I would keep the first release deliberately narrow: automated vessel and lesion measurements, a clear calcium view, and a structured report that the physician can check rather than blindly accept. The product should sit inside the existing workflow, not ask the cath-lab team to learn a new universe.</p>' +
        '<h4>What would make me cautious</h4>' +
        '<p>Accuracy on a demo dataset is not enough. I would want evidence across scanners, hospitals, image quality and patient groups, with a visible “I am not confident” state. Regulatory claims, PACS integration, data privacy and the human-in-the-loop design are part of the product, not paperwork after launch.</p>' +
        '<h4>How I would measure it</h4>' +
        '<div class="modal-metrics">' +
        '<div class="mm"><b>Time saved</b><span>Per study and report</span></div>' +
        '<div class="mm"><b>Clinical agreement</b><span>Against expert review</span></div>' +
        '<div class="mm"><b>Repeat use</b><span>Studies per site</span></div>' +
        '</div>' +
        '<p>The first success signal is not a flashy accuracy number. It is a cardiologist using the output in the next case, a technician spending less time reworking reports, and a hospital seeing enough value to renew.</p>' +
        '<p class="modal-disclaimer">Illustrative product case based on publicly available clinical and market context. It is a product perspective, not medical advice.</p>'
    },
    2: {
      tag: 'Commercialization · GCC',
      title: 'Taking a Coronary Stent Into the GCC',
      tagline: 'Registration opens the door. Trust, evidence and execution create the business.',
      metrics: [
        ['UAE + KSA', 'Practical starting point'],
        ['Evidence', 'Before scale'],
        ['Local partner', 'Critical to execution']
      ],
      html:
        '<h4>The question I would ask first</h4>' +
        '<p>Is this stent genuinely better for a defined patient or procedure, or is it simply another product looking for shelf space? </p>' +
        '<h4>Start with a focused beachhead</h4>' +
        '<p>I would begin with the UAE and Saudi Arabia, but I would not treat the GCC as one market. I would map cath-lab volumes, clinical influence, procurement route, regulatory requirements and the distributor relationships that already exist. A short list of the right centres is more useful than a long list of logos.</p>' +
        '<h4>Earn the first implants</h4>' +
        '<p>The first objective is not maximum volume. It is a small group of credible physicians who are willing to use the product, discuss where it fits and document the early experience honestly. That means proper product training, case support, clear positioning against incumbent DES and fast feedback when something does not work.</p>' +
        '<h4>Make the business model realistic</h4>' +
        '<ul>' +
        '<li>Build the registration and Arabic labelling plan early.</li>' +
        '<li>Choose a partner for access, regulatory capability and inventory discipline, not just enthusiasm.</li>' +
        '<li>Set pricing around value per implant and total procedural economics.</li>' +
        '<li>Prepare for private-account adoption and tender pathways as different motions.</li>' +
        '</ul>' +
        '<h4>What I would watch every month</h4>' +
        '<div class="modal-metrics">' +
        '<div class="mm"><b>First implants</b><span>Converted priority centres</span></div>' +
        '<div class="mm"><b>Reorders</b><span>Proof of product fit</span></div>' +
        '<div class="mm"><b>Stock health</b><span>Availability without waste</span></div>' +
        '</div>' +
        '<p>A launch is working when the product moves from “interesting new option” to a considered choice in a physician\'s usual practice, and the distributor can support that growth without breaking service or price discipline.</p>' +
        '<p class="modal-disclaimer">Hypothetical commercialization case. Regulatory and market details should be validated against current UAE and Saudi Arabia requirements.</p>'
    },
    3: {
      tag: 'Market · Innovation Study',
      title: 'What Stent Innovation Changed',
      tagline: 'The market story through a pharmacy-trained product manager\'s eyes.',
      metrics: [
        ['Clinical need', 'Drives meaningful change'],
        ['Evidence', 'Builds confidence'],
        ['Whole procedure', 'Where value is moving']
      ],
      html:
        '<h4>Innovation is usually a response</h4>' +
        '<p>When I look at stent history through a B.Pharm and M.Pharm lens, the pattern is clear: each meaningful shift responded to a real limitation. Bare-metal stents addressed recoil. Drug-eluting stents reduced restenosis. Newer designs worked on healing, deliverability and safety. The lesson is useful beyond cardiology: technology matters when it removes a problem people already feel.</p>' +
        '<h4>What changed across generations</h4>' +
        '<ul>' +
        '<li><strong>Bare-metal stents:</strong> solved the immediate mechanical problem, but repeat restenosis remained.</li>' +
        '<li><strong>First-generation drug-eluting stents:</strong> reduced restenosis, while introducing new questions around healing and long-term safety.</li>' +
        '<li><strong>Second-generation DES:</strong> improved polymers, strut profiles and deliverability, becoming the practical standard in many settings.</li>' +
        '<li><strong>Current direction:</strong> ultra-thin struts, polymer choices, imaging, physiology and calcium-modification tools are increasingly part of one treatment decision.</li>' +
        '</ul>' +
        '<h4>My commercial read</h4>' +
        '<p>Once products become clinically comparable, the conversation moves away from a single feature. Physicians care about deliverability and confidence. Hospitals care about outcomes, training, inventory and total procedural cost. Distributors care about repeatability and support. A strong product story has to connect all three.</p>' +
        '<h4>Where I see room to build</h4>' +
        '<p>I would not try to out-shout established DES brands with another list of specifications. I would choose a defined problem, such as calcified lesions or difficult delivery, and build a connected offer around it: vessel preparation, imaging support, the stent itself and education that helps the team use the pathway well.</p>' +
        '<h4>The PM takeaway</h4>' +
        '<p>Good MedTech product work sits between science and business. You need enough clinical depth to understand what matters, enough commercial discipline to price and distribute it, and enough humility to test whether the market agrees with your theory.</p>' +
        '<p class="modal-disclaimer">Market perspective based on publicly documented interventional-cardiology milestones. Product and company references are illustrative.</p>'
    }
  };

  var modal = document.getElementById('modal');
  var modalBody = document.getElementById('modalBody');

  function openCase(id) {
    var c = CASES[id];
    if (!c || !modal || !modalBody) return;
    var metrics = (c.metrics || []).map(function (m) {
      return '<div class="mm"><b>' + m[0] + '</b><span>' + m[1] + '</span></div>';
    }).join('');
    modalBody.innerHTML =
      '<div class="case-tag">' + c.tag + '</div>' +
      '<h3>' + c.title + '</h3>' +
      '<p class="modal-tagline">' + c.tagline + '</p>' +
      (metrics ? '<div class="modal-metrics">' + metrics + '</div>' : '') +
      c.html;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-panel').scrollTop = 0;
  }
  function closeCase() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.case-card').forEach(function (card) {
    card.addEventListener('click', function () { openCase(card.getAttribute('data-case')); });
  });
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeCase);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCase();
    });
  }
})();
