/**
 * Copyright 2024 SkylerKoba88
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import "./site-info.js";
import "./page-item.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/simple-icon/simple-icon.js';

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
    this.renderItems = [];
    this.icon = '';
    this.errorMessage = '';
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
        height: 32px;
        width: 300px;
      }
      button {
        height: 32px;
        font-family: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-default-slateGray);
        font-weight: bold;
        color: var(--ddd-theme-default-slateLight);
        border: var(--ddd-border-md) white;
        border-radius: var(--ddd-radius-xs);
      }
      button:hover {
        background-color: var(--ddd-theme-default-slateLight);
        color: var(--ddd-theme-default-slateGray);
        border: var(--ddd-border-md) var(--ddd-theme-default-slateGray);
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
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
      page-item {
        margin: 20px;
      }
      .error {
        text-align: center;
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        <!--search bar-->
        <h5>${this.header}</h5>
        <input type='text' id="input" placeholder="Enter URL" @input='${this.inputChanged}'/>
        <button class="submit" @click = ${this.toggleResultsDisplay}>${this.buttonLabel}</button>
      </div>
      <div class="error">${this.errorMessage}</div>

  <!--Can't figure out how to make both overview and results show up simultaneously-->
  <!--displays the overview box-->
      ${this.showResults && !this.errorMessage ? html `
      <div class="results-container"> 
        <site-info 
          name=${this.title}
          description=${this.description}
          logo=${this.logo}
          theme=${this.theme}
          creationDate=${this.formattedCreationDate}
          lastUpdated=${this.formattedLastUpdated}
        >
        <span> 
          <simple-icon icon=${this.icon}></simple-icon>
        </span>
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

    get formattedCreationDate() {
      return this.creationDate ? new Date(this.creationDate * 1000).toLocaleDateString() : '';
    }
  
    get formattedLastUpdated() {
      return this.lastUpdated ? new Date(this.lastUpdated * 1000).toLocaleDateString() : '';
    }
  
  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
    const inputValue = e.target.value;
    try {
      new URL(inputValue);
      this.value = inputValue;
      this.errorMessage = '';
      console.log("Valid URL:", inputValue);
    } catch (error) {
      console.error("Invalid URL:", inputValue);
      this.value = '';
      this.errorMessage = "Please type a valid URL.";
    }
  }

  //updating the value when typed in
  updated(changedProperties) {
    if (changedProperties.has('value') && this.value) {
      if (!this.value.indexOf('site.json' > -1)) {
        this.value += 'site.json';
      }
      this.updateResults(this.value);
    }
    else if (changedProperties.has('value') && !this.value) {
      this.items = [];
      this.title = "No items found.";
    }
    //debugging:
    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  //updating results based on search
  updateResults(value) {
    const siteInfo = this.shadowRoot.querySelector('site-info');
    if (siteInfo) siteInfo.style.display = 'block';

    this.loading = true;

    //testing if site.json is in the value
    if (!this.value.includes('site.json')) {
      fetch(`${this.value}/site.json`).then(d => d.ok ? d.json(): {}).then(data => {
        if (data) {
          this.items = [];
          this.items = data.items;
          this.title = data.title;
          this.icon = data.metadata.theme.variables.icon;
          this.description = data.description;
          this.logo = this.value + "/" + data.metadata.site.logo;
          this.theme = data.metadata.theme.variables.hexCode || '';
          this.creationDate = data.metadata.site.created || '';
          this.lastUpdated = data.metadata.site.updated || '';
  
          this.renderItems = (data.items || []).map((item) => {
            return html `
            <a href="${this.value}/${item.slug}" target="_blank">
              <page-item
                source="${this.value}/${item.metadata.images[0]}"
                heading="${item.title}"
                lastUpdated="${item.metadata.updated}"
                description="${item.description}"
                indexLink="${this.value}/${item.location}"
                additionalinfo="${item.metadata.videos?.[0]}"
              ></page-item>
            </a>
            `
          });
        } else {
          console.error("Data format issue");
          this.items = [];
          this.title = "No page found.";
          this.logo = "http://www.rtor.org/depression/";
        }
        this.loading = false;
        this.requestUpdate(); 
      });
    } else {
      fetch(`${this.value}`).then(d => d.ok ? d.json(): {}).then(data => {
        console.log(data);
        this.value = this.value.replace(/\/site\.json$/, '');
        if (data) {
          this.items = [];
          this.items = data.items;
          this.title = data.title;
          this.icon = data.metadata.theme.variables.icon;
          this.description = data.description;
          this.logo = this.value + "/" + data.metadata.site.logo;
          this.theme = data.metadata.theme.variables.hexCode || '';
          this.creationDate = data.metadata.site.created || '';
          this.lastUpdated = data.metadata.site.updated || '';
  
          this.renderItems = (data.items || []).map((item) => {
            return html `
            <a href="${this.value}/${item.slug}" target="_blank">
              <page-item
                source="${this.value}/${item.metadata.items[0]}"
                heading="${item.title}"
                lastUpdated="${item.metadata.updated}"
                description="${item.description}"
                indexLink="${this.value}/${item.location}"
                additionalinfo="${item.metadata.videos?.[0]?.href}"
              ></page-item>
            </a>
            `
          });
        } else {
          console.error("Data format issue");
          this.items = [];
          this.title = "No page found.";
          this.logo = "http://www.rtor.org/depression/";
        }
        this.loading = false;
        this.requestUpdate(); 
      });
    }
    //fetching the data
    
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