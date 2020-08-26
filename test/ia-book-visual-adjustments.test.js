import {
  html,
  fixture,
  expect,
  oneEvent,
} from '@open-wc/testing';
import sinon from 'sinon';
import { IABookVisualAdjustments } from '../src/ia-book-visual-adjustments.js';

customElements.define('ia-book-visual-adjustments', IABookVisualAdjustments);

const options = [{
  id: 'contrast',
  name: 'Adjust contrast',
  active: true,
  min: 0,
  max: 150,
  step: 1,
  value: 100,
}, {
  id: 'invert',
  name: 'Invert colors',
  active: false,
}, {
  id: 'brightness',
  name: 'Adjust brightness',
  active: false,
  value: 100,
}];

const container = () => (
  html`<ia-book-visual-adjustments .options=${options}></ia-book-visual-adjustments>`
);

describe('<ia-book-visual-adjustments>', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('sets default properties', async () => {
    const el = await fixture(container());

    expect(el.options).to.exist;
    expect(el.options.length).to.equal(options.length);
  });

  it('renders all properties of a visual adjustment option', async () => {
    const el = await fixture(container());

    await el.updateComplete;

    const label = el.shadowRoot.querySelector('label');
    const name = label.querySelector('.name');
    const checkbox = label.querySelector('input');
    expect(name.innerText).to.equal(options[0].name);
    expect(checkbox.checked).to.equal(true);
  });

  it('emits a custom event to close the menu', async () => {
    const el = await fixture(container());

    setTimeout(() => (
      el.unsetSelectedMenuOption(new Event('click'))
    ));
    const response = await oneEvent(el, 'menuTypeSelected');

    expect(response).to.exist;
  });

  it('closes the menu when close element clicked', async () => {
    IABookVisualAdjustments.prototype.unsetSelectedMenuOption = sinon.fake();

    const el = await fixture(container());

    el.shadowRoot.querySelector('.close').click();
    expect(el.unsetSelectedMenuOption.callCount).to.equal(1);
  });

  it('renders active options count', async () => {
    const el = await fixture(container());

    expect(el.shadowRoot.querySelector('header p').innerText).to.include('1');
  });

  it('does not render active options count element when none are selected', async () => {
    const el = await fixture(container());

    el.options = [options[1]];
    await el.updateComplete;

    expect(el.shadowRoot.querySelector('header p')).not.to.exist;
  });

  it('changes option\'s active state when input changed', async () => {
    const el = await fixture(container());

    el.shadowRoot.querySelector('li input').dispatchEvent(new Event('change'));
    await el.updateComplete;

    expect(el.options[0].active).to.equal(false);
  });

  it('triggers an emitOptionChangedEvent event when a checkbox\'s change event fires', async () => {
    IABookVisualAdjustments.prototype.emitOptionChangedEvent = sinon.fake();

    const el = await fixture(container());

    el.shadowRoot.querySelector('li input').dispatchEvent(new Event('change'));
    expect(el.emitOptionChangedEvent.callCount).to.equal(1);
  });

  it('triggers an emitOptionChangedEvent event when a range\'s change event fires', async () => {
    IABookVisualAdjustments.prototype.emitOptionChangedEvent = sinon.fake();

    const el = await fixture(container());

    el.shadowRoot.querySelector('[name="brightness_range"]').dispatchEvent(new Event('change'));
    expect(el.emitOptionChangedEvent.callCount).to.equal(1);
  });

  it('sets range defaults when none supplied', async () => {
    const el = await fixture(container());
    const brightnessRange = el.shadowRoot.querySelector('[name="brightness_range"]');

    expect(brightnessRange.getAttribute('min')).to.equal('0');
    expect(brightnessRange.getAttribute('max')).to.equal('100');
    expect(brightnessRange.getAttribute('step')).to.equal('1');
  });

  it('sets the updated range value on the options prop', async () => {
    const el = await fixture(container());
    const id = options[0].id;
    const initialValue = options[0].value;
    const newValue = 120;

    el.setRangeValue(id, 120);
    await el.updateComplete;

    expect(el.options[0].value).to.equal(newValue);
  });

  it('triggers a setRangeValue event when a range\'s input event fires', async () => {
    IABookVisualAdjustments.prototype.setRangeValue = sinon.fake();

    const el = await fixture(container());

    el.shadowRoot.querySelector('[name="brightness_range"]').dispatchEvent(new Event('input'));
    expect(el.setRangeValue.callCount).to.equal(1);
  });
});
