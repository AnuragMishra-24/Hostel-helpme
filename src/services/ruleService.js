import { http } from './api';
import { ENDPOINTS } from './endpoints';
import { withMock } from './withMock';
import * as mock from '@/mock/rules';

/** getRules() → { updatedAt, sections: [{ id, title, rules: string[] }] } */
export const ruleService = {
  getRules: () => withMock(() => mock.getRules(), () => http.get(ENDPOINTS.rules.list)),
};
