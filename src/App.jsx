import { useState, useEffect, useRef } from "react";

/* ── Google Fonts injection ── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Teko:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap";
document.head.appendChild(fontLink);

/* ── Global styles ── */
const globalCSS = `
  :root {
    --rust:#B84A1A; --rust-dk:#7A2E0A;
    --gold:#C89A14; --gold-lt:#E8BC30;
    --cream:#F4EDD8; --cream-dk:#DDD0B0;
    --forest:#1E4D35; --forest-lt:#2D6B4A;
    --ink:#0C0804; --night:#0E0B06; --mahogany:#2A1408;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--night);color:var(--cream);font-family:'Crimson Pro',serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:var(--night)}
  ::-webkit-scrollbar-thumb{background:var(--rust)}

  /* animations */
  @keyframes heroOrb{0%,100%{opacity:.7;transform:translateY(-50%) scale(1)}50%{opacity:1;transform:translateY(-50%) scale(1.06)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes badgePulse{
    0%,100%{box-shadow:0 0 0 5px var(--rust),0 0 0 8px rgba(200,154,20,.25),0 0 40px rgba(184,74,26,.15)}
    50%{box-shadow:0 0 0 5px var(--rust),0 0 0 8px rgba(200,154,20,.35),0 0 70px rgba(184,74,26,.3)}
  }

  /* scroll reveal */
  .sr{opacity:0;transform:translateY(24px);transition:opacity .65s ease,transform .65s ease}
  .sr.visible{opacity:1;transform:translateY(0)}
  .sr.d1{transition-delay:.12s}
  .sr.d2{transition-delay:.24s}

  /* aztec divider */
  .aztec{height:14px;background:repeating-linear-gradient(90deg,var(--rust) 0px,var(--rust) 14px,var(--gold) 14px,var(--gold) 28px,var(--forest) 28px,var(--forest) 42px,var(--gold) 42px,var(--gold) 56px);border-top:2px solid var(--gold);border-bottom:2px solid var(--gold)}

  /* shared */
  .sec-head{text-align:center;padding:4rem 2rem 2.5rem}
  .sec-eyebrow{display:inline-flex;align-items:center;gap:1rem;font-family:'Teko',sans-serif;font-size:.72rem;letter-spacing:.4em;text-transform:uppercase;color:var(--rust);margin-bottom:.7rem}
  .sec-eyebrow::before,.sec-eyebrow::after{content:'';width:35px;height:1px;background:var(--rust)}
  .sec-head h2{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.5rem);font-style:italic;font-weight:700;color:var(--cream);line-height:1.05}
  .sec-head h2 em{font-style:normal;color:var(--gold)}
  .sec-head p{font-size:1rem;color:rgba(244,237,216,.45);max-width:440px;margin:1rem auto 0;font-style:italic}

  .btn-primary{display:inline-block;text-decoration:none;font-family:'Teko',sans-serif;font-size:1rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--ink);background:var(--gold);padding:.85rem 2.2rem;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);box-shadow:3px 3px 0 var(--rust-dk);transition:all .2s ease;cursor:pointer;border:none}
  .btn-primary:hover{background:var(--rust);color:var(--cream);box-shadow:1px 1px 0 var(--rust-dk);transform:translate(2px,2px)}
  .btn-outline{display:inline-flex;align-items:center;gap:.5rem;text-decoration:none;font-family:'Teko',sans-serif;font-size:.85rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,237,216,.55);border:1px solid rgba(244,237,216,.2);padding:.75rem 1.5rem;transition:all .2s;cursor:pointer;background:none}
  .btn-outline:hover{border-color:var(--gold);color:var(--gold)}

  /* navbar */
  .navbar{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(14,11,6,.96);backdrop-filter:blur(16px);border-bottom:1px solid rgba(200,154,20,.15);transition:border-color .3s}
  .navbar.scrolled{border-bottom-color:rgba(200,154,20,.3)}
  .nav-glow{height:3px;background:linear-gradient(90deg,var(--rust),var(--gold),var(--forest),var(--gold),var(--rust))}
  .nav-inner{max-width:1160px;margin:0 auto;padding:0 2rem;height:58px;display:flex;align-items:center;justify-content:space-between}
  .nav-logo{font-family:'Pinyon Script',cursive;font-size:2.2rem;color:var(--gold);text-decoration:none;line-height:1;text-shadow:0 0 20px rgba(200,154,20,.35);transition:color .2s}
  .nav-logo:hover{color:var(--gold-lt)}
  .nav-links{list-style:none;display:flex;align-items:center}
  .nav-links li a{display:block;padding:0 1rem;color:rgba(244,237,216,.55);text-decoration:none;font-family:'Teko',sans-serif;font-size:.85rem;letter-spacing:.2em;text-transform:uppercase;line-height:58px;transition:color .2s;position:relative}
  .nav-links li a::after{content:'';position:absolute;bottom:8px;left:1rem;right:1rem;height:1px;background:var(--rust);transform:scaleX(0);transition:transform .25s ease;transform-origin:left}
  .nav-links li a:hover,.nav-links li a.active{color:var(--gold)}
  .nav-links li a:hover::after,.nav-links li a.active::after{transform:scaleX(1)}
  .nav-cta{background:var(--rust)!important;color:var(--cream)!important;padding:0 1.4rem!important;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);font-weight:600!important;margin-left:.5rem;align-self:center;line-height:36px!important;transition:background .2s,color .2s!important}
  .nav-cta:hover{background:var(--gold)!important;color:var(--ink)!important}
  .nav-cta::after{display:none!important}
  .nav-ham{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
  .nav-ham span{width:24px;height:2px;background:var(--cream);transition:all .3s;display:block}
  .nav-mobile{display:none;flex-direction:column;background:rgba(14,11,6,.98);border-top:1px solid rgba(200,154,20,.1);padding:1rem 2rem;gap:.5rem}
  .nav-mobile.open{display:flex}
  .nav-mobile a{color:rgba(244,237,216,.6);text-decoration:none;font-family:'Teko',sans-serif;font-size:1rem;letter-spacing:.2em;text-transform:uppercase;padding:.6rem 0;border-bottom:1px solid rgba(200,154,20,.08);transition:color .2s}
  .nav-mobile a:hover{color:var(--gold)}

  /* hero */
  .hero{min-height:100vh;background:var(--ink);display:flex;flex-direction:column;position:relative;overflow:hidden;padding-top:61px}
  .hero-lattice{position:absolute;inset:0;background-image:repeating-linear-gradient(45deg,rgba(200,154,20,.035) 0,rgba(200,154,20,.035) 1px,transparent 1px,transparent 22px),repeating-linear-gradient(-45deg,rgba(200,154,20,.035) 0,rgba(200,154,20,.035) 1px,transparent 1px,transparent 22px);pointer-events:none}
  .hero-orb{position:absolute;width:600px;height:600px;right:-100px;top:50%;transform:translateY(-50%);background:radial-gradient(circle,rgba(184,74,26,.12) 0%,rgba(200,154,20,.06) 40%,transparent 70%);border-radius:50%;pointer-events:none;animation:heroOrb 6s ease-in-out infinite}
  .hero-body{flex:1;display:flex;align-items:center;max-width:1160px;margin:0 auto;width:100%;padding:5rem 2rem 4rem;position:relative;z-index:1;gap:5rem}
  .hero-left{flex:1}
  .hero-eyebrow{display:flex;align-items:center;gap:1rem;margin-bottom:1.8rem}
  .hero-eyebrow-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}
  .hero-eyebrow span{font-family:'Teko',sans-serif;font-size:.7rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold);white-space:nowrap}
  .hero h1{font-family:'Pinyon Script',cursive;font-size:clamp(5.5rem,11vw,9.5rem);line-height:.82;color:var(--gold);text-shadow:3px 3px 0 var(--rust-dk),0 0 50px rgba(200,154,20,.2);margin-bottom:.6rem;animation:slideUp .8s cubic-bezier(.16,1,.3,1) .1s both}
  .hero-sub{font-family:'Teko',sans-serif;font-size:clamp(1rem,2vw,1.5rem);font-weight:300;letter-spacing:.55em;text-transform:uppercase;color:var(--rust);margin-bottom:1.8rem;animation:fadeIn .8s ease .3s both}
  .hero-rating{display:inline-flex;align-items:center;gap:.8rem;background:rgba(200,154,20,.07);border:1px solid rgba(200,154,20,.2);padding:.5rem 1.2rem;margin-bottom:1.8rem;animation:fadeIn .8s ease .4s both}
  .hero-rating .stars{color:var(--gold);font-size:.85rem;letter-spacing:.1em}
  .hero-rating .score{font-family:'Teko',sans-serif;font-size:1.1rem;font-weight:600;color:var(--gold-lt);letter-spacing:.05em}
  .hero-rating .count{font-size:.82rem;color:rgba(244,237,216,.45);font-style:italic}
  .hero-desc{font-size:1.05rem;color:rgba(244,237,216,.62);line-height:1.9;font-style:italic;max-width:420px;border-left:2px solid var(--rust);padding-left:1.2rem;margin-bottom:2.5rem;animation:fadeIn .8s ease .5s both}
  .hero-ctas{display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;animation:fadeIn .8s ease .6s both}
  .hero-link{display:inline-flex;align-items:center;gap:.5rem;text-decoration:none;font-family:'Teko',sans-serif;font-size:.85rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,237,216,.45);border-bottom:1px solid rgba(244,237,216,.15);padding-bottom:2px;transition:color .2s,border-color .2s}
  .hero-link:hover{color:var(--gold);border-color:var(--gold)}
  .hero-right{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:2rem;animation:fadeIn .8s ease .4s both}
  .jr-badge{width:260px;height:260px;border-radius:50%;background:radial-gradient(circle at 38% 35%,var(--mahogany),var(--ink));border:2px solid var(--gold);box-shadow:0 0 0 5px var(--rust),0 0 0 8px rgba(200,154,20,.25),0 0 60px rgba(184,74,26,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;animation:badgePulse 4s ease-in-out infinite}
  .jr-badge::before{content:'';position:absolute;inset:12px;border-radius:50%;border:1px dashed rgba(200,154,20,.25)}
  .jr-badge-main{font-family:'Pinyon Script',cursive;font-size:6.5rem;line-height:1;color:var(--gold);text-shadow:2px 2px 0 var(--rust-dk),0 0 25px rgba(200,154,20,.3)}
  .jr-badge-sub{font-family:'Teko',sans-serif;font-size:.65rem;letter-spacing:.4em;text-transform:uppercase;color:rgba(200,154,20,.55);margin-top:.3rem}
  .info-pills{display:flex;flex-direction:column;gap:.7rem;width:100%}
  .info-pill{display:flex;align-items:center;gap:.8rem;padding:.6rem 1rem;background:rgba(244,237,216,.03);border:1px solid rgba(200,154,20,.1);transition:border-color .2s,background .2s}
  .info-pill:hover{border-color:rgba(200,154,20,.25);background:rgba(200,154,20,.04)}
  .info-pill-icon{font-size:1rem;width:22px;text-align:center}
  .info-pill-text{font-family:'Teko',sans-serif;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(244,237,216,.5)}
  .info-pill-text strong{color:var(--cream);font-weight:500}
  .hero-foot{background:var(--rust);padding:.75rem 2rem;display:flex;justify-content:center;gap:3rem;flex-wrap:wrap;position:relative;z-index:1}
  .hero-foot span{font-family:'Teko',sans-serif;font-size:.8rem;letter-spacing:.25em;text-transform:uppercase;color:var(--cream)}
  .hero-foot .dot{color:var(--gold-lt);opacity:.7}

  /* services */
  .services-section{background:var(--mahogany);border-top:2px solid var(--rust);border-bottom:2px solid var(--rust);padding-bottom:4rem}
  .menu-wrap{max-width:940px;margin:0 auto;padding:0 2rem}
  .menu-frame{border:1px solid var(--gold);background:#130A03;box-shadow:inset 0 0 0 4px var(--mahogany),inset 0 0 0 6px var(--rust),0 12px 50px rgba(0,0,0,.7);position:relative;margin-top:1rem}
  .menu-frame::before{content:'✦  MENU DE SERVICIOS  ✦';position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--rust);color:var(--gold-lt);font-family:'Teko',sans-serif;font-size:.68rem;letter-spacing:.3em;padding:.3rem 1.8rem;border:1px solid var(--gold);border-top:none;white-space:nowrap}
  .menu-top{background:linear-gradient(135deg,var(--rust),var(--rust-dk));padding:1.8rem 2rem;text-align:center;border-bottom:2px solid var(--gold)}
  .menu-top h3{font-family:'Pinyon Script',cursive;font-size:2.8rem;color:var(--gold-lt);text-shadow:2px 2px 6px rgba(0,0,0,.5);line-height:1}
  .menu-top p{font-family:'Teko',sans-serif;font-size:.7rem;letter-spacing:.35em;color:rgba(244,237,216,.6);text-transform:uppercase;margin-top:.3rem}
  .menu-cols{display:grid;grid-template-columns:1fr 1fr}
  .menu-col{padding:2.2rem 2.2rem 1.8rem}
  .menu-col:first-child{border-right:1px solid rgba(200,154,20,.15)}
  .menu-cat{font-family:'Teko',sans-serif;font-size:.75rem;letter-spacing:.35em;text-transform:uppercase;color:var(--rust);border-bottom:1px solid rgba(184,74,26,.25);padding-bottom:.5rem;margin-bottom:1.4rem;display:flex;align-items:center;gap:.7rem}
  .menu-cat.mt{margin-top:1.8rem}
  .menu-cat::before{content:'';width:16px;height:2px;background:var(--rust)}
  .menu-row{display:flex;align-items:baseline;gap:.5rem;margin-bottom:1.3rem}
  .menu-row-name{font-family:'Playfair Display',serif;font-size:1rem;color:var(--cream);flex-shrink:0}
  .menu-row-sub{display:block;font-size:.77rem;color:rgba(244,237,216,.38);font-style:italic;margin-top:1px}
  .menu-row-dots{flex:1;border-bottom:1px dotted rgba(200,154,20,.2);margin-bottom:4px}
  .menu-row-price{font-family:'Teko',sans-serif;font-size:1.25rem;font-weight:500;color:var(--gold);flex-shrink:0}
  .menu-footer{background:var(--forest);padding:1rem 2rem;border-top:1px solid rgba(200,154,20,.2);display:flex;justify-content:center;gap:2.5rem;align-items:center;flex-wrap:wrap}
  .menu-footer span{font-family:'Teko',sans-serif;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;color:var(--cream-dk)}
  .menu-footer .gem{color:var(--gold);font-size:1rem}

  /* book band */
  .book-band{background:var(--forest);border-top:2px solid rgba(200,154,20,.3);border-bottom:2px solid rgba(200,154,20,.3);padding:3rem 2rem;text-align:center}
  .book-band h3{font-family:'Playfair Display',serif;font-size:1.8rem;font-style:italic;color:var(--cream);margin-bottom:.5rem}
  .book-band p{font-size:.95rem;color:rgba(244,237,216,.5);font-style:italic;margin-bottom:1.5rem}
  .book-band-btns{display:flex;align-items:center;justify-content:center;gap:1.5rem;flex-wrap:wrap}

  /* about */
  .about-section{background:var(--mahogany);border-top:2px solid var(--rust);border-bottom:2px solid var(--rust);overflow:hidden}
  .about-layout{display:grid;grid-template-columns:1fr 1fr}
  .about-mosaic{background:var(--forest);display:grid;grid-template-columns:repeat(5,1fr);position:relative;overflow:hidden;min-height:500px}
  .about-mosaic::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 60%,rgba(0,0,0,.5) 100%);pointer-events:none}
  .mc{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:1.6rem;border:1px solid rgba(0,0,0,.25);transition:transform .3s ease,filter .3s ease;cursor:default}
  .mc:hover{transform:scale(1.1);filter:brightness(1.3);z-index:2}
  .mc-rust{background:var(--rust)} .mc-gold{background:var(--gold);color:var(--ink)} .mc-forest{background:var(--forest-lt)} .mc-dark{background:rgba(0,0,0,.35)} .mc-cream{background:var(--cream-dk);color:var(--ink)} .mc-mah{background:var(--mahogany)}
  .about-text{padding:4rem 3.5rem;display:flex;flex-direction:column;justify-content:center}
  .about-eyebrow{font-family:'Teko',sans-serif;font-size:.72rem;letter-spacing:.4em;text-transform:uppercase;color:var(--rust);margin-bottom:.9rem}
  .about-text h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3vw,2.6rem);font-style:italic;font-weight:700;color:var(--cream);line-height:1.15;margin-bottom:1.5rem}
  .about-text h2 strong{font-style:normal;color:var(--gold);display:block}
  .about-text p{font-size:1rem;color:rgba(244,237,216,.6);line-height:1.9;font-style:italic;max-width:400px}
  .about-text p+p{margin-top:1rem}
  .about-divider{width:50px;height:3px;margin:1.5rem 0;background:linear-gradient(90deg,var(--rust),var(--gold))}
  .about-facts{display:flex;gap:2.5rem;margin-top:1.5rem;flex-wrap:wrap}
  .fact-num{font-family:'Teko',sans-serif;font-size:2.2rem;font-weight:600;color:var(--gold);line-height:1;display:block}
  .fact-label{font-size:.78rem;color:rgba(244,237,216,.38);font-style:italic}

  /* reviews */
  .reviews-section{background:var(--night);padding-bottom:5rem}
  .reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:1100px;margin:0 auto;padding:0 2rem}
  .review-card{background:linear-gradient(160deg,#1A0D06,#100806);border:1px solid rgba(200,154,20,.1);padding:1.8rem;position:relative;overflow:hidden;transition:border-color .3s,transform .3s}
  .review-card:hover{border-color:rgba(200,154,20,.35);transform:translateY(-5px)}
  .review-num{position:absolute;top:1rem;right:1.2rem;font-family:'Teko',sans-serif;font-size:2.2rem;font-weight:700;color:rgba(200,154,20,.06);line-height:1}
  .review-stars{color:var(--gold);font-size:.8rem;letter-spacing:.1em;margin-bottom:.8rem}
  .review-text{font-size:1rem;color:rgba(244,237,216,.65);line-height:1.85;font-style:italic;margin-bottom:1.4rem}
  .review-author{display:flex;align-items:center;gap:.9rem;border-top:1px solid rgba(200,154,20,.08);padding-top:1rem}
  .review-avatar{width:38px;height:38px;background:var(--forest);display:flex;align-items:center;justify-content:center;font-family:'Pinyon Script',cursive;font-size:1.5rem;color:var(--gold);flex-shrink:0;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);border:1px solid rgba(200,154,20,.25)}
  .review-name{font-family:'Playfair Display',serif;font-style:italic;font-size:.9rem;color:var(--gold);display:block}
  .review-note{font-size:.72rem;color:rgba(244,237,216,.3);font-style:italic}

  /* contact */
  .contact-section{background:var(--mahogany);border-top:2px solid var(--rust);padding-bottom:5rem}
  .contact-grid{display:grid;grid-template-columns:1fr 1fr;max-width:1100px;margin:0 auto;padding:0 2rem;gap:4rem}
  .contact-info-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-style:italic;color:var(--cream);margin-bottom:2rem}
  .contact-list{list-style:none;display:flex;flex-direction:column;gap:1.2rem}
  .contact-item{display:flex;align-items:flex-start;gap:1rem;font-size:1rem;color:rgba(244,237,216,.6);font-style:italic;line-height:1.6}
  .contact-icon{width:36px;height:36px;background:var(--rust);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)}
  .contact-body strong{color:var(--cream);font-style:normal;display:block;font-family:'Teko',sans-serif;letter-spacing:.1em;font-size:.85rem;text-transform:uppercase;margin-bottom:.2rem}
  .contact-body a{color:var(--gold);text-decoration:none;transition:color .2s}
  .contact-body a:hover{color:var(--gold-lt)}
  .hours-grid{display:grid;grid-template-columns:auto 1fr;gap:.2rem 1rem;margin-top:.2rem}
  .hours-grid span{font-size:.88rem}
  .booking-card{background:#100804;border:1px solid rgba(200,154,20,.18);box-shadow:0 0 0 3px var(--rust),0 0 0 5px rgba(200,154,20,.15),0 16px 50px rgba(0,0,0,.5);overflow:hidden}
  .booking-card-head{background:linear-gradient(135deg,var(--rust),var(--rust-dk));padding:1.8rem 2rem;text-align:center;border-bottom:2px solid var(--gold)}
  .booking-card-head::before,.booking-card-head::after{content:'✦  ✦  ✦';font-size:.65rem;color:rgba(200,154,20,.5);letter-spacing:.3em;display:block}
  .booking-card-head h3{font-family:'Pinyon Script',cursive;font-size:2.5rem;color:var(--gold-lt);text-shadow:2px 2px 6px rgba(0,0,0,.4);margin:.2rem 0;line-height:1}
  .booking-card-head p{font-family:'Teko',sans-serif;font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:rgba(244,237,216,.55)}
  .booking-card-body{padding:2.5rem 2rem}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-bottom:1.2rem}
  .form-group{display:flex;flex-direction:column;gap:.4rem;margin-bottom:1.2rem}
  .form-label{font-family:'Teko',sans-serif;font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:var(--rust)}
  .form-ctrl{background:rgba(255,255,255,.02);border:1px solid rgba(200,154,20,.15);border-bottom:2px solid var(--rust);color:var(--cream);font-family:'Crimson Pro',serif;font-size:1rem;font-style:italic;padding:.6rem .9rem;outline:none;width:100%;appearance:none;transition:border-color .2s,background .2s}
  .form-ctrl:focus{border-color:var(--gold);background:rgba(200,154,20,.04)}
  .form-ctrl option{background:#180C04;color:var(--cream)}
  .form-actions{text-align:center;padding-top:.5rem;display:flex;flex-direction:column;align-items:center;gap:1rem}
  .form-or{font-size:.85rem;color:rgba(244,237,216,.3);font-style:italic}
  .form-call{display:inline-flex;align-items:center;gap:.5rem;text-decoration:none;font-family:'Teko',sans-serif;font-size:.78rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,237,216,.4);border-bottom:1px solid rgba(244,237,216,.12);padding-bottom:2px;transition:color .2s,border-color .2s}
  .form-call:hover{color:var(--gold);border-color:var(--gold)}

  /* footer */
  .footer{background:var(--ink);border-top:2px solid var(--rust);padding:3rem 2rem 1.5rem}
  .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:3rem;max-width:1100px;margin:0 auto 2rem}
  .footer-logo{font-family:'Pinyon Script',cursive;font-size:2.8rem;color:var(--gold);display:block;margin-bottom:.3rem;text-shadow:0 0 20px rgba(200,154,20,.2);line-height:1}
  .footer-tagline{font-family:'Teko',sans-serif;font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;color:var(--rust);display:block;margin-bottom:1rem}
  .footer-brand p{font-size:.9rem;color:rgba(244,237,216,.3);line-height:1.8;font-style:italic;max-width:260px}
  .footer-col h5{font-family:'Teko',sans-serif;font-size:.78rem;letter-spacing:.3em;text-transform:uppercase;color:var(--rust);margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid rgba(184,74,26,.2)}
  .footer-col ul{list-style:none}
  .footer-col ul li{margin-bottom:.5rem}
  .footer-col ul li a,.footer-col p a{color:rgba(244,237,216,.35);text-decoration:none;font-size:.9rem;font-style:italic;transition:color .2s}
  .footer-col ul li a:hover,.footer-col p a:hover{color:var(--gold)}
  .footer-col p{color:rgba(244,237,216,.35);font-size:.9rem;line-height:1.9;font-style:italic}
  .footer-col .gold-link{color:var(--gold)}
  .footer-bottom{max-width:1100px;margin:0 auto;padding-top:1.5rem;border-top:1px solid rgba(200,154,20,.07);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem}
  .footer-bottom p{color:rgba(244,237,216,.2);font-size:.8rem;font-style:italic}

  /* responsive */
  @media(max-width:1024px){.about-layout{grid-template-columns:1fr}.about-mosaic{display:none}}
  @media(max-width:900px){
    .hero-body{flex-direction:column;padding:3rem 1.5rem 2rem;gap:2rem}
    .hero-right{display:none}
    .menu-cols{grid-template-columns:1fr}
    .menu-col:first-child{border-right:none;border-bottom:1px solid rgba(200,154,20,.15)}
    .reviews-grid{grid-template-columns:1fr}
    .contact-grid{grid-template-columns:1fr}
    .footer-grid{grid-template-columns:1fr;gap:2rem}
    .form-row{grid-template-columns:1fr}
  }
  @media(max-width:768px){
    .nav-links{display:none}
    .nav-ham{display:flex}
    .hero-foot{gap:1rem}
    .book-band-btns{flex-direction:column}
    .footer-bottom{flex-direction:column;text-align:center}
  }
`;

/* ── Inject styles ── */
const styleEl = document.createElement("style");
styleEl.textContent = globalCSS;
document.head.appendChild(styleEl);

/* ── useScrollReveal hook ── */
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Data ── */
const BOOKSY = "https://booksy.com/en-us/1572727_jr-barbershop_barber-shop_121625_berry-hill";
const PHONE  = "tel:+16293074218";

const LEFT_MENU = [
  { cat: "✂ Haircuts", items: [
    { name:"Classic Cut",       sub:"Scissor or clipper, clean finish",  price:"$25" },
    { name:"Fade Cut",          sub:"Low, mid, or high fade",             price:"$30" },
    { name:"Skin Fade",         sub:"Tapered to skin, razor sharp",       price:"$35" },
    { name:"Cut & Style",       sub:"Cut + product finish + blow-dry",    price:"$40" },
    { name:"Kids Cut (12 & under)", sub:"Patient, precise, always gentle",price:"$20" },
  ]},
  { cat: "🪒 Shaves", items: [
    { name:"Hot Towel Shave",   sub:"Straight razor + hot lather",  price:"$30" },
    { name:"Line Up",           sub:"Edges, temple, neckline",      price:"$10" },
  ]},
];
const RIGHT_MENU = [
  { cat: "✦ Combos", items: [
    { name:"Cut & Shave",       sub:"Classic cut with hot towel shave",   price:"$50" },
    { name:"Fade & Beard",      sub:"Skin fade + full beard shape-up",    price:"$50" },
    { name:"The Full Service",  sub:"Cut + shave + line up",              price:"$65" },
  ]},
  { cat: "🧴 Extras", items: [
    { name:"Beard Trim",        sub:"Shape + condition + oil",            price:"$15" },
    { name:"Beard Shape-Up",    sub:"Full sculpt + straight razor edges", price:"$20" },
    { name:"Scalp Massage",     sub:"10-minute relaxing treatment",       price:"$15" },
    { name:"Eyebrow Trim",      sub:"Clean & defined brows",              price:"$8"  },
  ]},
];

const TILES = [
  ["mc-rust","✂"],["mc-gold","✦"],["mc-forest","💈"],["mc-dark","⚡"],["mc-rust","🌟"],
  ["mc-dark","🪒"],["mc-forest","🏆"],["mc-mah","✦"],["mc-gold","💇"],["mc-dark","🌿"],
  ["mc-gold","Jr"],["mc-dark","✂"],["mc-rust","🎨"],["mc-forest","⭐"],["mc-mah","💈"],
  ["mc-dark","🌙"],["mc-rust","✦"],["mc-cream","🪮"],["mc-dark","☀️"],["mc-gold","✦"],
  ["mc-forest","💎"],["mc-mah","🌺"],["mc-dark","✦"],["mc-rust","🎯"],["mc-gold","Jr"],
];

const REVIEWS = [
  { n:"01", init:"M", name:"Marcus T.", note:"Google Review · 5 stars",
    text:'"Best barbershop on Nolensville Pike. Clean shop, friendly staff, and my fade came out perfect. I\'ve tried a few spots in Nashville and this is the one I keep coming back to."' },
  { n:"02", init:"D", name:"David R.", note:"Google Review · 5 stars",
    text:'"Took my son here for the first time and couldn\'t be happier. The barber was patient with him and the cut was exactly what we asked for. We\'ll definitely be regulars."' },
  { n:"03", init:"J", name:"James L.", note:"Google Review · 5 stars",
    text:'"Super convenient to book through Booksy. Showed up, no wait, got a clean skin fade and a beard trim. Affordable prices and the shop is spotless. Highly recommend."' },
];

const SERVICES_LIST = [
  "Classic Cut ($25)","Fade Cut ($30)","Skin Fade ($35)","Cut & Style ($40)",
  "Hot Towel Shave ($30)","Cut & Shave ($50)","Fade & Beard ($50)","The Full Service ($65)","Kids Cut ($20)",
];
const TIMES = ["9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM"];

/* ══════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════ */

function Aztec() { return <div className="aztec" />; }

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active,   setActive]   = useState("");
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      let cur = "";
      document.querySelectorAll("section[id]").forEach(s => {
        if (window.scrollY >= s.offsetTop - 90) cur = s.id;
      });
      setActive(cur);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [["#services","Services"],["#about","About"],["#reviews","Reviews"],["#contact","Contact"]];

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-glow" />
      <div className="nav-inner">
        <a href="#home" className="nav-logo">Jr Barbershop</a>
        <ul className="nav-links">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className={active === href.slice(1) ? "active" : ""}>{label}</a>
            </li>
          ))}
          <li><a href={BOOKSY} target="_blank" rel="noreferrer" className="nav-cta">Book Now</a></li>
        </ul>
        <button className="nav-ham" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span style={open ? {transform:"rotate(45deg) translate(5px,5px)"} : {}} />
          <span style={open ? {opacity:0} : {}} />
          <span style={open ? {transform:"rotate(-45deg) translate(5px,-5px)"} : {}} />
        </button>
      </div>
      <div className={`nav-mobile${open ? " open" : ""}`}>
        {links.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a href={BOOKSY} target="_blank" rel="noreferrer" style={{color:"var(--gold)"}} onClick={() => setOpen(false)}>Book on Booksy ↗</a>
      </div>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  const pills = [
    { icon:"📍", text:<><strong>3221 Nolensville Pike</strong>, Nashville TN 37211</> },
    { icon:"🕗", text:<>Open Now · Closes <strong>8:00 PM</strong></> },
    { icon:"♿", text:<><strong>Wheelchair Accessible</strong></> },
    { icon:"📅", text:<>Book online at <strong>booksy.com</strong></> },
  ];
  return (
    <section className="hero" id="home">
      <div className="hero-lattice" />
      <div className="hero-orb" />
      <div className="hero-body">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-line" />
            <span>✦ Nashville, TN · Nolensville Pike · Barbershop ✦</span>
          </div>
          <h1>Jr Barbershop</h1>
          <p className="hero-sub">Nashville's Finest Cut</p>
          <div className="hero-rating">
            <span className="stars">★★★★★</span>
            <span className="score">5.0</span>
            <span className="count">32 Google reviews</span>
          </div>
          <p className="hero-desc">
            A neighborhood barbershop built on precision, respect, and community.
            Walk in, sit down, and leave looking your best — every single time.
            Serving Nashville's Nolensville Pike corridor with pride.
          </p>
          <div className="hero-ctas">
            <a href={BOOKSY} target="_blank" rel="noreferrer" className="btn-primary">Book on Booksy</a>
            <a href={PHONE} className="hero-link">📞 Call (629) 307-4218</a>
          </div>
        </div>
        <div className="hero-right">
          <div className="jr-badge">
            <span className="jr-badge-main">Jr</span>
            <span className="jr-badge-sub">Nashville · Since Day One</span>
          </div>
          <div className="info-pills">
            {pills.map((p, i) => (
              <div className="info-pill" key={i}>
                <span className="info-pill-icon">{p.icon}</span>
                <span className="info-pill-text">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-foot">
        <span>✦ Walk-ins Welcome</span>
        <span className="dot">|</span>
        <span>3221 Nolensville Pike</span>
        <span className="dot">|</span>
        <span>(629) 307-4218</span>
        <span className="dot">|</span>
        <span>Closes 8 PM ✦</span>
      </div>
    </section>
  );
}

/* ── Services ── */
function MenuGroup({ groups }) {
  return (
    <div className="menu-col">
      {groups.map((g, gi) => (
        <div key={gi}>
          <div className={`menu-cat${gi > 0 ? " mt" : ""}`}>{g.cat}</div>
          {g.items.map((item, ii) => (
            <div className="menu-row" key={ii}>
              <div>
                <span className="menu-row-name">{item.name}</span>
                <span className="menu-row-sub">{item.sub}</span>
              </div>
              <div className="menu-row-dots" />
              <span className="menu-row-price">{item.price}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Services() {
  const ref = useScrollReveal();
  return (
    <section className="services-section" id="services">
      <div className="sec-head">
        <div className="sec-eyebrow">What We Offer</div>
        <h2>Services &amp; <em>Pricing</em></h2>
        <p>Sharp cuts, clean lines, and a straight razor when you need it.</p>
      </div>
      <div className="menu-wrap sr" ref={ref}>
        <div className="menu-frame">
          <div className="menu-top">
            <h3>Jr Barbershop</h3>
            <p>Nashville · 3221 Nolensville Pike · Always Sharp</p>
          </div>
          <div className="menu-cols">
            <MenuGroup groups={LEFT_MENU} />
            <MenuGroup groups={RIGHT_MENU} />
          </div>
          <div className="menu-footer">
            <span>Walk-ins Welcome</span><span className="gem">✦</span>
            <span>Cash &amp; Card</span><span className="gem">✦</span>
            <span>Book via Booksy</span><span className="gem">✦</span>
            <span>Wheelchair Accessible</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Book Band ── */
function BookBand() {
  const ref = useScrollReveal();
  return (
    <div className="book-band sr" ref={ref}>
      <h3>Ready for a Fresh Cut?</h3>
      <p>Book your appointment online in seconds — or just walk in.</p>
      <div className="book-band-btns">
        <a href={BOOKSY} target="_blank" rel="noreferrer" className="btn-primary">Book on Booksy</a>
        <a href={PHONE} className="btn-outline">📞 (629) 307-4218</a>
      </div>
    </div>
  );
}

/* ── About ── */
function About() {
  const ref = useScrollReveal();
  return (
    <section className="about-section" id="about">
      <div className="about-layout">
        <div className="about-mosaic">
          {TILES.map(([cls, content], i) => (
            <div className={`mc ${cls}`} key={i}>{content}</div>
          ))}
        </div>
        <div className="about-text sr" ref={ref}>
          <span className="about-eyebrow">✦ Our Story ✦</span>
          <h2>More than a cut.<strong>A community.</strong></h2>
          <p>Jr Barbershop was built on a simple promise: every person who sits in this chair leaves feeling confident, respected, and sharp. Located in the heart of Nashville's Nolensville Pike corridor, we serve a neighborhood that deserves nothing but the best.</p>
          <p>Five stars on Google. Wheelchair accessible. A welcoming space for every background, every style, every generation.</p>
          <div className="about-divider" />
          <div className="about-facts">
            {[["5.0","Stars on Google"],["32","Happy reviews"],["∞","Pride in the craft"]].map(([n, l]) => (
              <div key={l}><span className="fact-num">{n}</span><span className="fact-label">{l}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Reviews ── */
function ReviewCard({ r, delay }) {
  const ref = useScrollReveal();
  return (
    <div className={`review-card sr d${delay}`} ref={ref}>
      <div className="review-num">{r.n}</div>
      <div className="review-stars">★★★★★</div>
      <p className="review-text">{r.text}</p>
      <div className="review-author">
        <div className="review-avatar">{r.init}</div>
        <div>
          <span className="review-name">{r.name}</span>
          <span className="review-note">{r.note}</span>
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="sec-head">
        <div className="sec-eyebrow">Google Reviews</div>
        <h2>What Nashville <em>Is Saying</em></h2>
        <p>5.0 stars — 32 reviews and counting.</p>
      </div>
      <div className="reviews-grid">
        {REVIEWS.map((r, i) => <ReviewCard key={r.n} r={r} delay={i} />)}
      </div>
    </section>
  );
}

/* ── Contact ── */
function Contact() {
  const ref = useScrollReveal();
  const [form, setForm] = useState({ name:"", phone:"", service:"", date:"", time:"9:00 AM" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <section className="contact-section" id="contact">
      <div className="sec-head">
        <div className="sec-eyebrow">Find Us</div>
        <h2>Visit or <em>Book Online</em></h2>
        <p>Walk in anytime or reserve your spot on Booksy.</p>
      </div>
      <div className="contact-grid sr" ref={ref}>
        <div>
          <h3 className="contact-info-title">Get in Touch</h3>
          <ul className="contact-list">
            {[
              ["📍","Address", <span>3221 Nolensville Pike<br/>Nashville, TN 37211</span>],
              ["📞","Phone", <a href={PHONE}>(629) 307-4218</a>],
              ["🕗","Hours", <div className="hours-grid"><span>Mon–Fri</span><span>Open · Closes 8pm</span><span>Saturday</span><span>Open · Closes 8pm</span><span>Sunday</span><span>Call to confirm</span></div>],
              ["🌐","Book Online", <a href={BOOKSY} target="_blank" rel="noreferrer">booksy.com — Jr Barbershop</a>],
              ["♿","Accessibility", <span>Wheelchair accessible location</span>],
            ].map(([icon, label, content]) => (
              <li className="contact-item" key={label}>
                <span className="contact-icon">{icon}</span>
                <div className="contact-body"><strong>{label}</strong>{content}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="booking-card">
          <div className="booking-card-head">
            <h3>Book a Cut</h3>
            <p>✦ Quick Inquiry Form ✦</p>
          </div>
          <div className="booking-card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-ctrl" type="text" placeholder="Your name" value={form.name} onChange={set("name")} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-ctrl" type="tel" placeholder="(629) 000-0000" value={form.phone} onChange={set("phone")} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Service</label>
              <select className="form-ctrl" value={form.service} onChange={set("service")}>
                <option value="">— Choose a service —</option>
                {SERVICES_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input className="form-ctrl" type="date" value={form.date} onChange={set("date")} />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <select className="form-ctrl" value={form.time} onChange={set("time")}>
                  {TIMES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <a href={BOOKSY} target="_blank" rel="noreferrer" className="btn-primary" style={{fontSize:".95rem"}}>Confirm on Booksy</a>
              <span className="form-or">— or —</span>
              <a href={PHONE} className="form-call">📞 Call (629) 307-4218 directly</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="footer-logo">Jr Barbershop</span>
          <span className="footer-tagline">Nashville, TN · 3221 Nolensville Pike</span>
          <p>A neighborhood barbershop built on precision, pride, and the belief that every person deserves to leave looking their best.</p>
        </div>
        <div className="footer-col">
          <h5>Quick Links</h5>
          <ul>
            {[["#services","Services & Pricing"],["#about","About Us"],["#reviews","Reviews"],["#contact","Contact & Hours"]].map(([h,l]) => (
              <li key={h}><a href={h}>{l}</a></li>
            ))}
            <li><a href={BOOKSY} target="_blank" rel="noreferrer" className="gold-link">Book on Booksy ↗</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Contact</h5>
          <p>3221 Nolensville Pike<br/>Nashville, TN 37211<br/><br/><a href={PHONE} className="gold-link">(629) 307-4218</a><br/><br/>Open daily · Closes 8 PM<br/>Walk-ins welcome<br/>♿ Wheelchair accessible</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Jr Barbershop · Nashville, TN · All rights reserved</p>
        <p>✦ 5.0 Stars · 32 Reviews · booksy.com ✦</p>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Aztec />
      <Services />
      <BookBand />
      <Aztec />
      <About />
      <Aztec />
      <Reviews />
      <Aztec />
      <Contact />
      <Aztec />
      <Footer />
    </>
  );
}
