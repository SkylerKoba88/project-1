/**
 * Copyright 2024 SkylerKoba88
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "./site-info.js";
import "./page-item.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `project-1`
 * 
 * @demo index.html
 * @element project-1
 */
export class project1 extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "project-1";
  }

  constructor() {
    super();
    this.value = null;
    this.title = '';
    this.description = '';
    this.logo = '';
    this.theme = '';
    this.creationDate = '';
    this.lastUpdated = '';
    this.header = '';
    this.loading = false;
    this.items = [];
    this.buttonLabel = '';
  }

  // Lit reactive properties
  static get properties() {
    return {
      header: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array, },
      value: { type: String },
      buttonLabel: { type: String}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: auto;
        padding: var(--ddd-spacing-4);
        text-align: center;
      }
      h5 {
        display: inline-flex;
      }
      #input {
        font-family: Verdana, Geneva, Tahoma, sans-serif();
      }
      a:link {
        color: var(--ddd-theme-defaut-slateMaxLight);
        text-decoration: none;
      }
      a:visited {
        color: var(--ddd-theme-defaut-slateMaxLight);
        text-decoration: none;
      }
      site-info {
        margin: auto;
        display: none;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <h5>${this.header}</h5>
        <input type='text' id="input" placeholder="Enter URL here" @input='${this.inputChanged}'/>
        <button class="submit" @click = ${this.checkForURL}>${this.buttonLabel}</button>
      </div>

      <div class="results"> 
        <site-info
          name="${this.title}"
          description="${this.description}"
          logo="${this.logo.href}"
          theme="${this.theme}"
          creationDate="${this.creationDate.created}"
          lastUpdated="${this.lastUpdated.updated}">
        </site-info>

        ${this.items.map((item, index) => html`
          <a href="${item.links[0].href}" target="_blank">
          <page-item
            source="${item.links[0].images.href}"
            lastUpdated="${item.data[0].updated}"
            description="${item.data[0].description}"
            contentLink="${item.links[0].href}"
            indexLink="${item.links[0].location.href}"
            additionalinfo="${item.links[0].videos.href}"
          ></page-item>
          </a>
        `)}
      </div>
    `;
  }

  checkForURL(e) {
    const urlInput = document.getElementById("input").value;
    const urlPattern = /^https?:\/\//;
    if (urlPattern.test(urlInput)) {
      this.value = urlInput;
    } else {
      console.error("Invalid URL");
      e.preventDefault();
    }
  }
  
  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }

  updated(changedProperties) {
    if (changedProperties.has('value') && this.value) {
      this.updateResults(this.value);
    }
    else if (changedProperties.has('value') && !this.value) {
      this.items = [];
    }
  }

  updateResults(value) {
    const siteInfo = this.shadowRoot.querySelector('site-info');
    if (siteInfo) siteInfo.style.display = 'block';

    this.loading = true;
    const fetchUrl = value.includes('site.json') ? value : `${value}/site.json`;
    fetch(fetchUrl).then(d => d.ok ? d.json(): {}).then(data => {
      if (data && data.collection) {
        this.items = [];
        this.items = data.collection.items;
        this.description = data.description || '';
        this.logo = data.links ? data.links.href : '';
        this.theme = data.metadata ? data.metadata.data.theme : '';
        this.creationDate = data.created || '';
        this.lastUpdated = data.updated || '';
      } else {
        console.error("Data format issue");
        this.items = [];
      }
      this.loading = false;
    });
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(project1.tag, project1);