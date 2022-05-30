import { animate, state, style, transition, trigger } from '@angular/animations';

export const triggerSlideOver = trigger('slideOver', [
  state(
    'open',
    style({
      opacity: 1,
      transform: 'translateX(0)',
    })
  ),
  state(
    'close',
    style({
      opacity: 0,
      transform: 'translateX(100%)',
    })
  ),
  transition('open => close', [animate('300ms ease-out')]),
  transition('close => open', [animate('300ms ease-in')]),
]);

export const triggerFlyoutMenu = trigger('flyoutMenu', [
  state(
    'open',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  state(
    'close',
    style({
      opacity: 0,
      transform: 'translateY(.25rem)',
      display: 'none',
    })
  ),
  transition('open => close', [animate('150ms ease-in')]),
  transition('close => open', [
    style({
      display: 'block',
    }),
    animate('300ms 200ms ease-out'),
  ]),
]);

export const triggerDropdownMenu = trigger('dropdownMenu', [
  state(
    'open',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  state(
    'close',
    style({
      opacity: 0,
      transform: 'translateY(.25rem)',
      display: 'none',
    })
  ),
  transition('open => close', [animate('150ms ease-in')]),
  transition('close => open', [
    style({
      display: 'block',
    }),
    animate('300ms 200ms ease-out'),
  ]),
]);
