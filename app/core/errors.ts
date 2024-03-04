export class HttpError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string>;

  constructor(
    message: string,
    /**
     * HTTP status code
     */
    status: number,
    /**
     * User input validation errors
     * @example
     *   {
     *     "name": "Must be between 5 and 20 characters long.",
     *     "email": "Not a valid email address."
     *   }
     */
    errors?: Record<string, string>
  ) {
    super(message);

    this.status = status;
    this.errors = errors;

    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
