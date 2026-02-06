
'use client';

import React, { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

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
              <div className="navbar_logo-svg text-color-green-400 w-embed">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 247 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_7294_4948)">
                    <path
                      d="M92.6699 8.20048V31.7591H108.898V28.202H96.3545V8.20048H92.6699Z"
                      fill="currentColor"
                    />
                    <path
                      d="M175.109 8.20048C171.919 8.20048 169.212 9.35044 167.28 11.5276C165.366 13.6845 164.355 16.7117 164.355 20.2813C164.355 27.6208 168.59 32.3636 175.142 32.3636C179.759 32.3636 183.333 29.9487 184.705 25.9052L185.038 24.9246L181.381 23.5353L181.044 24.6278C180.226 27.2712 178.13 28.7273 175.14 28.7273C170.87 28.7273 168.217 25.4918 168.217 20.2828C168.217 15.0738 170.895 11.8384 175.205 11.8384C178.194 11.8384 179.916 13.0101 180.792 15.6364L181.174 16.7817L184.735 15.1111L184.408 14.1943C183.016 10.2751 179.801 8.20203 175.108 8.20203L175.109 8.20048Z"
                      fill="currentColor"
                    />
                    <path
                      d="M117.55 13.7918C114.013 13.7918 111.368 15.4499 110.294 18.3403C110.226 18.5253 110.019 19.0831 110.019 19.0831L113.051 21.0443L113.463 19.9705C114.165 18.1399 115.464 17.2867 117.55 17.2867C119.635 17.2867 120.829 18.2984 120.807 20.2906C120.807 20.3714 120.801 20.6154 120.801 20.6154C120.801 20.6154 118.041 21.0629 116.903 21.3038C112.05 22.3294 110.018 24.1818 110.018 27.2121C110.018 28.8267 110.914 30.575 112.551 31.5555C113.533 32.143 114.815 32.3652 116.23 32.3652C117.161 32.3652 118.066 32.2269 118.903 31.972C120.807 31.3395 121.338 30.0963 121.338 30.0963V31.7218H124.492V20.101C124.492 16.1507 121.896 13.7918 117.55 13.7918ZM120.818 26.1927C120.818 27.4141 119.488 29.1344 116.389 29.1344C115.514 29.1344 114.894 28.9029 114.481 28.5579C113.927 28.0963 113.746 27.4328 113.822 26.8469C113.854 26.5921 114.008 26.0435 114.579 25.568C115.161 25.0816 116.192 24.7335 117.783 24.3869C119.091 24.1026 120.819 23.7887 120.819 23.7887V26.1942L120.818 26.1927Z"
                      fill="currentColor"
                    />
                    <path
                      d="M136.147 13.7902C135.709 13.7902 135.282 13.8213 134.867 13.8788C132.043 14.303 131.216 15.7374 131.216 15.7374L131.219 14.2906H127.686V31.7249H131.37V22.0622C131.37 18.7786 133.765 17.2836 135.99 17.2836C138.396 17.2836 139.564 18.5765 139.564 21.2385V31.7249H143.249V20.7319C143.249 16.4491 140.528 13.7902 136.149 13.7902H136.147Z"
                      fill="currentColor"
                    />
                    <path
                      d="M239.18 13.7902C238.742 13.7902 238.315 13.8213 237.9 13.8788C235.076 14.303 234.249 15.7374 234.249 15.7374V14.289H230.719V31.7249H234.403V22.0622C234.403 18.7786 236.798 17.2836 239.023 17.2836C241.429 17.2836 242.598 18.5765 242.598 21.2385V31.7249H246.282V20.7319C246.282 16.4491 243.561 13.7902 239.182 13.7902H239.18Z"
                      fill="currentColor"
                    />
                    <path
                      d="M158.625 14.2906V16.0855C158.625 16.0855 157.723 13.7902 153.615 13.7902C148.512 13.7902 145.342 17.3116 145.342 22.9821C145.342 26.1818 146.364 28.7008 148.169 30.2921C149.572 31.5291 151.446 32.1632 153.677 32.2067C155.23 32.2362 156.235 31.8135 156.863 31.4141C158.069 30.6465 158.517 29.9176 158.517 29.9176C158.517 29.9176 158.465 30.4879 158.372 31.2603C158.305 31.8197 158.179 32.2129 158.179 32.2129C157.618 34.2098 155.977 35.3644 153.584 35.3644C151.191 35.3644 149.741 34.5765 149.454 33.0241L145.872 34.0932C146.49 37.0769 149.291 38.8578 153.362 38.8578C156.13 38.8578 158.299 38.1057 159.811 36.62C161.336 35.122 162.109 32.9635 162.109 30.2036V14.289H158.625V14.2906ZM158.392 23.1406C158.392 26.6278 156.689 28.7102 153.836 28.7102C150.779 28.7102 149.026 26.6216 149.026 22.9821C149.026 19.3427 150.779 17.2852 153.836 17.2852C156.621 17.2852 158.366 19.3582 158.392 22.6962V23.1406Z"
                      fill="currentColor"
                    />
                    <path
                      d="M195.651 13.7902C195.247 13.7902 194.854 13.8166 194.471 13.8664C191.693 14.2999 190.876 15.7156 190.876 15.7156V15.3007H190.874V8.20048H187.189V31.7265H190.874V22.0637C190.874 18.7584 193.269 17.2541 195.494 17.2541C197.9 17.2541 199.068 18.547 199.068 21.209V31.7265H202.753V20.7024C202.753 16.5051 199.965 13.7918 195.653 13.7918L195.651 13.7902Z"
                      fill="currentColor"
                    />
                    <path
                      d="M225.474 12.9821C226.794 12.9821 227.863 11.9128 227.863 10.5936C227.863 9.27451 226.794 8.20514 225.474 8.20514C224.155 8.20514 223.086 9.27451 223.086 10.5936C223.086 11.9128 224.155 12.9821 225.474 12.9821Z"
                      fill="currentColor"
                    />
                    <path
                      d="M223.643 14.2813V23.1298C222.594 22.2657 221.375 21.6146 219.992 21.2246V20.101C219.992 16.1507 217.396 13.7918 213.05 13.7918C209.513 13.7918 206.868 15.4499 205.794 18.3403C205.726 18.5253 205.519 19.0831 205.519 19.0831L208.551 21.0443L208.963 19.9705C209.665 18.1399 210.964 17.2867 213.05 17.2867C215.135 17.2867 216.329 18.2984 216.307 20.2906C216.307 20.303 216.307 20.4693 216.307 20.735C214.747 20.6915 213.295 20.8423 211.992 21.1484C210.273 21.5369 207.081 22.5237 205.94 25.0893C205.932 25.1064 205.765 25.5493 205.765 25.5493C205.6 26.059 205.518 26.6123 205.518 27.2121C205.518 28.8267 206.414 30.575 208.051 31.5555C209.033 32.143 210.315 32.3652 211.73 32.3652C212.644 32.3652 213.533 32.2315 214.358 31.986C216.299 31.3582 216.838 30.0963 216.838 30.0963V31.7234H219.992V26.3978C219.106 25.8446 217.776 25.5183 216.316 25.5214C216.316 25.9332 216.316 26.1942 216.316 26.1942C216.316 27.4157 214.986 29.136 211.887 29.136C211.013 29.136 210.392 28.9044 209.979 28.5594C209.426 28.0979 209.244 27.4343 209.32 26.8485C209.353 26.5936 209.507 26.0451 210.077 25.5695L210.071 25.5524C211.379 24.4817 213.951 24.0544 216.313 24.1476V24.1523C218.324 24.2253 219.828 24.62 220.902 25.3597C221.194 25.5447 221.469 25.7514 221.723 25.9782C222.801 26.9464 223.235 28.1383 223.421 28.8345C223.724 29.9705 223.643 31.7203 223.643 31.7203H227.309V14.2844H223.643V14.2813Z"
                      fill="currentColor"
                    />
                    <path
                      d="M61.153 12.2611C62.6542 13.7622 62.6542 16.2051 61.153 17.7063L57.7901 21.0148L57.756 20.8252C57.5104 19.4654 56.864 18.2315 55.8881 17.2556C55.153 16.5221 54.2843 15.9798 53.3053 15.6441C52.6977 16.2549 52.3636 17.0552 52.3636 17.8974C52.3636 18.0684 52.3791 18.2455 52.4102 18.4227C52.9494 18.6169 53.4265 18.9169 53.8274 19.3178C55.3286 20.819 55.3286 23.2618 53.8274 24.763L50.8997 27.6907C50.1491 28.4413 49.1639 28.8158 48.1771 28.8158C47.1903 28.8158 46.2051 28.4413 45.4545 27.6907C43.9533 26.1896 43.9533 23.7467 45.4545 22.2455L48.8174 18.9386L48.8515 19.1282C49.0955 20.4848 49.742 21.7187 50.721 22.6962C51.4576 23.4328 52.2735 23.9223 53.2509 24.2564L53.4312 24.0761C53.9782 23.5291 54.2781 22.8019 54.2781 22.0264C54.2781 21.8539 54.2626 21.6814 54.233 21.512C53.6689 21.3256 53.2043 21.0598 52.7816 20.6371C52.1724 20.028 51.7933 19.2494 51.6876 18.3869C51.6798 18.3248 51.6752 18.2642 51.6689 18.202C51.585 17.0785 51.9906 15.9814 52.7816 15.1919L55.7093 12.2642C56.4351 11.5385 57.4016 11.1375 58.432 11.1375C59.4623 11.1375 60.4288 11.5369 61.1546 12.2642L61.153 12.2611ZM76.4413 20C76.4413 30.7117 67.7264 39.425 57.0163 39.425H19.425C8.71483 39.425 0 30.7117 0 20C0 9.28828 8.71483 0.575001 19.425 0.575001H57.0163C67.728 0.575001 76.4413 9.28983 76.4413 20ZM37.4359 29.742C37.742 29.3706 36.3279 28.3248 36.0388 27.9409C35.4514 27.3038 35.4483 26.3869 35.052 25.6426C34.0823 23.3955 32.9681 21.1655 31.4094 19.2634C29.7622 17.1826 27.7296 15.4608 25.944 13.5074C24.6185 12.1445 24.2642 10.2036 23.094 8.73816C21.4809 6.35588 16.3807 5.70631 15.6332 9.07072C15.6363 9.17639 15.6037 9.24321 15.512 9.31003C15.0987 9.60996 14.7304 9.95339 14.4211 10.3683C13.6643 11.4219 13.5478 13.209 14.4926 14.1554C14.5237 13.6566 14.5408 13.1857 14.9355 12.8283C15.6659 13.4546 16.7692 13.6768 17.6161 13.209C19.4872 15.8803 19.021 19.5758 20.5066 22.4538C20.9168 23.1344 21.3302 23.8291 21.857 24.4258C22.2844 25.0909 23.7607 25.8757 23.8477 26.4911C23.8632 27.5478 23.7389 28.7024 24.432 29.5866C24.7583 30.2486 23.9565 30.9137 23.31 30.8314C22.4708 30.9464 21.4468 30.2673 20.7117 30.6853C20.4522 30.9666 19.944 30.6558 19.7203 31.0458C19.6426 31.2479 19.223 31.5322 19.4732 31.7265C19.7513 31.5151 20.0093 31.2945 20.3838 31.4203C20.3279 31.7249 20.5687 31.7684 20.7599 31.857C20.7537 32.0637 20.6325 32.275 20.791 32.4506C20.9759 32.2642 21.0862 32 21.3799 31.9223C22.3558 33.223 23.3488 30.6061 25.4607 31.784C25.0318 31.7622 24.6511 31.8166 24.3621 32.1694C24.2906 32.2486 24.23 32.3419 24.3558 32.4444C25.4949 31.7094 25.4887 32.6962 26.2284 32.3931C26.7972 32.0963 27.3628 31.7249 28.0388 31.8306C27.3815 32.0202 27.3551 32.5485 26.9697 32.9945C26.9044 33.0629 26.8733 33.1406 26.9495 33.2541C28.3139 33.1391 28.4258 32.6853 29.5276 32.129C30.3496 31.627 31.1686 32.8438 31.8803 32.1507C32.0373 32 32.2517 32.0513 32.446 32.0311C32.1973 30.7055 29.4638 32.2735 29.5074 30.4957C30.3869 29.8974 30.1849 28.7521 30.2439 27.8275C31.2556 28.3885 32.3807 28.7148 33.3721 29.251C33.8725 30.059 34.6573 31.1266 35.7031 31.0567C35.7311 30.9759 35.756 30.9044 35.7855 30.8221C36.1025 30.8764 36.5097 31.0862 36.6837 30.6853C37.1577 31.181 37.8539 31.1562 38.4739 31.0287C38.9324 30.6558 37.6115 30.1243 37.4343 29.7405L37.4359 29.742ZM65.1919 14.9837C65.1919 13.1748 64.4894 11.4763 63.2136 10.2005C61.9378 8.92464 60.2393 8.22223 58.4288 8.22223C56.6184 8.22223 54.9199 8.92464 53.6441 10.2005L50.7163 13.1282C50.0326 13.812 49.5135 14.6154 49.1732 15.5152L49.153 15.5664L49.1002 15.582C48.0372 15.9099 47.1002 16.4724 46.3154 17.2572L43.3877 20.1849C40.7505 22.8236 40.7505 27.1158 43.3877 29.7529C44.6635 31.0287 46.362 31.7311 48.1709 31.7311C49.9797 31.7311 51.6798 31.0287 52.9557 29.7529L55.8834 26.8252C56.564 26.1445 57.08 25.3442 57.4203 24.446L57.4405 24.3947L57.4933 24.3776C58.5376 24.0575 59.5011 23.4763 60.2828 22.6962L63.2105 19.7685C64.4863 18.4926 65.1887 16.7941 65.1887 14.9837H65.1919ZM26.7879 27.5524C26.5361 28.5346 26.4537 30.2082 25.1764 30.2564C25.0707 30.8236 25.5695 31.0365 26.0217 30.8547C26.4708 30.648 26.6837 31.0179 26.8345 31.3862C27.5276 31.4872 28.5532 31.1546 28.592 30.3341C27.5571 29.7374 27.237 28.6029 26.7863 27.5524H26.7879Z"
                      fill="currentColor"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7294_4948">
                      <rect
                        width="246.279"
                        height="38.85"
                        fill="white"
                        transform="translate(0 0.575001)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </a>
            <nav
              role="navigation"
              className="navbar_menu is-page-height-tablet nav-menu nav-menu-2 nav-menu-3 nav-menu-4 w-nav-menu"
            >
              <div className="navbar_navlinks is-new">
                <div
                  data-hover="true"
                  data-delay={800}
                  data-w-id="7ab9fcb3-a2aa-7d57-c073-6ba0854e8220"
                  className="navbar_menu-dropdown is-products w-dropdown"
                >
                  <div className="navbar_dropdown-toggle is-new w-dropdown-toggle">
                    <div className="text-size-body3 text-size-body3-alt">
                      Products
                    </div>
                    <div className="dropdown-chevron is-new w-embed">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 15 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.920898 1L7.4209 7.5L13.9209 1"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    </div>
                  </div>
                  <nav className="navbar_dropdown-list is-product w-dropdown-list">
                    <div className="navbar_dropdown-link-list is-product-new">
                      <div className="navbar-product-2col">
                        <div className="navbar-product-wrapper no-bg">
                          <div className="text-size-body3 text-weight-medium text-style-nowrap text-size-option">
                            LangSmith
                          </div>
                          <div className="product-divider" />
                          <div className="product-items">
                            <a
                              href="/langsmith/observability"
                              aria-current="page"
                              className="navbar-product-item w-inline-block w--current"
                            >
                              <div className="navbar-product-icon-wrapper">
                                <img
                                  src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68e8e270df09334914882b88_Frame%209.svg"
                                  loading="lazy"
                                  alt=""
                                  className="navbar-product-icon is-eye"
                                />
                              </div>
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  Observability
                                </div>
                                <div className="text-size-body4 text-color-green-400 violet-mobile text-copy-small">
                                  Debug and monitor in-depth traces
                                </div>
                              </div>
                            </a>
                            <a
                              href="/langsmith/evaluation"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-icon-wrapper">
                                <img
                                  src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68e8e270f9e8de1d368764a8_Frame%20206.svg"
                                  loading="lazy"
                                  alt=""
                                  className="navbar-product-icon is-evaluation"
                                />
                              </div>
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  Evaluation
                                </div>
                                <div className="text-size-body4 text-color-green-400 violet-mobile text-copy-small">
                                  Iterate on prompts and models
                                </div>
                              </div>
                            </a>
                            <a
                              href="/langsmith/deployment"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-icon-wrapper">
                                <img
                                  src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68e8e2709eef27fc61465416_Frame%20100039.svg"
                                  loading="lazy"
                                  alt=""
                                  className="navbar-product-icon is-deployment"
                                />
                              </div>
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  Deployment
                                </div>
                                <div className="text-size-body4 text-color-green-400 violet-mobile text-copy-small">
                                  Ship and scale agents in production
                                </div>
                              </div>
                            </a>
                            <a
                              href="/langsmith/agent-builder"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-icon-wrapper">
                                <img
                                  src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/692e7522b3ef627cb0ec1155_Centralized%20management.svg"
                                  loading="lazy"
                                  alt=""
                                  className="navbar-product-icon is-deployment"
                                />
                              </div>
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Agent Builder
                                  </div>
                                  <div className="navbar-tag">New</div>
                                </div>
                                <div className="text-size-body4 text-color-green-400 violet-mobile text-copy-small">
                                  Build no-code agents
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div className="navbar-product-wrapper no-bg">
                          <div className="text-size-body3 text-weight-medium text-style-nowrap text-size-option">
                            Open Source Frameworks
                          </div>
                          <div className="product-divider" />
                          <div className="product-items">
                            <a
                              href="/langchain"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-icon-wrapper">
                                <img
                                  src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68e8e27023585643370a6471_icons.svg"
                                  loading="lazy"
                                  alt=""
                                  className="navbar-product-icon is-lg"
                                />
                              </div>
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  LangChain
                                </div>
                                <div className="text-size-body4 text-color-green-400 violet-mobile text-copy-small">
                                  Quick start agents with any model provider
                                </div>
                              </div>
                            </a>
                            <a
                              href="/langgraph"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-icon-wrapper">
                                <img
                                  src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68e8e270417338c7f027082d_d035ce400e48f9bc4dd0578d0e3e3211_icons-1.svg"
                                  loading="lazy"
                                  alt=""
                                  className="navbar-product-icon is-lg"
                                />
                              </div>
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  LangGraph
                                </div>
                                <div className="text-size-body4 text-color-green-400 violet-mobile text-copy-small">
                                  Build custom agents with low-level control
                                </div>
                              </div>
                            </a>
                            <a
                              href="https://docs.langchain.com/oss/python/deepagents/overview#deep-agents-overview"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-icon-wrapper">
                                <img
                                  src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68f20863b71dbae1af829979_DeepAgents.svg"
                                  loading="lazy"
                                  alt=""
                                  className="navbar-product-icon is-deepagents"
                                />
                              </div>
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Deep Agents
                                  </div>
                                  <div className="navbar-tag">New</div>
                                </div>
                                <div className="text-size-body4 text-color-green-400 violet-mobile text-copy-small">
                                  Use planning, memory, and sub-agents for complex,
                                  long-running tasks
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
                <div
                  data-hover="true"
                  data-delay={800}
                  data-w-id="312e5433-13df-91f9-e086-a625d3febfe0"
                  className="navbar_menu-dropdown is-products w-dropdown"
                >
                  <div className="navbar_dropdown-toggle is-new w-dropdown-toggle">
                    <div className="text-size-body3 text-size-body3-alt">Learn</div>
                    <div className="dropdown-chevron is-new w-embed">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 15 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.920898 1L7.4209 7.5L13.9209 1"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    </div>
                  </div>
                  <nav className="navbar_dropdown-list is-product w-dropdown-list">
                    <div className="navbar_dropdown-link-list is-product-new">
                      <div className="navbar-product-3col">
                        <div className="navbar-product-wrapper no-bg">
                          <div className="text-size-body3 text-weight-medium text-style-nowrap text-size-option">
                            Resources
                          </div>
                          <div className="product-divider" />
                          <div className="product-items">
                            <a
                              href="https://blog.langchain.com/"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  Blog
                                </div>
                              </div>
                            </a>
                            <a
                              href="/state-of-agent-engineering"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  2026 State of Agent Engineering
                                </div>
                              </div>
                            </a>
                            <a
                              href="/customers"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Customer Stories
                                  </div>
                                </div>
                              </div>
                            </a>
                            <a
                              href="/resources"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Guides
                                  </div>
                                </div>
                              </div>
                            </a>
                            <a
                              href="https://changelog.langchain.com/"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Changelog
                                  </div>
                                </div>
                              </div>
                            </a>
                            <a
                              href="https://trust.langchain.com/"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Trust Center
                                  </div>
                                </div>
                              </div>
                            </a>
                            <a
                              href="http://support.langchain.com/"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Support
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div className="navbar-product-wrapper no-bg">
                          <div className="text-size-body3 text-weight-medium text-style-nowrap text-size-option">
                            How-To
                          </div>
                          <div className="product-divider" />
                          <div className="product-items">
                            <a
                              href="https://academy.langchain.com/"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  LangChain Academy
                                </div>
                              </div>
                            </a>
                            <a
                              href="https://www.youtube.com/@LangChain"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  YouTube
                                </div>
                              </div>
                            </a>
                            <a
                              href="https://docs.langchain.com/"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Documentation
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                        <div className="navbar-product-wrapper no-bg">
                          <div className="text-size-body3 text-weight-medium text-style-nowrap text-size-option">
                            Community
                          </div>
                          <div className="product-divider" />
                          <div className="product-items">
                            <a
                              href="https://luma.com/langchain?k=c"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  Events
                                </div>
                              </div>
                            </a>
                            <a
                              href="/community"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  Community
                                </div>
                              </div>
                            </a>
                            <a
                              href="https://forum.langchain.com/"
                              target="_blank"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                  Community Forum
                                </div>
                              </div>
                            </a>
                            <a
                              href="/join-community"
                              className="navbar-product-item w-inline-block"
                            >
                              <div className="navbar-product-text">
                                <div className="navbar-tag-wrapper">
                                  <div className="text-size-body4 text-weight-semibold different-size-mobile text-copy">
                                    Slack
                                  </div>
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </nav>
                </div>
                <a
                  href="https://docs.langchain.com/"
                  className="navbar_link is-pricing menu is-new navbar-link-body3"
                >
                  Docs
                </a>
                <div
                  data-hover="true"
                  data-delay={200}
                  data-w-id="7ab9fcb3-a2aa-7d57-c073-6ba0854e82b3"
                  className="navbar_menu-dropdown w-dropdown"
                >
                  <div className="navbar_dropdown-toggle is-new w-dropdown-toggle">
                    <div className="text-size-body3 text-size-body3-alt">
                      Company
                    </div>
                    <div className="dropdown-chevron is-new w-embed">
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 15 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.920898 1L7.4209 7.5L13.9209 1"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    </div>
                  </div>
                  <nav className="navbar_dropdown-list w-dropdown-list">
                    <div className="navbar_dropdown-link-list is-new">
                      <div
                        id="w-node-_7ab9fcb3-a2aa-7d57-c073-6ba0854e82ba-62764940"
                        className="dropdown_links-wrap is-new"
                      >
                        <a
                          id="w-node-_7ab9fcb3-a2aa-7d57-c073-6ba0854e82bb-62764940"
                          href="/about"
                          className="navbar_navlink navbar-navlink-text"
                        >
                          About
                        </a>
                        <a
                          id="w-node-_7ab9fcb3-a2aa-7d57-c073-6ba0854e82bd-62764940"
                          href="/careers"
                          className="navbar_navlink navbar-navlink-text"
                        >
                          Careers
                        </a>
                        <link rel="prefetch" href="/careers" />
                        <a
                          href="/langchain-partner-network"
                          className="navbar_navlink navbar-navlink-text"
                        >
                          Partners
                        </a>
                        <link rel="prefetch" href="/langchain-partner-network" />
                      </div>
                    </div>
                  </nav>
                </div>
                <a
                  href="/pricing"
                  className="navbar_link is-pricing menu is-new navbar-link-body3"
                >
                  Pricing
                </a>
              </div>
              <div className="navbar_menu-buttons">
                <a
                  href="/contact-sales"
                  className="button is-nav-copy is-smaller w-button"
                >
                  Get a demo
                </a>
              </div>
              <div className="navbar_menu-buttons">
                <a
                  href="/connect"
                  target="_blank"
                  className="button is-nav is-smaller w-button"
                >
                  Try Kandra
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
          </div>
          <div className="navbar_menu-bg" />
          <div className="navbar_scroll-bg" />
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
                      <img
                        src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68e636c5bea6818d0b5f1032_Frame%2026.svg"
                        loading="lazy"
                        alt=""
                        className="ls-hero-label-icon"
                      />
                      <div className="text-size-body1">
                        <strong className="text-weight-medium">Kandra</strong>{" "}
                        Automated Migration
                      </div>
                    </div>
                    <div className="spacer-32 _24-mobile" />
                    <h1 className="h1-smaller">
                      Stop rewriting code by hand.
                    </h1>
                    <div className="spacer-32 _16-mobile" />
                    <p className="text-size-body1">
                      Paste your repo. Pick your target stack. Get a PR with working code, tests, and zero copy-paste headaches.
                    </p>
                    <div className="spacer-64 _32-mobile" />
                    <div className="join-us_buttons-wrapper-ls">
                      <a
                        href="/connect"
                        className="button w-button"
                      >
                        Try It Free
                      </a>
                      <a
                        href="/contact-sales"
                        className="button is-secondary w-button"
                      >
                        See It Work
                      </a>
                    </div>
                  </div>
                  <div
                    id="w-node-_13281a38-0a87-af56-f7b1-400bf7a8fe8b-e2060821"
                    className="ls-hero-image-wrapper"
                  >
                    <img
                      src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/68f2d0495b5525b6c8249257_LS-obs-header.png"
                      loading="lazy"
                      alt=""
                      className="ls-hero-img"
                    />
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
