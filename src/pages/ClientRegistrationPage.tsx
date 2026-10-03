import { useState, type FormEvent } from 'react';
import { Activity, AlertCircle, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import {
  registerDemoClient,
  type ClientRegistrationData,
} from '../demoAuth';
import type { Page, UserSession } from '../types';

type FormValues = Omit<ClientRegistrationData, 'termsAccepted'> & {
  confirmPassword: string;
  termsAccepted: boolean;
};

type FieldName = keyof FormValues;
type FormErrors = Partial<Record<FieldName, string>>;

const INITIAL_VALUES: FormValues = {
  fullName: '',
  email: '',
  mobileNumber: '',
  organizationName: '',
  organizationType: '',
  registrationNumber: '',
  taxNumber: '',
  siteName: '',
  address: '',
  city: '',
  state: '',
  country: '',
  postalCode: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

interface Props {
  onNavigate: (page: Page) => void;
  onRegister: (session: UserSession) => void;
}

interface TextFieldProps {
  label: string;
  name: FieldName;
  value: string;
  error?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  trailing?: React.ReactNode;
  onChange: (name: FieldName, value: string) => void;
}

function TextField({
  label,
  name,
  value,
  error,
  required,
  type = 'text',
  autoComplete,
  placeholder,
  trailing,
  onChange,
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-500 text-[#172033]">
        {label}{required && <span className="text-red-600"> *</span>}
      </span>
      <span className="relative block">
        <input
          type={type}
          name={name}
          value={value}
          onChange={event => onChange(name, event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`w-full rounded border bg-white px-3 py-2.5 text-sm text-[#172033] outline-none transition-colors placeholder:text-[#94A3B8] ${
            trailing ? 'pr-10' : ''
          } ${error ? 'border-red-300 focus:border-red-500' : 'border-[#E2E8F0] focus:border-[#F5C451]'}`}
        />
        {trailing}
      </span>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#E2E8F0] pb-6 last:border-0 last:pb-0">
      <div className="mb-4">
        <h2 className="text-sm font-700 text-[#0B1F3B]">{title}</h2>
        <p className="mt-0.5 text-xs text-[#64748B]">{description}</p>
      </div>
      {children}
    </section>
  );
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required.';
  if (!values.organizationName.trim()) errors.organizationName = 'Organization name is required.';
  if (!values.siteName.trim()) errors.siteName = 'Site or location name is required.';
  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 8 || !/\d/.test(values.password)) {
    errors.password = 'Use at least 8 characters including one number.';
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  if (!values.termsAccepted) errors.termsAccepted = 'You must agree before continuing.';
  return errors;
}

export default function ClientRegistrationPage({ onNavigate, onRegister }: Props) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [registeredSession, setRegisteredSession] = useState<UserSession | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateValue(name: FieldName, value: string | boolean) {
    setValues(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: undefined }));
    setFormError('');
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setFormError('Please review the highlighted fields.');
      return;
    }

    const { confirmPassword: _confirmPassword, termsAccepted: _termsAccepted, ...account } = values;
    const result = registerDemoClient({ ...account, termsAccepted: true });
    if (!result.session) {
      setFormError(result.error ?? 'Unable to create this demo client account.');
      return;
    }

    setFormError('');
    setRegisteredSession(result.session);
  }

  if (registeredSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="w-full max-w-md rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CheckCircle size={24} />
          </div>
          <h1 className="mt-5 text-xl font-700 text-[#0B1F3B]">Client account created successfully.</h1>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Your development client account is ready. Continue to your existing Client Dashboard.
          </p>
          <button
            type="button"
            onClick={() => onRegister(registeredSession)}
            className="mt-6 w-full rounded bg-[#0B1F3B] px-4 py-2.5 text-sm font-600 text-white transition-colors hover:bg-[#162A4B]"
          >
            Continue to Client Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="mt-3 text-xs font-500 text-[#64748B] transition-colors hover:text-[#0B1F3B]"
          >
            Sign in instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-[#0B1F3B] px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-[#F5C451]">
            <Activity size={18} className="text-[#0B1F3B]" />
          </div>
          <div>
            <div className="text-sm font-700 text-white">FieldOps</div>
            <div className="text-[10px] font-600 uppercase tracking-widest text-[#F5C451]">Nexus</div>
          </div>
          <div className="ml-auto hidden items-center gap-2 text-xs text-white/60 sm:flex">
            <ShieldCheck size={14} className="text-[#F5C451]" />
            Client registration
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-700 text-[#0B1F3B]">Create Client Account</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Register your organization to access FieldOps Nexus service management.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm sm:p-7">
          {formError && (
            <div className="mb-6 flex items-start gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                <div>{formError}</div>
                {formError === 'An account with this email already exists.' && (
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="mt-1 font-600 underline underline-offset-2"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <Section title="Personal Information" description="Tell us who will manage this client account.">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Full Name" name="fullName" value={values.fullName} error={errors.fullName} required autoComplete="name" onChange={updateValue} />
                <TextField label="Email Address" name="email" value={values.email} error={errors.email} required type="email" autoComplete="email" onChange={updateValue} />
                <TextField label="Mobile Number" name="mobileNumber" value={values.mobileNumber} error={errors.mobileNumber} required type="tel" autoComplete="tel" onChange={updateValue} />
              </div>
            </Section>

            <Section title="Organization Information" description="Provide the organization details associated with this account.">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Organization Name" name="organizationName" value={values.organizationName} error={errors.organizationName} required autoComplete="organization" onChange={updateValue} />
                <label className="block">
                  <span className="mb-1.5 block text-xs font-500 text-[#172033]">Organization Type</span>
                  <select
                    value={values.organizationType}
                    onChange={event => updateValue('organizationType', event.target.value)}
                    className="w-full rounded border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#172033] outline-none focus:border-[#F5C451]"
                  >
                    <option value="">Select organization type</option>
                    <option value="business">Business</option>
                    <option value="government">Government</option>
                    <option value="non-profit">Non-profit</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <TextField label="Company/Business Registration Number" name="registrationNumber" value={values.registrationNumber} onChange={updateValue} />
                <TextField label="Tax/GST Number" name="taxNumber" value={values.taxNumber} onChange={updateValue} />
              </div>
            </Section>

            <Section title="Location Information" description="Add the primary service location for your organization.">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Site/Location Name" name="siteName" value={values.siteName} error={errors.siteName} required onChange={updateValue} />
                <TextField label="Address" name="address" value={values.address} autoComplete="street-address" onChange={updateValue} />
                <TextField label="City" name="city" value={values.city} autoComplete="address-level2" onChange={updateValue} />
                <TextField label="State" name="state" value={values.state} autoComplete="address-level1" onChange={updateValue} />
                <TextField label="Country" name="country" value={values.country} autoComplete="country-name" onChange={updateValue} />
                <TextField label="Postal Code" name="postalCode" value={values.postalCode} autoComplete="postal-code" onChange={updateValue} />
              </div>
            </Section>

            <Section title="Account Security" description="Create the password used to sign in to this development client account.">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Password"
                  name="password"
                  value={values.password}
                  error={errors.password}
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  onChange={updateValue}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword(current => !current)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  error={errors.confirmPassword}
                  required
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  onChange={updateValue}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(current => !current)}
                      aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </div>
              <p className="mt-2 text-xs text-[#64748B]">Use at least 8 characters, including one number.</p>
            </Section>
          </div>

          <div className="mt-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={values.termsAccepted}
                onChange={event => updateValue('termsAccepted', event.target.checked)}
                className="mt-0.5 rounded"
              />
              <span className="text-sm text-[#64748B]">
                I agree to the <span className="font-600 text-[#0B1F3B]">Terms</span> and{' '}
                <span className="font-600 text-[#0B1F3B]">Privacy Policy</span>.
              </span>
            </label>
            {errors.termsAccepted && <p className="mt-1 text-xs text-red-600">{errors.termsAccepted}</p>}
          </div>

          <div className="mt-6 flex flex-col-reverse items-center gap-3 border-t border-[#E2E8F0] pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-sm font-500 text-[#64748B] transition-colors hover:text-[#0B1F3B]"
            >
              Already have an account? <span className="font-600 text-[#0B1F3B]">Sign In</span>
            </button>
            <button
              type="submit"
              className="w-full rounded bg-[#0B1F3B] px-5 py-2.5 text-sm font-600 text-white transition-colors hover:bg-[#162A4B] sm:w-auto"
            >
              Create Client Account
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
