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
        '</ol>' 
    },
    2: {
      tag: 'Market · Regulatory · GCC',
      title: 'Taking a Coronary Stent Into the GCC',
      tagline: 'The opportunity is real, but the execution is what determines whether it becomes a business or a brochure.',
      metrics: [
        ['$7–10B', 'Global stent market'],
        ['82%', 'DES share of revenue'],
        ['UAE + KSA', 'Best entry path']
      ],
      html:
        '<h4>Market context and current share</h4>' +
        '<p>Market sizing varies by research firm, but most estimates place the global coronary stent market between $7.3B and $10.7B in 2025–26, growing at a CAGR in the 5–7% range through the early 2030s. Drug-eluting stents (DES) dominate globally, holding around 82% of product-type revenue. The Middle East and Africa region is consistently flagged by market researchers as one of the fastest-growing coronary stent geographies, even though it remains a fraction of the size of North America or Europe. Analysts credit this to rising cardiovascular disease rates, improving healthcare access, and economic development, particularly in GCC countries — with growing DES use in the UAE and Saudi Arabia cited as a direct driver.</p>' +
        '<p>Globally, three companies dominate: Medtronic, Boston Scientific, and Abbott together represent a combined share exceeding 75% of the DES market as of 2025. In the GCC specifically, this dominance largely carries through — these three, plus Biotronik and Terumo, run the majority of hospital and cath-lab tenders across Saudi Arabia and the UAE, distributing through local authorized representatives rather than direct subsidiaries in most cases. However, the region is also an entry point for lower-cost challengers: in September 2024, India\'s largest coronary stent manufacturer, Translumina Therapeutics, launched operations in the UAE specifically to use it as a springboard into the broader Middle East, aiming to replicate its India pricing model. This is a live signal that the incumbent "Big 3" moat is not unbreakable in this region — pricing sensitivity and tender structures leave room for challenger brands.</p>' +
        '<h4>Why demand is rising</h4>' +
        '<p>Unlike mature Western markets where growth is driven mainly by an aging population and technology refresh cycles, GCC demand growth has a different, more urgent shape.</p>' +
        '<ul>' +
        '<li><strong>A younger population getting sicker faster.</strong> A 2026 study of primary care attendees in Makkah found roughly two-thirds overweight or obese, with meaningful hypertension and diabetes rates in a population that skews younger than in the US or Europe. This means a growing base of patients entering the CAD/PCI pipeline over the next 10–20 years, not just an aging cohort needing stents now.</li>' +
        '<li><strong>Rapid urbanization and lifestyle shift.</strong> National reviews of cardiovascular disease in Saudi Arabia point to rapid urbanization and large shifts in diet and activity levels as structural drivers, with hypertension and hyperlipidemia prevalence rising broadly across the adult population.</li>' +
        '<li><strong>Government-funded healthcare expansion.</strong> Saudi Vision 2030 and the UAE\'s continued investment in tertiary and quaternary cardiac care (Cleveland Clinic Abu Dhabi, Mediclinic, King Faisal Specialist Hospital network, and others) are actively expanding cath lab capacity and PCI volumes ahead of this demand curve.</li>' +
        '<li><strong>Regional hub status.</strong> The UAE is developing as a medical tourism and regional referral hub for interventional cardiology, drawing patients from across the wider Gulf, North Africa, and South Asia — pushing procedure volumes above what domestic demand alone would generate.</li>' +
        '</ul>' +
        '<h4>Technologies and devices actually in use</h4>' +
        '<p>GCC cath labs are not a "legacy" market running older-generation devices — most major centers in Riyadh, Jeddah, Dubai, and Abu Dhabi run on the same current-generation platforms used in the US and Europe, procured through the same global manufacturers.</p>' +
        '<p><strong>Stent types in active use:</strong> Second/third-generation DES dominate, consistent with the ~82% global product share for DES. Commonly deployed platforms mirror the global "Big 3" lineup: Abbott\'s XIENCE family (everolimus-eluting), Medtronic\'s Resolute Onyx / Onyx Frontier (zotarolimus-eluting), and Boston Scientific\'s Synergy (bioabsorbable-polymer everolimus-eluting). Biodegradable-polymer DES such as Biotronik\'s Orsiro have gained traction as centers seek to reduce long-term inflammation risk versus older durable-polymer designs. Bare-metal stents persist in a shrinking niche — mainly for high-bleeding-risk patients or cost-constrained public facilities. Bioresorbable scaffolds remain a smaller, more experimental category, used selectively in complex lesion subsets as second-generation designs address the safety issues that limited first-generation versions.</p>' +
        '<p><strong>Balloons and adjunct technology:</strong> Drug-coated balloons, mainly paclitaxel-coated, are increasingly used for in-stent restenosis and select de novo small-vessel lesions, following the same "leave nothing behind" trend seen in Europe. Boston Scientific\'s Agent DCB and similar platforms from Medtronic and B. Braun are part of this shift. Intravascular imaging (IVUS/OCT) adoption is rising in higher-volume GCC centers, with AI-assisted platforms like Abbott\'s Ultreon being adopted by leading Saudi and UAE tertiary centers to standardize stent sizing and placement as they compete for accreditation and outcomes reporting. Radial access and thin-strut delivery systems are now largely standard of care at major centers, and AI-assisted quantitative coronary angiography (QCA) is beginning to appear in flagship centers focused on cutting STEMI door-to-balloon times.</p>' +
        '<p><strong>Practical implication for a new entrant:</strong> The GCC is not a market to enter with a stripped-down or older-generation product. Tenders at leading centers increasingly specify current-generation DES with imaging-compatible profiles, and hospitals are willing to pay a premium for devices with strong registry data — but there is also a genuine, price-sensitive tier (public hospitals, secondary cities, some insurance-driven tenders) where cost-competitive challengers like Translumina and other Asian manufacturers are gaining ground.</p>' +
        '<h4>Regulatory pathway</h4>' +
        '<ul>' +
        '<li><strong>GCC-wide registration (GCC DR).</strong> In theory, a single GCC Central Registration Product (CRP) or GCC DR submission can support access across all six member states. In practice, Saudi Arabia\'s SFDA and the UAE\'s device authority are the most active and developed regulators, frequently serving as lead reviewers. Target review timelines are 90–180 days, but actual timelines can extend to 12 months or more for implantable Class III/high-risk devices like coronary stents.</li>' +
        '<li><strong>Saudi Arabia (SFDA).</strong> SFDA has been raising registration fees and issuing more detailed guidance documents (the MDS-G and MDS-REQ series), signaling a market that is professionalizing its device oversight rather than staying a light-touch environment.</li>' +
        '<li><strong>UAE — a recent structural change.</strong> The UAE has shifted device registration authority from MOHAP to a newer entity, EDE (via the ede.gov.ae portal), which now manages product registration, renewals, variations, pharmacovigilance, and post-market compliance. Northern Emirates facilities are still MOHAP-licensed but use EDE-registered devices. Registrations run for five years, with renewal required at least three months before expiry, and Class III/IV devices face biannual Periodic Safety Update Report requirements.</li>' +
        '<li><strong>A foreign manufacturer cannot register directly.</strong> Both SFDA and UAE frameworks require appointing a locally licensed Authorized Representative to submit and manage the registration dossier — this local partner also typically becomes the commercial distributor of record, making the choice a combined regulatory and go-to-market decision, not just a compliance formality.</li>' +
        '<li><strong>The smaller GCC states are tightening too.</strong> Oman introduced a mandatory Class C/D registration deadline in July 2026, and Bahrain moved to mandatory registration enforcement in February 2026 — markets that manufacturers could previously supply with minimal formal registration are closing that gap.</li>' +
        '</ul>' +
        '<h4>Go-to-market considerations for a new entrant</h4>' +
        '<ul>' +
        '<li><strong>Lead with Saudi Arabia and the UAE.</strong> They have the largest procedure volumes, the most developed regulatory pathways, the most active lead-reviewer role in the regional GCC DR system, and the deepest tertiary care infrastructure to generate clinical champions and registry data.</li>' +
        '<li><strong>Decide early whether you\'re competing on premium technology or price.</strong> The "Big 3" (Abbott, Medtronic, Boston Scientific) own the premium, imaging-integrated tier at flagship hospitals. Entrants without that R&D depth have a more realistic opening in the price-sensitive public-hospital and secondary-city tender segment — the lane Translumina explicitly targeted with its 2024 UAE launch.</li>' +
        '<li><strong>Budget realistic regulatory timelines.</strong> Treat 12 months as the planning baseline for high-risk device registration, not the optimistic 90–180 day target, and start the Authorized Representative selection process well before finalizing commercial agreements, since that partner shapes both compliance and distribution.</li>' +
        '<li><strong>Plan for imaging and workflow integration, not just the device.</strong> As leading centers adopt AI-assisted OCT/IVUS and AI-guided QCA, a stent well-supported by imaging-guided sizing data and compatible workflows will have an easier time winning flagship-hospital tenders than one marketed purely on price or basic clinical equivalence.</li>' +
        '<li><strong>Don\'t underestimate the smaller Gulf states.</strong> Oman and Bahrain\'s move to mandatory registration in 2026 means the days of informally supplying these markets are ending — a compliant multi-country strategy from day one avoids having to retrofit registrations later.</li>' +
        '</ul>' 
    },

    3: {
      tag: 'Market · Innovation Study',
      title: 'What Stent Innovation Changed',
      tagline: 'From bare-metal to drug-eluting to indigenous bioresorbable — a market shaped as much by policy as by biology.',
      metrics: [
        ['DES share today', '~90% of Indian angioplasties'],
        ['2017 NPPA cap', 'Cut prices up to 85%'],
        ['Domestic play', 'Meril\'s MeRes100 BRS']
      ],
      html:
        '<h4>Act One: The bare-metal stent era</h4>' +
        '<p>Bare metal stents — simple metal scaffolds, usually stainless steel or cobalt-chromium — were the first real solution to a mechanical problem: arteries re-narrowing or collapsing after balloon angioplasty. BMS kept the vessel open, but the metal surface itself triggered tissue overgrowth (neointimal hyperplasia), and restenosis showed up in 20–30% of patients within 6–12 months. Through the 1990s and early 2000s, BMS was the default in Indian cath labs — low-cost and mechanically reliable, but leaving a real clinical gap: a purely mechanical fix wasn\'t enough. The biological response to the implant still needed to be controlled.</p>' +

        '<h4>Act Two: The drug-eluting stent revolution</h4>' +
        '<p>DES innovation layered a pharmacological solution onto the mechanical one: a polymer coating releases an anti-proliferative drug — initially sirolimus or paclitaxel — directly into the vessel wall, suppressing the overgrowth that caused restenosis in BMS. This is the single biggest inflection point in the category, and it played out in India in distinct waves.</p>' +
        '<ul>' +
        '<li><strong>First-generation DES (early-to-mid 2000s):</strong> sirolimus- and paclitaxel-eluting stents on durable polymers, mostly imported. Expensive, and adoption was initially limited to metros and private hospitals.</li>' +
        '<li><strong>Second-generation DES (late 2000s–2010s):</strong> everolimus- and zotarolimus-eluting stents, thinner struts, better biocompatible polymers, lower late-thrombosis risk — this is when DES adoption really scaled in India.</li>' +
        '<li><strong>Biodegradable-polymer DES (2010s):</strong> the polymer itself dissolves after releasing its drug payload, leaving a bare-metal-like surface behind. This became a major segment for Indian manufacturers.</li>' +
        '</ul>' +
        '<p>By the time India\'s drug pricing regulator moved to cap prices in 2017, drug-eluting stents already accounted for roughly 90% of angioplasties performed in the country — a near-total displacement of BMS as the default, now reserved mainly for high-bleeding-risk patients who can\'t tolerate prolonged dual antiplatelet therapy.</p>' +

        '<h4>Act Three: Bioresorbable scaffolds and India\'s own innovation story</h4>' +
        '<p>The next conceptual leap tried to solve a problem DES itself created: a permanent metal cage left in the artery forever, even after it has done its job. Bioresorbable Vascular Scaffolds (BVS) are designed to provide temporary support and drug delivery, then fully dissolve over 2–3 years, restoring the vessel\'s natural function.</p>' +
        '<p>Globally, this is where the story shifted geography. Abbott\'s pioneering Absorb BVS struggled clinically and quietly disappeared from Indian cath lab shelves once price controls made the economics unworkable for a premium imported device. Into that gap stepped Meril Life Sciences, based in Vapi, Gujarat. Its MeRes100 — a sirolimus-eluting bioresorbable scaffold — was approved by India\'s drug regulator (CDSCO) in 2017, developed entirely in-house. Because it was indigenously researched, manufactured and patented under the Indian Patent Act, Meril applied for — and in February 2020 was granted — a rare five-year exemption from NPPA price controls, a carve-out designed specifically to reward genuine domestic innovation rather than import substitution. This is arguably the most important strategic shift in the story: India moved from being a price-taking importer of stent technology to producing its own frontier device.</p>' +

        '<h4>The regulatory shock: NPPA price caps as an innovation forcing function</h4>' +
        '<p>On February 13, 2017, India\'s National Pharmaceutical Pricing Authority fixed price ceilings at ₹7,260 for bare-metal stents and ₹29,600 for drug-eluting stents (roughly $108 and $444), after stents were added to the National List of Essential Medicines. This triggered immediate price cuts of up to 85% in some cases — a massive shock to an industry built around premium imported pricing.</p>' +
        '<ul>' +
        '<li><strong>Positive:</strong> cardiac stenting became dramatically more affordable, reinforcing India\'s position as a low-cost, high-quality cardiac care hub.</li>' +
        '<li><strong>Negative, short-term:</strong> Abbott, Medtronic and Boston Scientific all filed to withdraw their newest-generation stents from India rather than sell at capped prices, temporarily narrowing what was available to patients.</li>' +
        '<li><strong>Adaptive:</strong> the government responded with an innovation exemption mechanism (Para 32(ii) of the Drug Price Control Order) that let genuinely indigenous, patented devices like MeRes100 escape the cap — protecting domestic R&D incentives while keeping standard-device prices low.</li>' +
        '</ul>' +
        '<p>By 2026, prices have been adjusted modestly upward — bare-metal around ₹7,900, DES/BVS around ₹28,800 — but remain a fraction of pre-2017 levels.</p>' +

        '<h4>Where the market stands today</h4>' +
        '<p>Drug-eluting stents account for roughly 75–77% of the coronary stent market by product type globally, and an even higher share of procedures in India specifically. Bare-metal stents persist mainly as a lower-cost option and for patients where prolonged blood-thinning therapy is risky — a durable but shrinking niche rather than a disappearing category. Newer entrants keep raising the bar: Abbott launched its XIENCE Sierra everolimus-eluting stent in the Indian market in May 2024, and domestic players — Meril, SMT/Sahajanand, Translumina, Vascular Concepts — continue competing on next-generation ultra-thin-strut and bioresorbable platforms. Strategic collaborations between international and domestic manufacturers have widened availability and sharpened price competition, reinforcing DES\'s leadership position going forward.</p>' +

        '<h4>Key takeaways</h4>' +
        '<ul>' +
        '<li><strong>Innovation compounds in layers, not leaps:</strong> mechanical fix (BMS) → biological fix layered on top (DES) → structural fix that removes the original mechanical element altogether (BVS). Each generation solved the side-effect created by the one before it.</li>' +
        '<li><strong>Price regulation cuts both ways:</strong> NPPA\'s 2017 caps expanded access dramatically but temporarily chased premium global technology out of the market — until a targeted exemption for genuine domestic R&D showed regulators could protect both affordability and frontier innovation.</li>' +
        '<li><strong>Crisis created a domestic opening:</strong> when multinationals pulled premium products, an Indian manufacturer filled the vacuum with a genuinely novel, patented device — policy-induced import substitution turning into real technological leadership.</li>' +
        '<li><strong>The frontier keeps moving:</strong> ultra-thin-strut everolimus stents, biodegradable-polymer DES and bioresorbable scaffolds are all still competing for the next layer of share — the category isn\'t done evolving.</li>' +
        '</ul>'
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
