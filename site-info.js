/**
 * Copyright 2024 SkylerKoba88
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

export class SiteInfo extends DDDSuper(I18NMixin(LitElement)) {

  constructor() {
    super();
    this.name = '';
    this.description = '';
    this.logo = '';
    this.theme = '';
    this.creationDate = '';
    this.lastUpdated = '';
  }

  static get properties() {
    return {
        name: { type: String },
        description: { type: String},
        logo: { type: String},
        theme: { type: String},
        creationDate: { type: String},
        lastUpdated: { type: String}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [css`
    :host {
        height: 240px;
        max-width: 1020px;
        margin: auto;
        font-family: var(--ddd-font-primary);
        background-color: var(--ddd-theme-default-nittanyNavy);
    }
    div {
      display: inline-flex;
    }

    .image div {
      display: block;
      font-size: 16px;
      max-width: 360px;
      background-color: var(--ddd-theme-default-nittanyNavy);
      padding: 4px;
    }
    .image:hover {
      opacity: 50%;
    }

    .image img {
    width: 240px;
    height: 240px;
    }
    p {
      padding-left: 16px;
    }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="image">
        <img src="${this.logo}"/>
        <div>
          <h3>${this.name}</h3>
          <h4>${this.description}</h4>
          <p>Theme: ${this.theme}</p>
          <p>Creation Date: ${this.creationDate}</p>
          <p>Last Updated: ${this.lastUpdated}</p>
        </div>
    </div>
    `;
  }
  static get tag() {
    return "site-info";
  }
}

customElements.define(SiteInfo.tag, SiteInfo);