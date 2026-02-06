const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve('/Users/seun/gem/landing2.html');
const outPath = path.resolve('/Users/seun/gem/kandra/frontend-v2/src/app/page.tsx');

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(htmlContent);

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function parseStyle(styleStr) {
  const styles = {};
  if (!styleStr) return styles;
  styleStr.split(';').forEach(part => {
    const [key, val] = part.split(':').map(s => s.trim());
    if (key && val) {
      styles[toCamelCase(key)] = val;
    }
  });
  return styles;
}

function processNode(node) {
  if (node.type === 'text') {
    return node.data;
  }
  if (node.type === 'comment') {
    return `{/* ${node.data} */}`;
  }
  if (node.type !== 'tag' && node.type !== 'style' && node.type !== 'script') {
    return '';
  }

  const tagName = node.name;
  const attribs = node.attribs || {};
  const props = [];

  // Style handling
  if (attribs.style) {
    const styleObj = parseStyle(attribs.style);
    props.push(`style={{${Object.entries(styleObj).map(([k, v]) => `${k}: '${v}'`).join(', ')}}}`);
    delete attribs.style;
  }

  // Attribute mapping
  const attrMap = {
    'class': 'className',
    'for': 'htmlFor',
    'autoplay': 'autoPlay',
    'playsinline': 'playsInline',
    'frameborder': 'frameBorder',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'srcset': 'srcSet',
    'datetime': 'dateTime',
    'crossorigin': 'crossOrigin',
    'tabindex': 'tabIndex',
    'readonly': 'readOnly',
    'maxlength': 'maxLength',
    'autocomplete': 'autoComplete',
    'colspan': 'colSpan',
    'rowspan': 'rowSpan',
    'cellpadding': 'cellPadding',
    'cellspacing': 'cellSpacing',
    'usemap': 'useMap',
    'enctype': 'encType'
  };

  Object.keys(attribs).forEach(key => {
    let val = attribs[key];
    let newKey = attrMap[key] || key;
    
    // SVG specific attributes often have hyphens, React uses camelCase mostly
    // But data-* and aria-* are fine with hyphens
    if (newKey.includes('-') && !newKey.startsWith('data-') && !newKey.startsWith('aria-')) {
        // newKey = toCamelCase(newKey); // Maybe dangerous for custom elements- keeping simpler map for now
    }

    if (val === '') {
        // Boolean attributes? or empty string?
        // In XML/HTML5 val="" is empty string.
        props.push(`${newKey}=""`); 
    } else {
        props.push(`${newKey}="${val.replace(/"/g, '&quot;')}"`);
    }
  });

  const propStr = props.length > 0 ? ' ' + props.join(' ') : '';
  
  // Children
  let children = '';
  if (node.children) {
    node.children.forEach(child => {
      children += processNode(child);
    });
  }

  // Self closing
  if (['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tagName) && !children) {
    return `<${tagName}${propStr} />`;
  }
  
  return `<${tagName}${propStr}>${children}</${tagName}>`;
}

// Extract body contents
// Cheerio's $('body') gives us the body element wrapper. We want its children.
const bodyChildren = $('body').contents();

let jsxContent = '';
bodyChildren.each((i, el) => {
  jsxContent += processNode(el);
});

const tsxContent = `
'use client';

import React, { useEffect } from 'react';
import Image from "next/image";
import Link from "next/link"; 

export default function LandingPage() {
  
  useEffect(() => {
     // Re-run the critical inline script for classes
     !function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);
  }, []);

  return (
    <>
      ${jsxContent}
    </>
  );
}
`;

fs.writeFileSync(outPath, tsxContent);
console.log('Done');
