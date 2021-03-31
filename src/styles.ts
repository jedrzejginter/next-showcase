import { darkBg, lightBg } from './svg';

export const styles = `
  body {
    all: unset;
    background-color: unset;
    margin: 0;
  }

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

  .showcase-group:not(:first-child) {
    margin-top: 10px;
  }

  .showcase-group-name {
    color: grey;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .showcase-navitem {
    cursor: pointer;
    width: 100%;
  }

  .showcase-navitem + .showcase-navitem {
    margin-top: 5px;
  }

  .showcase-item-button {
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Overpass';
    font-weight: 600;
    line-height: 1.75;
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
    box-sizing: border-box;
    display: block;
    line-height: unset;
    min-height: calc(100vh - 50px);
    overflow: auto;
    padding: 10px;
  }

  <ROOT><HAS-ZOOM> .showcase-wrapping-outer-box {
    background-size: 40px;
    padding: 20px;
  }

  <ROOT><IS-DARK> .showcase-wrapping-outer-box {
    background-color: #000;
  }

  <ROOT><HAS-BG> .showcase-wrapping-outer-box {
    background-image: url(<LIGHT-BACKGROUND>);
  }

  <ROOT><HAS-BG><IS-DARK> .showcase-wrapping-outer-box {
    background-image: url(<DARK-BACKGROUND>);
  }

  #showcase-component-box {
    display: block;
  }

  <ROOT><HAS-ZOOM> #showcase-component-box {
    transform: scale(2);
    transform-origin: left top;
  }

  .showcase-checkbox-span {
    margin-left: 4px;
    cursor: pointer;
  }

  .showcase-checkbox-span:hover {
    text-decoration: underline;
  }

  #showcase-variants-nav {
    border-left: 1px solid #ccc;
    display: flex;
    flex-direction: column;
    margin: 2px 0 0 5px;
    padding-left: 4px;
  }

  .showcase-variant-button {
    -webkit-appearance: none;
    appearance: none;
    background-color: transparent;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    font-family: 'Overpass';
    text-align: left;
    min-height: 20px;
  }

  .showcase-variant-button:hover {
    background-color: #ccc;
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

  .showcase-checkbox-label {
    align-items: center;
    display: inline-flex;
    flex-wrap: wrap;
  }

  .showcase-input {
    height: 16px;
    margin: 0;
    width: 16px;
  }

  .showcase-select-label {
    bottom: calc(100% - 1px);
    color: #888;
    font-size: 9px;
    left: 0;
    line-height: 9px;
    position: absolute;
  }

  .showcase-select {
    -webkit-appearance: menulist;
    appearance: menulist;
    background: transparent;
    border-radius: 2px;
    border: 1px solid #ccc;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 16px;
    min-height: 28px;
    padding: 0 10px;
  }

  .showcase-button {
    -webkit-appearance: button;
    appearance: button;
    background: transparent;
    border: 1px solid #ccc;
    border-radius: 2px;
    cursor: pointer;
    display: inline-flex;
    font-family: inherit;
    font-size: 16px;
    min-height: 28px;
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

  #showcase-nothing-selected {
    color: grey;
    font-style: italic;
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
