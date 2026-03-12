import { useAuthStore } from '../../../app/store/authStore';
import { useSupportDebugStore } from '../../../app/store/supportDebugStore';

export function getScopedMerchantId(): string | null {
  const authState = useAuthStore.getState();
  const debugState = useSupportDebugStore.getState();

  const role = authState.user?.role;

  if (
    (role === 'admin' || role === 'support' || role === 'qa') &&
    debugState.debugContext?.merchantContext?.merchantId
  ) {
    return debugState.debugContext.merchantContext.merchantId;
  }

  return authState.user?.merchantId ?? null;
}