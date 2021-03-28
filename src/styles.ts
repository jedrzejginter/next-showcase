import { darkBg, lightBg } from './svg';

export const styles = `
  .showcase {
    all:unset;
    box-sizing: border-box;
    font-family: 'Overpass';
    font-size: 16px;
    font-style: normal;
    font-weight: unset;
  }

  #showcase-wrapper {
    align-items: flex-start;
    display: flex;
  }

  #showcase-nav {
    border-right: 1px solid #ccc;
    color: unset;
    display: block;
    flex-shrink: 0;
    height: 100vh;
    overflow-y: auto;
    padding: 10px;
    width: 300px;
  }

  .showcase-navitem {
    cursor: pointer;
    width: 100%;
  }

  .showcase-navitem + .showcase-navitem {
    margin-top: 10px;
  }

  .showcase-item-button {
    border-radius: 2px;
    cursor: pointer;
    font-weight: 600;
    outline: none;
    padding: 0 10px;
    text-align: left;
    width: 100%;
  }

  .showcase-item-button:focus,
  .showcase-item-button:hover {
    background-color: #bbb;
  }

  .showcase-item-button__current {
    background-color: #ddd;
  }

  #showcase-toolbar {
    align-items: stretch;
    border-bottom: 1px solid #ccc;
    display: flex;
    min-height: 50px;
  }

  .showcase-toolbar-box {
    align-items: center;
    display: flex;
    padding: 10px;
  }

  .showcase-toolbar-box > *:not(:last-child) {
    margin-right: 10px;
  }

  .showcase-toolbar-box + .showcase-toolbar-box {
    border-left: 1px solid #ccc;
  }

  #showcase-rendering {
    flex-grow: 1;
  }

  .showcase-wrapping-outer-box {
    background-size: 20px;
    line-height: unset;
    min-height: calc(100vh - 50px);
    padding: 10px;
  }

  <ROOT><HAS-ZOOM> .showcase-wrapping-outer-box {
    background-size: 40px;
    padding: 20px;
  }

  <ROOT><HAS-BG> .showcase-wrapping-outer-box {
    background-image: url(<LIGHT-BACKGROUND>);
  }

  <ROOT><HAS-BG><IS-DARK> .showcase-wrapping-outer-box {
    background-image: url(<DARK-BACKGROUND>);
  }

  #showcase-shadow-box {
    display: inline-block;
  }

  <ROOT><HAS-ZOOM> #showcase-shadow-box {
    transform: scale(2);
    transform-origin: left top;
  }

  .showcase-bounding-shadow {
    box-shadow: 0 0 5px black;
    line-height: unset;
  }

  .showcase-checkbox-span {
    margin-left: 4px;
    cursor: pointer;
  }

  .showcase-checkbox-span:hover {
    text-decoration: underline;
  }

  #showcase-variants-nav {
    border-bottom: 1px dashed #ccc;
    border-left: 1px dashed #ccc;
    display: flex;
    flex-direction: column;
    margin: 0 5px;
    padding: 2px;
  }

  .showcase-variant-button {
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    text-align: left;
  }

  .showcase-variant-button + .showcase-variant-button {
    margin-top: 2px;
  }

  .showcase-variant-button__current {
    background-color: #eee;
  }

  .showcase-variant-button:focus {
    background-color: #ddd;
    outline: none;
  }

  #showcase-toolbar-slot:empty {
    display: none;
  }

  #showcase-toolbar-slot > *:not(:last-child) {
    margin-right: 10px;
  }

  .showcase-select-wrapper {
    position: relative;
  }

  .showcase-select-label {
    bottom: 100%;
    color: #aaa;
    font-size: 9px;
    left: 0;
    line-height: 9px;
    position: absolute;
  }

  .showcase-select {
    -webkit-appearance: menulist;
    appearance: menulist;
    border: 1px solid #ccc;
    border-radius: 2px;
  }

  .showcase-button {
    -webkit-appearance: button;
    appearance: button;
    border: 1px solid #ccc;
    border-radius: 2px;
    font-family: inherit;
    padding: 0 10px;
  }

  .showcase-button:disabled {
    color: #ddd;
  }

  .showcase-button:hover:not(:disabled) {
    background: #eee;
  }

  #showcase-summary {
    border-bottom: 1px solid #ccc;
    display: block;
    padding: 10px;
  }

  #showcase-summary > * + * {
    margin-top: 10px;
  }

  #showcase-summary:empty {
    display: none;
  }

  #showcase-summary-title {
    font-family: 'Overpass';
    font-size: 32px;
    font-weight: 700;
  }

  #showcase-summary-description {
    font-family: 'Overpass';
    font-size: 20px;
  }
`
  // Now, make sure every CSS rule is marked as important.
  // This is a dirty hack, but the only way to make sure
  // that no global stylesheet will overwrite our styles.
  .replace(/;/g, ' !important;')
  // Minify the output CSS.
  .replace(/(\n\s{2,})/g, '')
  // Fill selectors placeholders.
  .replace(/<ROOT>/g, '#__next-showcase-root')
  .replace(/<HAS-BG>/g, '[data-has-background="true"]')
  .replace(/<HAS-ZOOM>/g, '[data-has-zoom="true"]')
  .replace(/<IS-DARK>/g, '[data-is-dark="true"]')
  .replace(/<LIGHT-BACKGROUND>/g, lightBg)
  .replace(/<DARK-BACKGROUND>/g, darkBg);
