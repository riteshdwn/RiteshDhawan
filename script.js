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
      tag: 'Market · Evidence · Product',
      title: 'Where AI Could Actually Help in Cardiology',
      tagline: 'Cardiology now has 140+ FDA-cleared AI algorithms. Four concrete areas where the evidence is concrete, not speculative.',
      metrics: [
        ['140+', 'FDA-cleared algorithms'],
        ['4 areas', 'With proven evidence'],
        ['Speed & equity', 'The real wins']
      ],
      html:
        '<h4>The State of Play (Mid-2026)</h4>' +
        '<p>Cardiology ranks second only to radiology in FDA-cleared AI algorithms, with the tally past 140 dedicated cardiology clearances (and over 200 once cardiac-specific imaging tools are included). A total of 29 new cardiology AI products were cleared over one recent seven-month review period alone, part of an average pace of roughly 200 AI approvals per year across medicine.</p>' +
        '<p>But volume does not equal value. This case study focuses on four areas where the evidence is concrete rather than speculative: coronary stenting, cardiac imaging and diagnosis, telemedicine and remote monitoring, and robot-assisted cardiac surgery. In each, the pattern is similar — AI is not replacing the cardiologist, but narrowing the gap between average and expert performance, compressing procedure and diagnosis time, and catching disease earlier.</p>' +
        '<h4>1. Stents and Percutaneous Coronary Intervention (PCI)</h4>' +
        '<p><strong>The problem:</strong> Coronary stenting is one of the highest-volume procedures in medicine (70–90% of roughly 1.3M PCIs annually in the US), yet stenting technique and stent size have relied on general rules rather than personalization, since standard angiography cannot generate true 3D vessel images.</p>' +
        '<p><strong>What AI is changing:</strong></p>' +
        '<ul>' +
        '<li><strong>Sizing and expansion accuracy:</strong> Abbott\'s AVVIGO+ platform on intravascular ultrasound (IVUS) demonstrated improved detection of suboptimal stent expansion vs. experienced interventional cardiologists, while significantly cutting analysis time.</li>' +
        '<li><strong>Procedure speed in emergencies:</strong> A 2026 retrospective study found AI-assisted quantitative coronary angiography shortened overall STEMI procedure time without increasing contrast dye use — a real gain, since faster reperfusion directly affects outcomes.</li>' +
        '<li><strong>Democratizing expertise:</strong> Optical coherence tomography (OCT) can guide precise stent placement but takes years to read well. At EuroPCR 2026, researchers reported AI assistance increased clinician confidence in OCT-guided PCI decisions, with the biggest gains among less experienced users — after AI support, confidence differences between experienced and low-experience operators effectively disappeared.</li>' +
        '<li><strong>Regulatory momentum:</strong> In April 2026, Abbott\'s next-generation platform received FDA clearance and CE Mark, integrating high-resolution coronary plaque imaging with AI-automated insights to guide stent sizing in real time during PCI.</li>' +
        '</ul>' +
        '<p><em>Honest caveat:</em> AI measurements tend to be more conservative than expert human readings, with potential systematic underestimation — a reminder that these tools are decision-support, not autonomous decision-makers.</p>' +
        '<h4>2. Cardiac Imaging and Diagnosis</h4>' +
        '<p><strong>The shift:</strong> Imaging is arguably where cardiology AI is most mature, because the specialty produces enormous volumes of structured visual data (ECGs, echocardiograms, CT, MRI) that lend themselves to pattern recognition.</p>' +
        '<p><strong>Notable developments:</strong></p>' +
        '<ul>' +
        '<li><strong>Screening upstream with routine ECGs:</strong> In June 2026, the FDA cleared EchoNext, the first AI model to detect six forms of structural heart disease by analyzing a standard ECG rather than requiring an echocardiogram. In a real-world deployment across 85,000 patients, the model flagged 9% as high-risk for previously undiagnosed structural heart disease; among those who then received an echocardiogram, nearly three-quarters were confirmed to have disease — roughly double the diagnostic yield of standard referral patterns.</li>' +
        '<li><strong>Faster, standardized echo reports:</strong> AI echo platforms now generate full structured reports automatically, significantly shortening diagnosis time, reducing staff workload, and limiting errors.</li>' +
        '<li><strong>Breadth of clinical tasks:</strong> By mid-2026, FDA-cleared algorithms covered detection of cardiovascular findings in images, improving angiography image quality, electrophysiology ablation guidance, and automated quantification of echocardiography exams.</li>' +
        '<li><strong>Resolving ambiguity:</strong> Trials are underway to validate AI models on tasks such as distinguishing severe from moderate low-gradient aortic stenosis, an area where manual grading is often ambiguous and where a validated AI model could support more consistent diagnosis.</li>' +
        '</ul>' +
        '<p><em>Why this matters:</em> Structural and valve disease are frequently silent until advanced. Pushing detection upstream into a $20 test (ECG) that most patients already get is a genuinely different care model, not just a faster version of the old one.</p>' +
        '<h4>3. Telemedicine and Remote Monitoring</h4>' +
        '<p><strong>The link:</strong> The connection between AI and telecardiology is less about video visits and more about continuous, AI-interpreted physiological data replacing periodic in-clinic snapshots — particularly for heart failure and arrhythmia management.</p>' +
        '<p><strong>What the evidence shows:</strong></p>' +
        '<ul>' +
        '<li><strong>Hospitalizations reduced:</strong> A 2026 narrative review concluded remote monitoring reduces mortality and hospitalizations in heart failure, offers cost-effectiveness benefits, and creates the potential to optimize care further by integrating AI.</li>' +
        '<li><strong>Invasive-quality insight from wearables:</strong> The SEISMIC-HF study showed a machine learning model using a non-invasive wearable sensor patch could estimate pulmonary capillary wedge pressure — a key heart failure metric — with significant correlation to the gold-standard invasive measurement.</li>' +
        '<li><strong>High accuracy for arrhythmias:</strong> A 2026 review of AI-integrated wearables found high diagnostic accuracy for arrhythmia detection and promising outcomes in heart failure monitoring, particularly for FDA- or CE-approved devices.</li>' +
        '<li><strong>AI as intelligent triage:</strong> A 2026 study on autonomous AI agents in remote patient monitoring addressed a real operational bottleneck — nurses drowning in monitoring alerts — by using AI to sort signal from noise and shorten time from alert to clinical decision.</li>' +
        '<li><strong>Continuous monitoring for high-risk genotypes:</strong> For patients with high-risk inherited cardiomyopathy, traditional intermittent ECG surveillance is insufficient to capture dynamic electrical instability, motivating a shift toward AI-enabled continuous sensor monitoring.</li>' +
        '</ul>' +
        '<p><em>Honest caveat:</em> This is the area with the widest gap between promising signal and large-scale proof. Most positive studies are still small and short. The realistic read: remote AI monitoring is good at flagging <em>who needs a closer look sooner</em>, not yet the sole basis for major treatment decisions.</p>' +
        '<h4>4. Robot-Guided Cardiac Surgery</h4>' +
        '<p><strong>What\'s clear:</strong> Robotic cardiac surgery itself is well-established; the more interesting story in 2026 is what AI is layering on top of already-teleoperated robotic platforms.</p>' +
        '<ul>' +
        '<li><strong>Robotics is mature; full AI autonomy is not:</strong> A 2026 review is direct: robotic surgery is well established in procedures such as robotic-assisted CABG and mitral valve repair, but systems remain largely tele-operated, with AI integration expected to shift toward smart, semi-autonomous assistants rather than replace the surgeon.</li>' +
        '<li><strong>AI-assisted perception and guidance:</strong> Emerging AI-driven guidance systems may warn as instruments approach critical structures, potentially reducing avoidable injuries, improving suture placement, and increasing reproducibility during minimally invasive cardiac surgery.</li>' +
        '<li><strong>Robotic guidewire navigation:</strong> A 2026 preclinical framework demonstrated AI-driven control of a robotic PCI platform integrating fluoroscopic perception, vessel position modeling, and automated robot-executable guidewire commands — early groundwork toward reducing operator radiation exposure.</li>' +
        '<li><strong>Established baseline:</strong> Independent of AI, robotic heart surgery shows shorter operating times, reduced blood loss, low conversion rates to open surgery, fewer postoperative complications, and shorter hospital stays compared with conventional approaches — the baseline AI is being layered onto.</li>' +
        '<li><strong>Digital twins still aspirational:</strong> Fully automated digital twins for cardiopulmonary bypass remain largely theoretical, with a practical constraint: in complex robotic-assisted procedures, a surgeon\'s real-time options are limited by anatomy, so any AI warning system has to be genuinely actionable.</li>' +
        '</ul>' +
        '<p><em>Honest caveat:</em> This is the least mature area for AI specifically. Expect incremental gains — better visualization, safety alerts, suture guidance — well before anything resembling autonomous operation.</p>' +
        '<h4>Cross-Cutting Themes</h4>' +
        '<ol>' +
        '<li><strong>AI\'s clearest win is narrowing the expertise gap.</strong> The biggest measured benefit repeatedly goes to less-experienced operators and lower-resource settings — this may matter more for equity of care than headline accuracy at top centers.</li>' +
        '<li><strong>Speed and consistency, not just "better than the doctor."</strong> Several of the strongest results (STEMI procedure time, IVUS analysis, echo report turnaround) are about workflow efficiency, which is easier to prove and adopt than claims of superior clinical judgment.</li>' +
        '<li><strong>Screening upstream is the biggest structural shift.</strong> EchoNext repurposing a routine ECG to catch silent structural heart disease is a genuinely new care pathway, not an incremental improvement on an old one.</li>' +
        '<li><strong>Regulatory clearance is accelerating faster than long-term evidence.</strong> With well over 100 cardiology-specific FDA clearances and growing investment, the pace of approval is outrunning the pace of real-world outcomes data — a gap worth watching rather than assuming away.</li>' +
        '</ol>' +
        '<p class="modal-disclaimer">Case study based on FDA clearances, peer-reviewed studies, and presentations through mid-2026. References available in full documentation.</p>'
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
