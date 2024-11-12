/**
 * Copyright 2024 SkylerKoba88
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class PageItem extends DDDSuper(I18NMixin(LitElement)) {

  constructor() {
    super();
    this.source = '';
    this.heading = '';
    this.lastUpdated = '';
    this.description = '';
    this.contentLink = '';
    this.indexLink = '';
    this.additionalInfo = '';
    
  }

  static get properties() {
    return {
        heading: {type: String},
        source: { type: String },
        lastUpdated: { type: String},
        description: { type: String },
        contentLink: { type: String},
        indexLink: { type: String},
        additionalInfo: { type: String}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [css`
    :host {
        display: inline-flex;
        height: auto;
        max-width: 240px;
        width: 240px;
        margin: 21px;
        font-family: var(--ddd-font-primary);
        background-color: var(--ddd-theme-default-nittanyNavy);
        font-weight: bold;
        text-align: left;
        padding: 8px;
        min-height: 270px;
    }
  

    .image div {
    max-width: 240px;
    font-size: 12px;
    background-color: var(--ddd-theme-default-nittanyNavy);
    padding: 4px;
    }
    .image:hover {
      opacity: 50%;
    }

    .image img {
    display: block;
    width: 240px;
    height: 200px;
    margin: auto;
    }
    a:link {
      color: var(--ddd-theme-defaut-slateMaxLight);
    }
    a:visited {
      color: var(--ddd-theme-defaut-slateMaxLight);
      text-decoration: none;
    }
    `];
  }
  
  // Lit render the HTML
  render() {
    return html`
    <div class="image">
        ${this.source ? html`
          <img 
            src="${this.source}" 
            alt="${this.heading}" 
            />
            ` : ''}
        <div>
          <h2>${this.heading}</h2>
          <p>Last Updated: ${this.lastUpdated}</p>
          ${this.description}
          <a href="${this.contentLink}" target="_blank"><p>Content Link</p></a>
          <a href="${this.indexLink}" target="_blank"><p>Index Link</p></a>
          ${this.additionalInfo ? html `
            <video 
              href="${this.additionalInfo}">
            </video>
          ` : ''}
        </div>
    </div>
    `;
  }
  static get tag() {
    return "page-item";
  }
}

customElements.define(PageItem.tag, PageItem);