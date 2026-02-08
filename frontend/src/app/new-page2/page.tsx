'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';



export default function LandingPage() {
    return (
        <>
            {/* Last Published: Thu Jan 29 2026 00:34:36 GMT+0000 (Coordinated Universal Time) */}
            <meta charSet="utf-8" />
            <title>Kandra - Automated Code Migration</title>
            <meta
                content="Stop rewriting code by hand. Let Kandra migrate it for you. Paste your repo. Pick your target stack. Get a PR with working code."
                name="description"
            />
            <meta content="Kandra - Automated Code Migration" property="og:title" />
            <meta
                content="Stop rewriting code by hand. Let Kandra migrate it for you. Paste your repo. Pick your target stack. Get a PR with working code."
                property="og:description"
            />
            <meta
                content="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c69af1f3035ff97de2cc38_HomePage-metaImage.jpg"
                property="og:image"
            />
            <meta content="Kandra - Automated Code Migration" property="twitter:title" />
            <meta
                content="Stop rewriting code by hand. Let Kandra migrate it for you. Paste your repo. Pick your target stack. Get a PR with working code."
                property="twitter:description"
            />
            <meta
                content="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c69af1f3035ff97de2cc38_HomePage-metaImage.jpg"
                property="twitter:image"
            />
            <meta property="og:type" content="website" />
            <meta content="summary_large_image" name="twitter:card" />
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            <link
                href="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/css/langchain-tonik.shared.ba723ba3f.min.css"
                rel="stylesheet"
                type="text/css"
                integrity="sha384-unI7o/DZJRpIRlO1Maoc6+Yhd7Gf3Sc3C0SDiHrjqdCoSrDn4kQqjHZZO3zMyqZT"
                crossOrigin="anonymous"
            />
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        '@media (min-width:992px) {html.w-mod-js:not(.w-mod-ix) [data-w-id="f5bc57f5-937b-522e-baf3-91c65601f66c"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="bf5a07ee-214c-2457-7a01-5def51dd7edf"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="ef5c979f-f952-e409-2ac5-450e280b94b1"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="cf3c02fd-707b-2c98-4fb1-0fe3a08d312d"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="ef5c979f-f952-e409-2ac5-450e280b94b3"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="eda21252-6eb4-60df-875a-6fa3edc5300c"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="d144cbaa-7376-06fa-50e3-a694ad3a5ea4"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="20cec576-9f82-7c67-f9d0-8a82a32b91d4"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="20cec576-9f82-7c67-f9d0-8a82a32b91d6"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="20cec576-9f82-7c67-f9d0-8a82a32b91d7"] {opacity:0;}}@media (max-width:991px) and (min-width:768px) {html.w-mod-js:not(.w-mod-ix) [data-w-id="f5bc57f5-937b-522e-baf3-91c65601f66c"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="bf5a07ee-214c-2457-7a01-5def51dd7edf"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="ef5c979f-f952-e409-2ac5-450e280b94b1"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="cf3c02fd-707b-2c98-4fb1-0fe3a08d312d"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="ef5c979f-f952-e409-2ac5-450e280b94b3"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="eda21252-6eb4-60df-875a-6fa3edc5300c"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="d144cbaa-7376-06fa-50e3-a694ad3a5ea4"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="20cec576-9f82-7c67-f9d0-8a82a32b91d4"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="20cec576-9f82-7c67-f9d0-8a82a32b91d6"] {opacity:0;}html.w-mod-js:not(.w-mod-ix) [data-w-id="20cec576-9f82-7c67-f9d0-8a82a32b91d7"] {opacity:0;}}'
                }}
            />
            <link href="https://fonts.googleapis.com" rel="preconnect" />
            <link
                href="https://fonts.gstatic.com"
                rel="preconnect"
                crossOrigin="anonymous"
            />
            <link
                href="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c50ca4352352dd6a747e69_favicon.png"
                rel="shortcut icon"
                type="image/x-icon"
            />
            <link
                href="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c50ca94c9fe4ac7c52b415_webClip.png"
                rel="apple-touch-icon"
            />
            <link
                href="https://www.langchain.com/langsmith/observability"
                rel="canonical"
            />
            {/* Google Tag Manager */}
            {/* End Google Tag Manager */}
            {/* Keep this css code to improve the font quality*/}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n  * {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  -o-font-smoothing: antialiased;\n}\n"
                }}
            />
            {/* [Attributes by Finsweet] Disable scrolling */}
            <style
                dangerouslySetInnerHTML={{
                    __html:
                        "\n  /* Make Flowbase / Tippy tooltip text respect \\n */\n  .tippy-box .tippy-content { white-space: pre-line; }\n"
                }}
            />
            {/* Flowbase Booster [Tooltips] */}
            <div className="page-wrapper">
                <div className="global-styles w-embed">
                    <style
                        dangerouslySetInnerHTML={{
                            __html:
                                '\n\n* {\n  -webkit-font-smoothing: antialiased;\n}\n\n.page-wrapper {\noverflow: clip;\n  }\n\n\n\n/* Set fluid size change for smaller breakpoints */\n  html { font-size: 1rem; }\n  @media screen and (max-width:1920px) and (min-width:1281px) { html { font-size: calc(0.2499999999999999rem + 0.6250000000000001vw); } }\n  @media screen and (max-width:1280px) and (min-width:992px) { html { font-size: calc(0.41223612197028925rem + 0.4222048475371384vw); } }\n/* video sizing */\n\nvideo {\n    object-fit: fill;\n\t\twidth: 100%;\n}\n\n\n\n#retrieval-video {\n    object-fit: cover;\n    width: 100%;\n}\n\n\n\n/* Set color style to inherit */\n.inherit-color * {\n    color: inherit;\n}\n\n/* Focus state style for keyboard navigation for the focusable elements */\n*[tabindex]:focus-visible,\n  input[type="file"]:focus-visible {\n   outline: 0.125rem solid #4d65ff;\n   outline-offset: 0.125rem;\n}\n\n/* Get rid of top margin on first element in any rich text element */\n.w-richtext > :not(div):first-child, .w-richtext > div:first-child > :first-child {\n  margin-top: 0 !important;\n}\n\n/* Get rid of bottom margin on last element in any rich text element */\n.w-richtext>:last-child, .w-richtext ol li:last-child, .w-richtext ul li:last-child {\n\tmargin-bottom: 0 !important;\n}\n\n/* Prevent all click and hover interaction with an element */\n.pointer-events-off {\n\tpointer-events: none;\n}\n\n/* Enables all click and hover interaction with an element */\n.pointer-events-on {\n  pointer-events: auto;\n}\n\n/* Create a class of .div-square which maintains a 1:1 dimension of a div */\n.div-square::after {\n\tcontent: "";\n\tdisplay: block;\n\tpadding-bottom: 100%;\n}\n\n/* Make sure containers never lose their center alignment */\n.container-medium,.container-small, .container-large {\n\tmargin-right: auto !important;\n  margin-left: auto !important;\n}\n\n/* \nMake the following elements inherit typography styles from the parent and not have hardcoded values. \nImportant: You will not be able to style for example "All Links" in Designer with this CSS applied.\nUncomment this CSS to use it in the project. Leave this message for future hand-off.\n*/\n/*\na,\n.w-input,\n.w-select,\n.w-tab-link,\n.w-nav-link,\n.w-dropdown-btn,\n.w-dropdown-toggle,\n.w-dropdown-link {\n  color: inherit;\n  text-decoration: inherit;\n  font-size: inherit;\n}\n*/\n\n/* Apply "..." after 3 lines of text */\n.text-style-3lines {\n\tdisplay: -webkit-box;\n\toverflow: hidden;\n\t-webkit-line-clamp: 3;\n\t-webkit-box-orient: vertical;\n}\n\n/* Apply "..." after 2 lines of text */\n.text-style-2lines {\n\tdisplay: -webkit-box;\n\toverflow: hidden;\n\t-webkit-line-clamp: 2;\n\t-webkit-box-orient: vertical;\n}\n\n/* Adds inline flex display */\n.display-inlineflex {\n  display: inline-flex;\n}\n\n/* These classes are never overwritten */\n.hide {\n  display: none !important;\n}\n\n@media screen and (max-width: 991px) {\n    .hide, .hide-tablet {\n        display: none !important;\n    }\n}\n  @media screen and (max-width: 767px) {\n    .hide-mobile-landscape{\n      display: none !important;\n    }\n}\n  @media screen and (max-width: 479px) {\n    .hide-mobile{\n      display: none !important;\n    }\n}\n \n.margin-0 {\n  margin: 0rem !important;\n}\n  \n.padding-0 {\n  padding: 0rem !important;\n}\n\n.spacing-clean {\npadding: 0rem !important;\nmargin: 0rem !important;\n}\n\n.margin-top {\n  margin-right: 0rem !important;\n  margin-bottom: 0rem !important;\n  margin-left: 0rem !important;\n}\n\n.padding-top {\n  padding-right: 0rem !important;\n  padding-bottom: 0rem !important;\n  padding-left: 0rem !important;\n}\n  \n.margin-right {\n  margin-top: 0rem !important;\n  margin-bottom: 0rem !important;\n  margin-left: 0rem !important;\n}\n\n.padding-right {\n  padding-top: 0rem !important;\n  padding-bottom: 0rem !important;\n  padding-left: 0rem !important;\n}\n\n.margin-bottom {\n  margin-top: 0rem !important;\n  margin-right: 0rem !important;\n  margin-left: 0rem !important;\n}\n\n.padding-bottom {\n  padding-top: 0rem !important;\n  padding-right: 0rem !important;\n  padding-left: 0rem !important;\n}\n\n.margin-left {\n  margin-top: 0rem !important;\n  margin-right: 0rem !important;\n  margin-bottom: 0rem !important;\n}\n  \n.padding-left {\n  padding-top: 0rem !important;\n  padding-right: 0rem !important;\n  padding-bottom: 0rem !important;\n}\n  \n.margin-horizontal {\n  margin-top: 0rem !important;\n  margin-bottom: 0rem !important;\n}\n\n.padding-horizontal {\n  padding-top: 0rem !important;\n  padding-bottom: 0rem !important;\n}\n\n.margin-vertical {\n  margin-right: 0rem !important;\n  margin-left: 0rem !important;\n}\n  \n.padding-vertical {\n  padding-right: 0rem !important;\n  padding-left: 0rem !important;\n}\n\n/* Apply "..." at 100% width */\n.truncate-width { \n\t\twidth: 100%; \n    white-space: nowrap; \n    overflow: hidden; \n    text-overflow: ellipsis; \n}\n/* Removes native scrollbar */\n.no-scrollbar {\n    -ms-overflow-style: none;\n    overflow: -moz-scrollbars-none; \n}\n\n.no-scrollbar::-webkit-scrollbar {\n    display: none;\n}\n\ninput:checked + span {\ncolor: white    /* styles for the div immediately following the checked input */\n}\n\n/* styles for word-wrapping\nh1, h2, h3 {\nword-wrap: break-word;\nhyphens: auto;\n}*/\n\n[nav-theme="light"] .navbar_logo-svg {\n\t--nav--logo: var(--light--logo);\n}\n\n[nav-theme="light"] .button.is-nav {\n\t--nav--button-bg: var(--light--button-bg);\n\t--nav--button-text: var(--light--button-text);\n}\n\n[nav-theme="light"] .button.is-nav:hover {\n\t--nav--button-bg: var(--dark--button-bg);\n\t--nav--button-text:var(--dark--button-text);\n}\n\n[nav-theme="dark"] .navbar_logo-svg {\n\t--nav--logo: var(--dark--logo);\n}\n\n[nav-theme="dark"] .button.is-nav {\n\t--nav--button-bg: var(--dark--button-bg);\n\t--nav--button-text: var(--dark--button-text);\n}\n\n[nav-theme="dark"] .button.is-nav:hover {\n\t--nav--button-bg: var(--light--button-bg);\n\t--nav--button-text: var(--light--button-text);\n}\n\n[nav-theme="red"] .navbar_logo-svg {\n\t--nav--logo: var(--red--logo);\n}\n\n\n[nav-theme="red"] .button.is-nav {\n\t--nav--button-bg: var(--red--button-bg);\n\t--nav--button-text: var(--red--button-text);\n}\n\n.navbar_logo-svg.is-light, .navbar_logo-svg.is-red.is-light{\ncolor: #F8F7FF!important;\n}\n\n.news_button[disabled] {\nbackground: none;\n}\n\n.product_bg-video video {\nobject-fit: fill;\n}\n.text-size-regular.toc-link-agents.w--current {\n\tcolor: var(--colors--green--green-400) !important;\n}\n\n'
                        }}
                    />
                </div>
                <div
                    data-animation="default"
                    className="navbar_component w-nav"
                    data-easing2="ease"
                    fs-scrolldisable-element="smart-nav"
                    data-easing="ease"
                    data-collapse="medium"
                    data-w-id="eadaa77e-f085-7bef-fa43-8ecfa4c002f1"
                    role="banner"
                    data-duration={400}
                >
                    <div className="navbar_container">
                        <a href="/" className="navbar_logo-link w-nav-brand">
                            <div className="navbar_logo-svg text-color-green-400 w-embed" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Terminal size={24} strokeWidth={2.5} />
                                <span className="text-size-h4 text-weight-bold" style={{ letterSpacing: '-0.03em', lineHeight: '1' }}>Kandra</span>
                            </div>
                        </a>
                        <nav
                            role="navigation"
                            className="navbar_menu is-page-height-tablet nav-menu nav-menu-2 nav-menu-3 nav-menu-4 w-nav-menu"
                        >
                            <div className="navbar_navlinks is-new">
                                <a
                                    href="#how-it-works"
                                    className="navbar_link is-pricing menu is-new navbar-link-body3"
                                >
                                    How it Works
                                </a>
                                <a
                                    href="#features"
                                    className="navbar_link is-pricing menu is-new navbar-link-body3"
                                >
                                    Features
                                </a>
                                <a
                                    href="https://docs.kandra.ai"
                                    className="navbar_link is-pricing menu is-new navbar-link-body3"
                                >
                                    Docs
                                </a>
                            </div>
                            <div className="navbar_menu-buttons">
                                <a
                                    href="/connect"
                                    target="_blank"
                                    className="button is-nav is-smaller w-button !bg-blue-600 !text-white"
                                >
                                    Start Migration
                                </a>
                            </div>
                        </nav>
                        <div id="menu-toggle" className="navbar_menu-button w-nav-button">
                            <div className="menu-icon">
                                <div className="menu-icon_line-top" />
                                <div className="menu-icon_line-middle">
                                    <div className="menu-icon_line-middle-inner" />
                                </div>
                                <div className="menu-icon_line-bottom" />
                            </div>
                        </div>
                        <div className="navbar_menu-bg" />
                        <div className="navbar_scroll-bg" />
                    </div>
                </div>
                <main className="main-wrapper">
                    <header className="section_header relative overflow-hidden">
                        {/* Premium Background Effects */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            {/* Ambient Glows */}
                            <div className="absolute top-[-50%] left-[-20%] w-[1000px] h-[1000px] rounded-full bg-blue-600/15 blur-[120px]" />
                            <div className="absolute top-[0%] right-[-20%] w-[800px] h-[800px] rounded-full bg-purple-600/15 blur-[120px]" />

                            {/* Technical Grid Pattern */}
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                                maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
                                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)'
                            }} />
                        </div>

                        <div className="padding-global relative z-10">
                            <div className="container-large">
                                <div
                                    data-w-id="bf5a07ee-214c-2457-7a01-5def51dd7edf"
                                    className="ls-hero-wrapper"
                                >
                                    <div
                                        id="w-node-ef3c2030-4aac-165d-f3f5-763d0cf457c0-e2060821"
                                        className="ls-hero-content-wrapper"
                                    >
                                        <div className="ls-hero-label">
                                            <div className="text-size-body1">
                                                <strong className="text-weight-medium">Kandra</strong>{" "}
                                                Autonomous Engineer
                                            </div>
                                        </div>
                                        <div className="spacer-32 _24-mobile" />
                                        <h1 className="h1-smaller">
                                            Your entire stack. Modernized.
                                        </h1>
                                        <div className="spacer-32 _16-mobile" />
                                        <p className="text-size-body1">
                                            Stop fighting with legacy code. Kandra plans, rewrites, and verifies your migration—so you can get back to building.
                                        </p>
                                        <div className="spacer-64 _32-mobile" />
                                        <div className="join-us_buttons-wrapper-ls">
                                            <a
                                                href="/connect"
                                                className="button w-button !bg-blue-600 !text-white"
                                            >
                                                Start Migration
                                            </a>
                                            <a
                                                href="#"
                                                className="button is-secondary w-button"
                                            >
                                                Watch Demo
                                            </a>
                                        </div>
                                    </div>
                                    <div className="w-full h-[500px] relative overflow-hidden" style={{
                                        // CSS Mask for fading edges into background
                                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
                                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)'
                                    }}>
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                opacity: 1 // Full opacity since mask handles the fade
                                            }}
                                        >
                                            <source src="https://cdn.pixabay.com/video/2022/03/16/110946-689949689_large.mp4" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>

                                        {/* Optional: Deep Blue tint to ensure it matches the brand theme if the video is too distinctive */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(15, 23, 42, 0.2)', // Slate-900 tint
                                            pointerEvents: 'none'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </header>

                    <section className="section_code-transform relative py-24 overflow-hidden">
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="text-center mb-16">
                                    <h2 className="heading-style-h2 mb-4">Architectural Intelligence.</h2>
                                    <p className="text-size-body1 text-slate-500 max-w-2xl mx-auto">
                                        Kandra doesn't just format code. It understands your entire project's context, refactors business logic, and standardizes patterns across thousands of files.
                                    </p>
                                </div>

                                <div className="relative w-full max-w-5xl mx-auto">
                                    {/* Glassmorphic IDE Window */}
                                    <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10">
                                        {/* IDE Toolbar */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                                <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                                                <Terminal size={12} />
                                                <span>kandra_agent_view</span>
                                            </div>
                                            <div className="w-16" />
                                        </div>

                                        {/* Split View Content */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 text-sm font-mono leading-relaxed relative min-h-[400px]">

                                            {/* LEFT: Legacy Code (Messy) */}
                                            <div className="p-8 bg-slate-50/50 text-slate-400 relative border-r border-slate-100">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <span className="text-xs uppercase tracking-wider font-semibold text-red-500/70 flex items-center gap-2">
                                                        <span>❌ Legacy Pattern</span>
                                                    </span>
                                                    <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-[10px] font-bold">BLOCKING I/O</span>
                                                </div>
                                                <pre className="overflow-x-auto"><code>{`function processUser(id, cb) {
  // ⚠️ Callback Hell & No Types
  
  db.find({id: id}, function(err, user) {
    if(err) return cb(err);
    
    // ⚠️ Implicit 'any' type
    if(!user) return cb("No user");

    // 🚩 N+1 Query Problem
    getProfile(user.pid, function(err, prof) {
      if(err) return cb(err);
      
      // ⚠️ Business Logic Leak
      if(prof.status === 'active') {
        cb(null, prof);
      } else {
        cb("Inactive");
      }
    });
  });
}`}</code></pre>
                                            </div>

                                            {/* CENTER: Agent Reasoning Overlay */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                                                {/* Pulsing Brain Node */}
                                                <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-slate-950 text-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.3)] border border-slate-800">
                                                    <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping" />
                                                    <Terminal size={24} />
                                                </div>

                                                {/* Live Thought Stream */}
                                                <div className="mt-4 w-64 bg-slate-900/90 backdrop-blur text-white p-3 rounded-lg border border-slate-700 shadow-xl text-[10px] font-mono space-y-2">
                                                    <div className="flex items-center gap-2 text-blue-300">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                                        <span>Analyzing dependency graph...</span>
                                                    </div>
                                                    <div className="text-slate-400 pl-3.5">
                                                        {`> Found 'Callback Hell' pattern`}
                                                    </div>
                                                    <div className="text-slate-400 pl-3.5">
                                                        {`> Resolved 'UserProfile' generic`}
                                                    </div>
                                                    <div className="text-green-400 pl-3.5">
                                                        {`> Applied 'Async/Await' transform`}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* RIGHT: Modern Code (Clean) */}
                                            <div className="p-8 bg-white text-slate-800 relative">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 flex items-center gap-2">
                                                        <span>✅ Kandra Architecture</span>
                                                    </span>
                                                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">TYPE-SAFE</span>
                                                </div>
                                                <pre className="overflow-x-auto"><code>{`async function processUser(id: string): Promise<UserProfile> {
  // ✨ Parallelized Data Fetching
  const user = await db.find({ id });
  
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // ✨ Global Type Definition
  const profile = await getProfile(user.pid);
  
  // ✨ Standardized Error Handling
  if (profile.status !== 'active') {
    throw new InactiveUserError();
  }

  return profile;
}`}</code></pre>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative Blob Behind */}
                                    <div className="absolute -inset-10 bg-gradient-to-r from-blue-100/50 via-purple-100/50 to-pink-100/50 blur-3xl -z-10 opacity-60 rounded-[3rem]" />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            {/* Google Tag Manager (noscript) */}
            <noscript>
                <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-T675KH33"
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                />
            </noscript>
            {/* End Google Tag Manager (noscript) */}
        </>

    );
}
