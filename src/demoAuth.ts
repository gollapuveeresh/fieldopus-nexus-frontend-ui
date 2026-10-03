import type { UserSession } from './types';

const REGISTERED_CLIENTS_KEY = 'fieldops_registered_clients';
const DEMO_PASSWORD = 'demo1234';
const STOREKEEPER_EMAIL = 'storekeeper@fieldopsnexus.com';
const STOREKEEPER_PASSWORD = 'Store@1234';
const AUDITOR_EMAIL = 'auditor@fieldopsnexus.com';
const AUDITOR_PASSWORD = 'Audit@1234';

const DEMO_PASSWORD_OVERRIDES: Partial<Record<string, string>> = {
  [STOREKEEPER_EMAIL]: STOREKEEPER_PASSWORD,
  [AUDITOR_EMAIL]: AUDITOR_PASSWORD,
};

const DEMO_ACCOUNTS: Record<string, UserSession> = {
  'superadmin@fieldopsnexus.com': {
    email: 'superadmin@fieldopsnexus.com',
    name: 'Super Admin',
    initials: 'SA',
    roleLabel: 'Super Admin',
    role: 'super-admin',
    homePage: 'super-admin-dashboard',
  },
  'assetmanager@fieldopsnexus.com': {
    email: 'assetmanager@fieldopsnexus.com',
    name: 'Asset Manager',
    initials: 'AM',
    roleLabel: 'Asset Manager',
    role: 'asset-manager',
    homePage: 'asset-manager-dashboard',
  },
  'operations@fieldopsnexus.com': {
    email: 'operations@fieldopsnexus.com',
    name: 'James Mitchell',
    initials: 'JM',
    roleLabel: 'Operations Manager',
    role: 'operations',
    homePage: 'dashboard',
  },
  'maintenance@fieldopsnexus.com': {
    email: 'maintenance@fieldopsnexus.com',
    name: 'Maintenance Planner',
    initials: 'MP',
    roleLabel: 'Maintenance Planner',
    role: 'maintenance-planner',
    homePage: 'maintenance-planner-dashboard',
  },
  'technician@fieldopsnexus.com': {
    email: 'technician@fieldopsnexus.com',
    name: 'Field Technician',
    initials: 'FT',
    roleLabel: 'Field Technician',
    role: 'technician',
    homePage: 'technician',
  },
  [STOREKEEPER_EMAIL]: {
    email: STOREKEEPER_EMAIL,
    name: 'Storekeeper',
    initials: 'SK',
    roleLabel: 'Storekeeper',
    role: 'stores',
    homePage: 'inventory',
  },
  [AUDITOR_EMAIL]: {
    email: AUDITOR_EMAIL,
    name: 'Auditor',
    initials: 'AU',
    roleLabel: 'Auditor',
    role: 'auditor',
    homePage: 'audit',
  },
  'client@fieldopsnexus.com': {
    email: 'client@fieldopsnexus.com',
    name: 'Client User',
    initials: 'CU',
    roleLabel: 'Client',
    role: 'client',
    homePage: 'client-portal',
  },
};

export interface ClientRegistrationData {
  fullName: string;
  email: string;
  mobileNumber: string;
  organizationName: string;
  organizationType: string;
  registrationNumber: string;
  taxNumber: string;
  siteName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  password: string;
  termsAccepted: true;
}

interface RegisteredClient extends ClientRegistrationData {
  email: string;
}

function isRegisteredClient(value: unknown): value is RegisteredClient {
  if (!value || typeof value !== 'object') return false;
  const client = value as Partial<RegisteredClient>;
  return (
    typeof client.fullName === 'string' &&
    typeof client.email === 'string' &&
    typeof client.mobileNumber === 'string' &&
    typeof client.organizationName === 'string' &&
    typeof client.siteName === 'string' &&
    typeof client.password === 'string' &&
    client.termsAccepted === true
  );
}

function loadRegisteredClients(): RegisteredClient[] {
  try {
    const raw = localStorage.getItem(REGISTERED_CLIENTS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRegisteredClient);
  } catch {
    return [];
  }
}

function initialsFor(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('') || 'CU';
}

function clientSession(client: Pick<RegisteredClient, 'email' | 'fullName'>): UserSession {
  return {
    email: client.email,
    name: client.fullName,
    initials: initialsFor(client.fullName),
    roleLabel: 'Client',
    role: 'client',
    homePage: 'client-portal',
  };
}

export function authenticateDemoAccount(email: string, password: string): UserSession | null {
  const normalizedEmail = email.trim().toLowerCase();
  const demoAccount = DEMO_ACCOUNTS[normalizedEmail];
  if (demoAccount) {
    const expectedPassword = DEMO_PASSWORD_OVERRIDES[normalizedEmail] ?? DEMO_PASSWORD;
    return password === expectedPassword ? demoAccount : null;
  }

  const registeredClient = loadRegisteredClients().find(
    client => client.email === normalizedEmail && client.password === password,
  );
  return registeredClient ? clientSession(registeredClient) : null;
}

export function registerDemoClient(
  data: ClientRegistrationData,
): { session: UserSession | null; error?: string } {
  const normalizedEmail = data.email.trim().toLowerCase();
  const registeredClients = loadRegisteredClients();

  if (
    DEMO_ACCOUNTS[normalizedEmail] ||
    registeredClients.some(client => client.email === normalizedEmail)
  ) {
    return { session: null, error: 'An account with this email already exists.' };
  }

  const registeredClient: RegisteredClient = {
    ...data,
    fullName: data.fullName.trim(),
    email: normalizedEmail,
  };

  try {
    // Frontend demo persistence only. Credentials in browser storage are not production-safe.
    localStorage.setItem(
      REGISTERED_CLIENTS_KEY,
      JSON.stringify([...registeredClients, registeredClient]),
    );
  } catch {
    return {
      session: null,
      error: 'Unable to save this demo account in the current browser.',
    };
  }

  return { session: clientSession(registeredClient) };
}
