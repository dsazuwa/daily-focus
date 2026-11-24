import type { KeyboardEvent } from 'react';

const formFields =
  'input:not([type="hidden"]), select, textarea, [role="combobox"]';

export function focusNextFieldOnEnter(event: KeyboardEvent<HTMLFormElement>) {
  const { target } = event;

  if (
    event.key !== 'Enter' ||
    event.defaultPrevented ||
    event.nativeEvent.isComposing ||
    !(target instanceof HTMLInputElement) ||
    !['text', 'number', 'time'].includes(target.type)
  ) {
    return;
  }

  event.preventDefault();

  const fields = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(formFields),
  ].filter(
    (field) =>
      field.tabIndex >= 0 &&
      !field.matches(':disabled, [aria-disabled="true"]') &&
      field.getClientRects().length > 0,
  );
  const index = fields.indexOf(target);
  if (index !== -1) fields[index + 1]?.focus();
}
