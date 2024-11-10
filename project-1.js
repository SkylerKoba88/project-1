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
    this.showResults = false;
    this.value = '';
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
    this.logoImage = `https://haxtheweb.org/files/hax%20(1).png`;
    this.renderItems = [];
    
  }

  // Lit reactive properties
  static get properties() {
    return {
      header: { type: String },
      loading: { type: Boolean, reflect: true },
      items: { type: Array, },
      value: { type: String },
      buttonLabel: { type: String},
      showResults: { type: Boolean}
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
      .results {
        text-align: center;
      }
      page-item {
        margin: 20px;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <h5>${this.header}</h5>
        <input type='text' id="input" placeholder="Enter URL here" @input='${this.inputChanged}'/>
        <button class="submit" @click = ${this.toggleResultsDisplay}>${this.buttonLabel}</button>
      </div>

      ${this.showResults ? html `
      <div> 
        <site-info
          name=${this.title}
          description=${this.description}
          logo=${this.logoImage}
          theme=${this.theme}
          creationDate=${this.formattedCreationDate}
          lastUpdated=${this.formattedLastUpdated}
        >
        </site-info>

        <div class="results">
          ${this.renderItems || []}
        </div>
      </div>
      ` : ''}
      
    `;
  }

  toggleResultsDisplay() {
    this.showResults = true;
    this.requestUpdate(); 
    this.updateResults(this.value);
  }
  /*checkForURL(e) {
    const urlInput = document.getElementById("input").value;
    const urlPattern = /^https?:\/\//;
    if (urlPattern.test(urlInput)) {
      this.value = urlInput;
    } else {
      console.error("Invalid URL");
      e.preventDefault();
    }
  }*/
    get formattedCreationDate() {
      return this.creationDate ? new Date(this.creationDate).toLocaleDateString() : '';
    }
  
    get formattedLastUpdated() {
      return this.lastUpdated ? new Date(this.lastUpdated).toLocaleDateString() : '';
    }
  
  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }

  updated(changedProperties) {
    if (changedProperties.has('value') && this.value) {
      if (!this.value.indexOf('site.json' > -1)) {
        this.value += 'site.json';
      }
      this.updateResults(this.value);
    }
    else if (changedProperties.has('value') && !this.value) {
      this.items = [];
      console.error("No items found.");
    }
    //debugging:
    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  updateResults(value) {
    const siteInfo = this.shadowRoot.querySelector('site-info');
    if (siteInfo) siteInfo.style.display = 'block';

    this.loading = true;

    fetch(`${this.value}`).then(d => d.ok ? d.json(): {}).then(data => {
      console.log(data);
      if (data) {
        this.items = [];
        this.items = data.items;
        console.log("hax: ", this.items)
        this.title = data.title;
        this.description = data.description;
        this.logo = data.metadata.site.logoImage;
        this.theme = data.metadata.theme.variables.hexCode || '';
        this.creationDate = data.metadata.site.created || '';
        this.lastUpdated = data.metadata.site.updated || '';

        this.renderItems = (data.items || []).map((item) => {
          return html `
            <a href="${this.value}" target="_blank">
              
            <page-item
              source="${item.metadata.images?.[0]?.href}"
              heading="${item.title}"
              lastUpdated="${item.metadata.updated}"
              description="${item.description}"
              indexLink="${item.location.href}"
              additionalinfo="${item.metadata.videos?.[0]?.href}"
            ></page-item>
            </a>
          `
        });
      } else {
        console.error("Data format issue");
        this.items = [];
      }
      this.loading = false;
      this.requestUpdate(); 
    });
  }
  //contentLink="${item.metadata.files.fullUrl}" ; not working
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(project1.tag, project1);