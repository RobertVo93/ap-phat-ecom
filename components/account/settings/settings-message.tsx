import { SettingsMessageProps } from './settings-types';

export function SettingsMessage({ message, t }: SettingsMessageProps) {
  if (!message) return null;

  const isSuccess = message.includes(t('account.success'));

  return (
    <div className={`mb-6 p-4 rounded-lg ${isSuccess
      ? 'bg-green-50 border border-green-200 text-green-600'
      : 'bg-red-50 border border-red-200 text-red-600'
      }`}
    >
      {message}
    </div>
  );
}
