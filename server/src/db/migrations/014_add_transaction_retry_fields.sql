ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS retry_of_transaction_id UUID NULL REFERENCES transactions(id) ON DELETE SET NULL;

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS attempt_number INTEGER NOT NULL DEFAULT 1 CHECK (attempt_number >= 1);

CREATE INDEX IF NOT EXISTS idx_transactions_retry_of_transaction_id
ON transactions(retry_of_transaction_id);

CREATE INDEX IF NOT EXISTS idx_transactions_attempt_number
ON transactions(attempt_number);