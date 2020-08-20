import { html, LitElement } from 'lit-element';
import bookVisualAdjustmentsCSS from './styles/ia-book-visual-adjustments.js';
import closeIcon from './icon_close.js';

export class IABookVisualAdjustments extends LitElement {
  static get styles() {
    return bookVisualAdjustmentsCSS;
  }

  static get properties() {
    return {
      options: { type: Array },
    };
  }

  constructor() {
    super();

    this.options = [];
  }

  get activeOptions() {
    return this.options.reduce((results, option) => (
      option.active ? [...results, option.id] : results
    ), []);
  }

  get activeAdjustments() {
    const count = this.activeOptions.length;
    return count ? html`<p>(${count} active)</p>` : html``;
  }

  get adjustmentCheckboxes() {
    return this.options.map((option) => {
      const formID = `adjustment_${option.id}`;
      return html`<li>
        <label for="${formID}">
          <span class="name">${option.name}</span>
          <input type="checkbox" name="${formID}" id="${formID}" @change=${() => this.changeActiveStateFor(option.id)} ?checked=${option.active} />
          <span class="icon"></span>
        </label>
        <p>${option.description}</p>
      </li>`;
    });
  }

  changeActiveStateFor(id) {
    const updatedOptions = [...this.options];
    const checkedOption = updatedOptions.find(option => option.id === id);
    checkedOption.active = !checkedOption.active;
    this.options = updatedOptions;
    this.emitOptionChangedEvent();
  }

  emitOptionChangedEvent() {
    this.dispatchEvent(new CustomEvent('visualAdjustmentOptionChanged', {
      bubbles: true,
      composed: true,
      detail: { options: this.options },
    }));
  }

  unsetSelectedMenuOption(e) {
    e.preventDefault();
    this.dispatchEvent(new CustomEvent('menuTypeSelected', {
      bubbles: true,
      composed: true,
      detail: {
        id: 'adjustment',
      },
    }));
  }

  render() {
    return html`
      <header>
        <div>
          <h3>Visual adjustments</h3>
          ${this.activeAdjustments}
        </div>
        <a href="#" class="close" @click=${this.unsetSelectedMenuOption}>${closeIcon}</a>
      </header>
      <ul>${this.adjustmentCheckboxes}</ul>
    `;
  }
}
