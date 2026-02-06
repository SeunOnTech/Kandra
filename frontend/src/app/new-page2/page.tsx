'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Copy, Check, Terminal, Play, Pause, FastForward, Shield, Layout, Settings, Activity, GitBranch, Cpu, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated Terminal Logs
const TERMINAL_LOGS = [
    { type: "info", msg: "Kandra Agent Initialized v2.4.0" },
    { type: "info", msg: "Connecting to repository..." },
    { type: "success", msg: "Repository connected. 142 files found." },
    { type: "info", msg: "Analyzing dependency graph..." },
    { type: "warning", msg: "Detected legacy pattern: Callback Hell in /server/routes" },
    { type: "info", msg: "Generating migration plan (Strategy: Recursive)" },
    { type: "success", msg: "Plan approved. Starting execution phase." },
    { type: "exe", msg: ">> Migrating src/utils/db.js -> src/utils/db.ts" },
    { type: "success", msg: "✓ src/utils/db.ts compiled" },
    { type: "exe", msg: ">> Migrating src/api/user.js -> src/api/user.ts" },
    { type: "info", msg: "Running autonomous verification suite..." },
    { type: "success", msg: "✓ Test suite passed (45/45 tests)" },
    { type: "success", msg: "Migration complete. PR ready for review." },
];

function TerminalView() {
    const [logs, setLogs] = useState<typeof TERMINAL_LOGS>([]);
    const [isClient, setIsClient] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsClient(true);
        let index = 0;
        const interval = setInterval(() => {
            if (index < TERMINAL_LOGS.length) {
                const newLog = TERMINAL_LOGS[index];
                if (newLog) {
                    setLogs(prev => [...prev, newLog]);
                }
                index++;
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            } else {
                setLogs([]);
                index = 0;
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    const getTime = () => {
        if (!isClient) return "00:00:00";
        return new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    };

    return (
        <div className="bg-slate-900 rounded-xl overflow-hidden font-mono text-xs shadow-inner h-full flex flex-col border border-slate-800">
            <div className="flex items-center px-4 py-2 bg-slate-950 border-b border-slate-800">
                <Terminal className="w-3 h-3 text-slate-400 mr-2" />
                <span className="text-slate-400">Agent Terminal</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-1.5 scrollbar-hide" ref={scrollRef}>
                {logs.map((log, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={i}
                        className="flex gap-2"
                    >
                        <span className="text-slate-600 select-none min-w-[60px]">{getTime()}</span>
                        <span className={`
                            ${log.type === 'success' ? 'text-green-400' : ''}
                            ${log.type === 'warning' ? 'text-amber-400' : ''}
                            ${log.type === 'info' ? 'text-blue-300' : ''}
                            ${log.type === 'exe' ? 'text-purple-300' : ''}
                        `}>
                            {log.msg}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

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
                                    className="button is-nav is-smaller w-button"
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
                    <header className="section_header">
                        <div className="padding-global">
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
                                                className="button w-button"
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
                                    <div
                                        id="w-node-_13281a38-0a87-af56-f7b1-400bf7a8fe8b-e2060821"
                                        className="ls-hero-image-wrapper"
                                    >
                                        <div className="bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 p-1 w-full h-[500px] relative">
                                            <TerminalView />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="header_background-video-wrapper is-orange" />
                    </header>
                    <section
                        data-w-id="f5bc57f5-937b-522e-baf3-91c65601f66c"
                        className="section_tools-logos"
                    >
                        <div className="padding-global">
                            <div className="container-large">
                                <div
                                    data-w-id="f5bc57f5-937b-522e-baf3-91c65601f66f"
                                    className="logo_component is-ls"
                                >
                                    <p className="text-size-body1">
                                        Loved by 10,000+ developers who hate manual rewrites
                                    </p>
                                    <div className="banner_tasks hide-mobile-portrait">
                                        <div className="banner_wrapper">
                                            <div className="banner_marquee w-dyn-list">
                                                <div
                                                    role="list"
                                                    className="banner_marquee-inner is-new w-dyn-items"
                                                >
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77461846a7cf254d8391_Klarna_Logo_black%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1d39b2c6c806093f171_GitLab_logo_(2)%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/681b541fe451e978c3ccddd2_logo_clay.png"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63bc524be687757a9ab4c_logo_linkedin.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49cea075b0f09f44edc0_logo_rippling.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68f29b61b55203228fab9833_logo_vanta.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1aa251143166667aec3_logo_Rakuten.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77b2f63a9dcf3b2fac9f_The_Home_Depot-Logo.wine%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c37daf9c4b95bc8a254_logo_loreal.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c7f9b2ef2d8e52abdd6_logo_schneider%20electric.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1c1c55df212370b53fd_logo_Elastic.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63cb12ad03835ebf875de_logo_dun%20and%20bradstreet.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d206eefdb37789451855_The_Home_Depot-Logo.wine%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63d22da049beb5d48299d_logo_vizient.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1ddfdc1291f495b3697_AppFolio%2C_Inc._Wordmark%2C_2021%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49d608d82e8411f67557_logo_podium.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="banner_marquee w-dyn-list">
                                                <div
                                                    role="list"
                                                    className="banner_marquee-inner is-new w-dyn-items"
                                                >
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77461846a7cf254d8391_Klarna_Logo_black%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1d39b2c6c806093f171_GitLab_logo_(2)%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/681b541fe451e978c3ccddd2_logo_clay.png"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63bc524be687757a9ab4c_logo_linkedin.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49cea075b0f09f44edc0_logo_rippling.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68f29b61b55203228fab9833_logo_vanta.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1aa251143166667aec3_logo_Rakuten.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77b2f63a9dcf3b2fac9f_The_Home_Depot-Logo.wine%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c37daf9c4b95bc8a254_logo_loreal.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c7f9b2ef2d8e52abdd6_logo_schneider%20electric.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1c1c55df212370b53fd_logo_Elastic.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63cb12ad03835ebf875de_logo_dun%20and%20bradstreet.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d206eefdb37789451855_The_Home_Depot-Logo.wine%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63d22da049beb5d48299d_logo_vizient.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1ddfdc1291f495b3697_AppFolio%2C_Inc._Wordmark%2C_2021%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49d608d82e8411f67557_logo_podium.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="banner_marquee w-dyn-list">
                                                <div
                                                    role="list"
                                                    className="banner_marquee-inner is-new w-dyn-items"
                                                >
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77461846a7cf254d8391_Klarna_Logo_black%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1d39b2c6c806093f171_GitLab_logo_(2)%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/681b541fe451e978c3ccddd2_logo_clay.png"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63bc524be687757a9ab4c_logo_linkedin.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49cea075b0f09f44edc0_logo_rippling.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68f29b61b55203228fab9833_logo_vanta.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1aa251143166667aec3_logo_Rakuten.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77b2f63a9dcf3b2fac9f_The_Home_Depot-Logo.wine%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c37daf9c4b95bc8a254_logo_loreal.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c7f9b2ef2d8e52abdd6_logo_schneider%20electric.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1c1c55df212370b53fd_logo_Elastic.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63cb12ad03835ebf875de_logo_dun%20and%20bradstreet.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d206eefdb37789451855_The_Home_Depot-Logo.wine%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63d22da049beb5d48299d_logo_vizient.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1ddfdc1291f495b3697_AppFolio%2C_Inc._Wordmark%2C_2021%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49d608d82e8411f67557_logo_podium.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="banner_marquee w-dyn-list">
                                                <div
                                                    role="list"
                                                    className="banner_marquee-inner is-new w-dyn-items"
                                                >
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77461846a7cf254d8391_Klarna_Logo_black%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1d39b2c6c806093f171_GitLab_logo_(2)%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/681b541fe451e978c3ccddd2_logo_clay.png"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63bc524be687757a9ab4c_logo_linkedin.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49cea075b0f09f44edc0_logo_rippling.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68f29b61b55203228fab9833_logo_vanta.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1aa251143166667aec3_logo_Rakuten.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77b2f63a9dcf3b2fac9f_The_Home_Depot-Logo.wine%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c37daf9c4b95bc8a254_logo_loreal.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c7f9b2ef2d8e52abdd6_logo_schneider%20electric.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1c1c55df212370b53fd_logo_Elastic.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63cb12ad03835ebf875de_logo_dun%20and%20bradstreet.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d206eefdb37789451855_The_Home_Depot-Logo.wine%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63d22da049beb5d48299d_logo_vizient.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1ddfdc1291f495b3697_AppFolio%2C_Inc._Wordmark%2C_2021%201.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                    <div role="listitem" className="w-dyn-item">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49d608d82e8411f67557_logo_podium.svg"
                                                            loading="lazy"
                                                            alt=""
                                                            className="logos-collection-item"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mobile-version">
                                        <div className="banner_tasks">
                                            <div className="banner_wrapper">
                                                <div className="banner_marquee w-dyn-list">
                                                    <div
                                                        role="list"
                                                        className="banner_marquee-inner is-new w-dyn-items"
                                                    >
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77461846a7cf254d8391_Klarna_Logo_black%201.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1d39b2c6c806093f171_GitLab_logo_(2)%201.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/681b541fe451e978c3ccddd2_logo_clay.png"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63bc524be687757a9ab4c_logo_linkedin.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49cea075b0f09f44edc0_logo_rippling.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68f29b61b55203228fab9833_logo_vanta.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1aa251143166667aec3_logo_Rakuten.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="banner_marquee w-dyn-list">
                                                    <div
                                                        role="list"
                                                        className="banner_marquee-inner is-new w-dyn-items"
                                                    >
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77461846a7cf254d8391_Klarna_Logo_black%201.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1d39b2c6c806093f171_GitLab_logo_(2)%201.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/681b541fe451e978c3ccddd2_logo_clay.png"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63bc524be687757a9ab4c_logo_linkedin.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49cea075b0f09f44edc0_logo_rippling.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68f29b61b55203228fab9833_logo_vanta.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                        <div role="listitem" className="w-dyn-item">
                                                            <img
                                                                src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1aa251143166667aec3_logo_Rakuten.svg"
                                                                loading="lazy"
                                                                alt=""
                                                                className="logos-collection-item"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            lumious-ticker-speed={13}
                                            lumious-ticker="true"
                                            className="ticker-2 is-reversed w-dyn-list"
                                        >
                                            <div
                                                lumious-ticker-content="true"
                                                role="list"
                                                className="ticker-content-2 w-dyn-items"
                                            >
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680b77b2f63a9dcf3b2fac9f_The_Home_Depot-Logo.wine%201.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c37daf9c4b95bc8a254_logo_loreal.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63c7f9b2ef2d8e52abdd6_logo_schneider%20electric.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1c1c55df212370b53fd_logo_Elastic.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63cb12ad03835ebf875de_logo_dun%20and%20bradstreet.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d206eefdb37789451855_The_Home_Depot-Logo.wine%201.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/68e63d22da049beb5d48299d_logo_vizient.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/6811d1ddfdc1291f495b3697_AppFolio%2C_Inc._Wordmark%2C_2021%201.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div role="listitem" className="ticker-logo-2 w-dyn-item">
                                                    <img
                                                        width="Auto"
                                                        height="Auto"
                                                        alt=""
                                                        src="https://cdn.prod.website-files.com/65c81e88c254bb0f97633a71/680f49d608d82e8411f67557_logo_podium.svg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="section_layout is-product">
                        <div className="padding-global is-wide">
                            <div className="container-xlarge">
                                <div className="product_bg-wrapper background-color-violet200 islangsmith is-ls">
                                    <div className="w-layout-grid product_component is-inverted islangsmith is-ls">
                                        <div
                                            data-w-id="39b292f5-42d3-75e5-f867-498b4ced7d6e"
                                            className="product_carousel"
                                        >
                                            <img
                                                src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68f2d23758d9e2dc05609887_LS-obs-1.webp"
                                                loading="lazy"
                                                alt=""
                                                className="product_carousel-img-1"
                                            />
                                        </div>
                                        <div className="product_text-wrapper is-ls">
                                            <div className="product_text-content align-left">
                                                <h2 className="heading-style-h2 text-balance">
                                                    For the platform folks
                                                </h2>
                                                <p className="text-size-medium">
                                                    You&apos;re juggling 50 services and someone wants everything on Spring Boot by Q3. Kandra makes that conversation a lot less painful.
                                                </p>
                                                <a
                                                    href="/migrate"
                                                    className="button is-link w-inline-block"
                                                >
                                                    <div>Start a migration</div>
                                                    <div className="link_icon w-embed">
                                                        <svg
                                                            width={15}
                                                            height={14}
                                                            viewBox="0 0 15 14"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M14.0788 1.96304L2.33407 13.7077L0.919861 12.2935L12.6645 0.548828L14.0788 1.96304Z"
                                                                fill="CurrentColor"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M12.5 2H1.5V0H14.5V13H12.5V2Z"
                                                                fill="CurrentColor"
                                                            />
                                                        </svg>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="section_layout is-product">
                        <div className="padding-global is-wide">
                            <div className="container-xlarge">
                                <div className="product_bg-wrapper background-color-violet200 islangsmith is-ls">
                                    <div className="w-layout-grid product_component islangsmith is-down-mobile is-ls">
                                        <div className="product_text-wrapper is-ls-reverse">
                                            <div className="product_text-content align-left">
                                                <h2 className="heading-style-h2 text-balance">
                                                    For the leads planning upgrades
                                                </h2>
                                                <p className="text-size-medium">
                                                    Get a clear migration plan before you commit. See exactly what changes, what breaks, and what tests need updating—then decide if you&apos;re ready.
                                                </p>
                                                <a
                                                    href="/migrate"
                                                    className="button is-link w-inline-block"
                                                >
                                                    <div>See a sample plan</div>
                                                    <div className="link_icon w-embed">
                                                        <svg
                                                            width={15}
                                                            height={14}
                                                            viewBox="0 0 15 14"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M14.0788 1.96304L2.33407 13.7077L0.919861 12.2935L12.6645 0.548828L14.0788 1.96304Z"
                                                                fill="CurrentColor"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M12.5 2H1.5V0H14.5V13H12.5V2Z"
                                                                fill="CurrentColor"
                                                            />
                                                        </svg>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                        <div
                                            data-w-id="39b292f5-42d3-75e5-f867-498b4ced7d89"
                                            className="product_carousel"
                                        >
                                            <img
                                                src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68e63f4be76d8fa925232455_LS-obs-2%201.webp"
                                                loading="lazy"
                                                alt=""
                                                className="product_carousel-img-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="section_layout is-product more-padding-bottom">
                        <div className="padding-global is-wide">
                            <div className="container-xlarge">
                                <div className="product_bg-wrapper background-color-violet200 islangsmith is-ls">
                                    <div className="w-layout-grid product_component is-inverted islangsmith is-ls">
                                        <div
                                            data-w-id="e82e8e01-d9e8-5486-34d6-ec198db20ec1"
                                            className="product_carousel"
                                        >
                                            <img
                                                src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68e63f4bafbabae796df8a8c_LS-obs-3%203.webp"
                                                loading="lazy"
                                                alt=""
                                                className="product_carousel-img-1"
                                            />
                                        </div>
                                        <div className="product_text-wrapper is-ls">
                                            <div className="product_text-content align-left">
                                                <h2 className="heading-style-h2 text-balance">
                                                    For developers in the trenches
                                                </h2>
                                                <p className="text-size-medium">
                                                    One repo or a hundred. Paste the URL, pick your target, and get back to building features instead of fighting with syntax.
                                                </p>
                                                <a
                                                    href="/migrate"
                                                    className="button is-link w-inline-block"
                                                >
                                                    <div>Start coding</div>
                                                    <div className="link_icon w-embed">
                                                        <svg
                                                            width={15}
                                                            height={14}
                                                            viewBox="0 0 15 14"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M14.0788 1.96304L2.33407 13.7077L0.919861 12.2935L12.6645 0.548828L14.0788 1.96304Z"
                                                                fill="CurrentColor"
                                                            />
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M12.5 2H1.5V0H14.5V13H12.5V2Z"
                                                                fill="CurrentColor"
                                                            />
                                                        </svg>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="section_layout is-cta-block is-ls">
                        <div className="padding-global is-wide">
                            <div className="container-xlarge">
                                <div className="cta-block_bg-content-orange is-ls">
                                    <h2
                                        data-w-id="ef5c979f-f952-e409-2ac5-450e280b94b1"
                                        className="heading-style-h2 text-align-center"
                                    >
                                        Built for people who&apos;d rather ship than rewrite
                                    </h2>
                                    <div className="spacer-24" />
                                    <div className="max-width-870">
                                        <p
                                            data-w-id="cf3c02fd-707b-2c98-4fb1-0fe3a08d312d"
                                            className="text-size-body2-2 text-align-center"
                                        >
                                            We&apos;ve all been there—staring at legacy code, knowing the rewrite will take months. Kandra handles the grunt work so you can focus on what actually matters.
                                        </p>
                                    </div>
                                    <div className="spacer-72 _40-mobile" />
                                    <div
                                        data-w-id="ef5c979f-f952-e409-2ac5-450e280b94b3"
                                        className="cta-block_buttons-wrap langsmithpage is-ls"
                                    >
                                        <a
                                            href="/connect"
                                            className="button w-button"
                                        >
                                            Try It Free
                                        </a>
                                        <a
                                            href="/contact-sales"
                                            className="button is-alternate w-button"
                                        >
                                            Contact Sales
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="section-ls-3col">
                        <div className="padding-global">
                            <div className="container-xlarge">
                                <div className="ls-3col-wrapper">
                                    <h2 data-w-id="eda21252-6eb4-60df-875a-6fa3edc5300c">
                                        Don&apos;t take our word for it.<br /> Here&apos;s what people are saying.
                                    </h2>
                                    <div className="spacer-112 _60-landscape _40-mobile" />
                                    <div
                                        data-w-id="d144cbaa-7376-06fa-50e3-a694ad3a5ea4"
                                        className="ls-3col"
                                    >
                                        <div className="ls-3col-col">
                                            <div className="ls-col-top" />
                                            <div className="ls-col-bottom">
                                                <div className="text-style-label is-opacity-80 is-color-white">
                                                    Founder
                                                </div>
                                                <h5 className="text-balance">
                                                    &quot;We had a Java monolith nobody wanted to touch. Kandra turned a 6-month project into 3 weeks. I&apos;m not exaggerating.&quot;
                                                </h5>
                                                <div className="text-size-body2">- Chris S.</div>
                                            </div>
                                        </div>
                                        <div className="ls-3col-col">
                                            <div className="ls-col-top is-orange" />
                                            <div className="ls-col-bottom">
                                                <div className="text-style-label is-opacity-80 is-color-white">
                                                    Senior Dev
                                                </div>
                                                <h5 className="balance-mobile">
                                                    &quot;Okay so I was mass skeptical at first. &apos;AI migration tool&apos; sounds like vaporware. But it actually works? The generated code passed our CI on the first try. Wild.&quot;
                                                </h5>
                                                <div className="text-size-body2">- Jack O.</div>

                                            </div>
                                        </div>
                                        <div className="ls-3col-col">
                                            <div className="ls-col-top" />
                                            <div className="ls-col-bottom">
                                                <div className="text-style-label is-opacity-80 is-color-white">
                                                    Tech Lead
                                                </div>
                                                <h5 className="text-balance">
                                                    &quot;Finally convinced my team to migrate off Express. Showed them Kandra&apos;s output and suddenly everyone was on board.&quot;
                                                </h5>
                                                <div className="text-size-body2">- Jane P.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main >
                <footer className="footer_component-orange">
                    <div className="padding-global">
                        <div className="footer_top-component">
                            <div className="w-layout-grid footer_top-wrapper">
                                <div className="w-layout-grid footer_left-wrapper">
                                    <div className="footer_link-list">
                                        <div className="margin-bottom margin-xxsmall">
                                            <div className="heading-style-h6">Products</div>
                                        </div>
                                        <div
                                            id="w-node-ed59fd8f-4548-9b12-643e-b1816711f5bf-6711f5b5"
                                            className="footer-link_column"
                                        >
                                            <a href="/" className="footer_link">
                                                Kandra
                                            </a>
                                            <a
                                                id="w-node-ed59fd8f-4548-9b12-643e-b1816711f5c4-6711f5b5"
                                                href="/docs"
                                                className="footer_link"
                                            >
                                                Documentation
                                            </a>
                                            <a
                                                href="/pricing"
                                                aria-current="page"
                                                className="footer_link w--current"
                                            >
                                                Pricing
                                            </a>
                                            <a href="/blog" className="footer_link">
                                                Blog
                                            </a>
                                            <a href="/login" className="footer_link">
                                                Login
                                            </a>
                                        </div>
                                    </div>
                                    <div className="footer_link-list">
                                        <div className="margin-bottom margin-xxsmall">
                                            <div className="heading-style-h6">Resources</div>
                                        </div>
                                        <div className="footer-link_column is-resources">
                                            <a href="/resources" className="footer_link">
                                                Guides
                                            </a>
                                            <a
                                                href="https://blog.langchain.com"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                Blog
                                            </a>
                                            <a href="/customers" className="footer_link">
                                                Customer Stories
                                            </a>
                                            <a
                                                href="#"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                Kandra Academy
                                            </a>
                                            <a href="/join-community" className="footer_link">
                                                Community
                                            </a>
                                            <a
                                                href="#"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                Events
                                            </a>
                                            <a
                                                href="https://changelog.langchain.com/"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                Changelog
                                            </a>
                                            <a
                                                href="http://docs.langchain.com/"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                Docs
                                            </a>
                                            <a
                                                href="/support"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                Support
                                            </a>
                                        </div>
                                    </div>
                                    <div className="footer_link-list">
                                        <div className="margin-bottom margin-xxsmall">
                                            <div className="heading-style-h6">Company</div>
                                        </div>
                                        <div className="footer-link_column">
                                            <a href="/about" className="footer_link">
                                                About
                                            </a>
                                            <a href="/careers" className="footer_link">
                                                Careers
                                            </a>
                                            <a
                                                href="https://twitter.com/Kandra"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                X
                                            </a>
                                            <a
                                                href="https://www.linkedin.com/company/kandra/"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                LinkedIn
                                            </a>
                                            <a
                                                href="https://www.youtube.com/@Kandra"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                YouTube
                                            </a>
                                            <a
                                                href="https://drive.google.com/drive/folders/17xybjzmVBdsQA-VxouuGLxF6bDsHDe80?usp=sharing"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                Marketing Assets
                                            </a>
                                            <a
                                                href="#"
                                                target="_blank"
                                                className="footer_link"
                                            >
                                                Security
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="w-node-ed59fd8f-4548-9b12-643e-b1816711f5ee-6711f5b5"
                                    className="footer_right-wrapper"
                                >
                                    <div className="margin-bottom margin-xsmall">
                                        <div className="footer__form-title">
                                            <div className="footer-circle" />
                                            <div className="max-width-300-mobile">
                                                <div className="heading-style-h6">
                                                    Sign up for our newsletter to stay up to date
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="footer_form-block w-form">
                                        <form
                                            id="wf-form-footer_form"
                                            name="wf-form-footer_form"
                                            data-name="footer_form"
                                            action="https://langchain.us11.list-manage.com/subscribe/post?u=4ad47fb6a8889d6654064ff1b&amp;id=6bc1ef8ac4&amp;f_id=0072b7e0f0"
                                            method="post"
                                            data-webflow-hubspot-api-form-url="https://hubspotonwebflow.com/api/forms/175bb662-7202-4470-b7b0-85c3e4bf7321"
                                            className="footer_form"
                                            data-wf-page-id="68e6349d06062d03e2060821"
                                            data-wf-element-id="ed59fd8f-4548-9b12-643e-b1816711f5f5"
                                        >
                                            <input
                                                className="form_input w-input"
                                                data-wfhsfieldname="FormTextInput-2"
                                                maxLength={256}
                                                name="EMAIL"
                                                data-name="EMAIL"
                                                placeholder="your email..."
                                                type="email"
                                                id="EMAIL"
                                                required
                                            />
                                            <input
                                                type="submit"
                                                data-wait="Please wait..."
                                                aria-label="Subscribe"
                                                className="news_button w-button"
                                                defaultValue=""
                                            />
                                            <input type="hidden" name="hutk" defaultValue="" />
                                            <input type="hidden" name="ipAddress" defaultValue="" />
                                            <input type="hidden" name="pageUri" defaultValue="" />
                                            <input type="hidden" name="pageId" defaultValue="" />
                                            <input type="hidden" name="pageName" defaultValue="" />
                                        </form>
                                        <div className="form_success is-footer w-form-done">
                                            <div>Thank you! Your submission has been received!</div>
                                        </div>
                                        <div className="form_error is-news w-form-fail">
                                            <div>
                                                Oops! Something went wrong while submitting the form.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <img
                            src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c6a38f9c53ec71f5fc73de_langchain-word.svg"
                            loading="lazy"
                            alt=""
                            className="footer_logo"
                        />
                    </div>
                    <div className="padding-global is-bottom-footer">
                        <div className="footer_bottom-component">
                            <div className="padding-vertical">
                                <div className="footer_bottom">
                                    <a
                                        href="#"
                                        target="_blank"
                                        className="footer_link is-status w-inline-block"
                                    >
                                        <div className="status-dot" />
                                        <div>
                                            All systems <span className="system-status">operational</span>
                                        </div>
                                    </a>
                                    <div className="privacy-group">
                                        <a href="/privacy-policy" className="footer_link">
                                            Privacy Policy
                                        </a>
                                        <a href="/terms-of-service" className="footer_link">
                                            Terms of Service
                                        </a>
                                    </div>
                                    <div className="hide w-embed w-script"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
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
