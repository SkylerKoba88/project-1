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
    this.lastUpdated = '';
    this.description = '';
    this.contentLink = '';
    this.indexLink = '';
    this.additionalInfo = '';
  }

  static get properties() {
    return {
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
        height: 270px;
        max-width: 240px;
        width: 240px;
        margin: 8px;
        font-family: var(--ddd-font-primary);
        background-color: var(--ddd-theme-default-nittanyNavy);
        font-weight: bold;
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
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="image">
        <img src="${this.source}"/>
        <div>
          ${this.lastUpdated}
          ${this.description}
          ${this.contentLink}
          ${this.indexLink}
          ${this.additionalInfo}
        </div>
    </div>
    `;
  }
  static get tag() {
    return "page-item";
  }
}

customElements.define(PageItem.tag, PageItem);