import { useId, useMemo, useSyncExternalStore } from 'react';
import { getTimeZones } from '@vvo/tzdb';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const majorTimeZoneNames = new Set([
  'Etc/UTC',
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'America/Mexico_City',
  'America/Bogota',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Istanbul',
  'Africa/Lagos',
  'Africa/Cairo',
  'Africa/Nairobi',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Karachi',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Perth',
  'Australia/Sydney',
  'Pacific/Auckland',
]);

const timeZoneNames = getTimeZones({ includeUtc: true })
  .filter(({ name }) => majorTimeZoneNames.has(name))
  .map(({ name }) => name);

function formatTimeZone(value: string, referenceTime: Date) {
  try {
    const offset = new Intl.DateTimeFormat('en-US', {
      timeZone: value,
      timeZoneName: 'shortOffset',
    })
      .formatToParts(referenceTime)
      .find((part) => part.type === 'timeZoneName')
      ?.value.replace('-', '−');
    const city = value.slice(value.lastIndexOf('/') + 1).replaceAll('_', ' ');

    return {
      value,
      label: offset ? `(${offset}) ${city}` : city,
    };
  } catch (error) {
    if (error instanceof RangeError) return null;
    throw error;
  }
}

function subscribeToWindowFocus(onFocus: () => void) {
  window.addEventListener('focus', onFocus);
  return () => window.removeEventListener('focus', onFocus);
}

function getBrowserTimezone() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone === 'UTC' ? 'Etc/UTC' : timezone;
}

export function useBrowserTimezone() {
  return useSyncExternalStore(
    subscribeToWindowFocus,
    getBrowserTimezone,
    () => '',
  );
}

export function TimezoneField({
  timezone,
  browserTimezone,
  referenceTime,
  onChange,
}: {
  timezone: string;
  browserTimezone: string;
  referenceTime: Date;
  onChange: (timezone: string) => void;
}) {
  const id = useId();

  const timeZones = useMemo(
    () =>
      timeZoneNames
        .map((name) => formatTimeZone(name, referenceTime))
        .filter((option) => option !== null),
    [referenceTime],
  );

  const timezoneOptions =
    !timezone || timeZones.some(({ value }) => value === timezone)
      ? timeZones
      : [...timeZones, formatTimeZone(timezone, referenceTime)].filter(
          (option) => option !== null,
        );

  return (
    <Field className='gap-2'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <FieldLabel htmlFor={id}>Timezone</FieldLabel>

        <Button
          type='button'
          variant='outline'
          size='xs'
          className='text-xxs'
          disabled={!browserTimezone || timezone === browserTimezone}
          onClick={() => onChange(browserTimezone)}
        >
          Use current timezone
        </Button>
      </div>

      <Select
        name='timezone'
        required
        items={timezoneOptions}
        value={timezone || undefined}
        onValueChange={(value) => {
          if (value !== null) onChange(value);
        }}
      >
        <SelectTrigger
          id={id}
          size='sm'
          className='border-input dark:bg-input/30 w-full min-w-0 px-3'
        >
          <SelectValue placeholder='Select a timezone' />
        </SelectTrigger>

        <SelectContent align='start' alignItemWithTrigger={false}>
          {timezoneOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
