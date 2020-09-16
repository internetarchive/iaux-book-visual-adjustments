import { html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import { nothing } from 'lit-html';
import bookVisualAdjustmentsCSS from './styles/ia-book-visual-adjustments.js';

const events = {
  optionChange: 'visualAdjustmentOptionChanged',
};
export class IABookVisualAdjustments extends LitElement {
  static get styles() {
    return bookVisualAdjustmentsCSS;
  }

  static get properties() {
    return {
      renderHeader: { type: Boolean },
      options: { type: Array },
      activeCount: { type: Number },
    };
  }

  constructor() {
    super();

    this.renderHeader = false;
    this.options = [];
    this.activeCount = 0;
  }

  firstUpdated() {
    this.activeCount = this.activeOptions.length;
    this.emitOptionChangedEvent();
  }

  /** Gets list of active options
   * @return array
   */
  get activeOptions() {
    return this.options.reduce((results, option) => (
      option.active ? [...results, option.id] : results
    ), []);
  }

  /**
   * Returns blob that will be emitted by event
   */
  prepareEventDetails(changedOptionId = '') {
    return {
      options: this.options,
      activeCount: this.activeCount,
      changedOptionId,
    };
  }

  /**
   * Fires custom event when options change
   * Provides state details: { options, activeCount, changedOptionId }
   *
   * @param { string } changedOptionId
   */
  emitOptionChangedEvent(changedOptionId = '') {
    const detail = this.prepareEventDetails(changedOptionId);
    this.dispatchEvent(new CustomEvent(events.optionChange, {
      bubbles: true,
      composed: true,
      detail,
    }));
  }

  /**
   * Updates adjustment & component state
   * updates params of available ajdustment options list
   * updates active adjustment count
   * triggers custom event
   * @param { string } optionName
   */
  changeActiveStateFor(optionName) {
    const updatedOptions = [...this.options];
    const checkedOption = updatedOptions.find(option => option.id === optionName);
    checkedOption.active = !checkedOption.active;
    this.options = updatedOptions;
    this.activeCount = this.activeOptions.length;
    this.emitOptionChangedEvent(checkedOption.id);
  }

  setRangeValue(id, value) {
    const updatedOptions = [...this.options];
    updatedOptions.find(o => o.id === id).value = value;
    this.options = [...updatedOptions];
  }

  /* render */
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

  get headerSection() {
    const activeAdjustments = this.activeCount ? html`<p>(${this.activeCount} active)</p>` : nothing;
    const header = html`<header>
      <h3>Visual adjustments</h3>
      ${activeAdjustments}
    </header>`;
    return this.renderHeader ? header : nothing;
  }

  /** @inheritdoc */
  render() {
    return html`
      ${this.headerSection}
      <ul>${repeat(this.options, option => option.id, this.adjustmentCheckbox.bind(this))}</ul>
    `;
  }
}
