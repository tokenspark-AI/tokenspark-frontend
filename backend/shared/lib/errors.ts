/**
 * Custom error types for the TokenSpark system.
 */

export class TokenSparkError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'TokenSparkError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class InsufficientFundsError extends TokenSparkError {
  constructor(balance: number, required: number) {
    super(
      `Insufficient funds. Balance: ${balance}, Required: ${required}`,
      402,
      'INSUFFICIENT_FUNDS'
    );
  }
}

export class RateLimitError extends TokenSparkError {
  constructor(limit: number, retryAfter: number) {
    super(
      `Rate limit exceeded. Limit: ${limit} req/min`,
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }
}

export class InvalidApiKeyError extends TokenSparkError {
  constructor() {
    super('Invalid or revoked API key', 401, 'INVALID_API_KEY');
  }
}

export class ProviderError extends TokenSparkError {
  public provider: string;

  constructor(provider: string, message: string, statusCode: number = 502) {
    super(`Provider [${provider}] error: ${message}`, statusCode, 'PROVIDER_ERROR');
    this.provider = provider;
  }
}

export class FraudDetectedError extends TokenSparkError {
  public fraudType: string;

  constructor(fraudType: string, evidence: string) {
    super(`Fraud detected: ${fraudType} — ${evidence}`, 403, 'FRAUD_DETECTED');
    this.fraudType = fraudType;
  }
}

export class LedgerInvariantError extends TokenSparkError {
  constructor(message: string) {
    super(`Ledger invariant violated: ${message}`, 500, 'LEDGER_INVARIANT_ERROR');
  }
}

export class NotFoundError extends TokenSparkError {
  constructor(resource: string, id?: string) {
    super(
      `${resource}${id ? ` with ID ${id}` : ''} not found`,
      404,
      'NOT_FOUND'
    );
  }
}

export class ValidationError extends TokenSparkError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
