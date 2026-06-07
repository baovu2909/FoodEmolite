export const API_ENDPOINT = {
  AUTH: {
    LOGIN: 'auth/login',
    REGISTER: 'auth/register',
    VERIFY: 'auth/verify',
    CHECK_EMAIL: 'auth/check-email'
  },
  STORE: {
    BASE: 'stores',
    DETAIL: (refCode: string) => `stores/${refCode}`,
    OWNER: (ownerRefCode: string) => `stores/owner/${ownerRefCode}`
  },
  STORE_FOOD: {
    BASE: 'store-foods',
    DETAIL: (refCode: string) => `store-foods/${refCode}`,
    BY_STORE: (storeRefCode: string) => `store-foods/store/${storeRefCode}`
  }
} as const;