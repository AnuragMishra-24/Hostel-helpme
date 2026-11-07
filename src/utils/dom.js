/** Moves focus to the first invalid control after a failed submit, so keyboard and screen-reader users land on the problem. */
export function focusFirstInvalid(formElement) {
  setTimeout(() => formElement?.querySelector('[aria-invalid="true"]')?.focus(), 0);
}
