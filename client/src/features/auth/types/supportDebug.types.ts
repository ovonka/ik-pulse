import type { SupportAccessSession } from './supportAcces.types';

export type SupportDebugContext = {
  session: SupportAccessSession;
  merchantContext: {
    merchantId: string;
    merchantName: string;
    branchId: string | null;
    requestedByEmail: string | null;
  };
};

export type ConsumeSupportCodePayload = {
  supportCode: string;
};

export type ConsumeSupportCodeResponse = SupportDebugContext;