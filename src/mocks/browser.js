// ✨ 'msw'가 아닌 'msw/browser'에서 setupWorker를 import 합니다.
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);