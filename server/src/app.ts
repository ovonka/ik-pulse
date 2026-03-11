import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './modules/auth/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import supportSessionsRouter from './modules/support-sessions/supportSessions.routes.js';
import transactionsRouter from './modules/transactions/transactions.routes.js';
import settlementsRouter from './modules/settlements/settlements.routes.js';
import dashboardRouter from './modules/dashboard/dashboard.routes.js';
import { startLiveTransactionSimulator } from './simulator/liveTransactionsSimulator.js';
import observabilityRouter from './modules/observability/observability.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', authRouter);
app.use('/support-sessions', supportSessionsRouter);
app.use('/transactions', transactionsRouter);
app.use('/settlements', settlementsRouter);
app.use('/dashboard', dashboardRouter);
app.use('/observability', observabilityRouter);

app.use(errorHandler);

startLiveTransactionSimulator();

export default app;