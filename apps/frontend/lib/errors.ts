export class UiError extends Error{constructor(public readonly code:string,message:string){super(message);this.name="UiError"}}
export function getErrorMessage(value:unknown,fallback="Something went wrong."){return value instanceof Error?value.message:fallback}
