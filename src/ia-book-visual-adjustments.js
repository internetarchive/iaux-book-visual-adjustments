import { html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import { nothing } from 'lit-html';
import bookVisualAdjustmentsCSS from './styles/ia-book-visual-adjustments.js';

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
    return count ? html`<p>(${count} active)</p>` : nothing;
  }

  setRangeValue(id, value) {
    const updatedOptions = [...this.options];
    updatedOptions.find(o => o.id === id).value = value;
    this.options = [...updatedOptions];
  }

  rangeSlider(option) {
    return html`
      <div class=${`range${option.active ? ' visible' : ''}`}>
        <input
          type="range"
          name="${option.id}_range"
          min=${option.min || 0}
          max=${option.max || 100}
          step=${option.step || 1}
          .value=${option.value}
          @input=${e => this.setRangeValue(option.id, e.target.value)}
          @change=${() => this.emitOptionChangedEvent()}
        />
        <p>${option.value}%</p>
      </div>
    `;
  }

  adjustmentCheckbox(option) {
    const formID = `adjustment_${option.id}`;
    return html`<li>
      <label for="${formID}">
        <span class="name">${option.name}</span>
        <input type="checkbox" name="${formID}" id="${formID}" @change=${() => this.changeActiveStateFor(option.id)} ?checked=${option.active} />
        <span class="icon"></span>
      </label>
      ${option.value !== undefined ? this.rangeSlider(option) : nothing}
    </li>`;
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
        <a href="#" class="close" @click=${this.unsetSelectedMenuOption}><ia-icon icon="collapseSidebar"></ia-icon></a>
      </header>
      <ul>${repeat(this.options, option => option.id, this.adjustmentCheckbox.bind(this))}</ul>
    `;
  }
}
