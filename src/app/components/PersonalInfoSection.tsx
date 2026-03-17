import type { FC } from 'hono/jsx';
import type { UserSchemaType } from '../validation';

type PersonalInfoSectionProps = {
  user?: UserSchemaType;
  errors?: Record<string, string[]>;
};

export const PersonalInfoSection: FC<PersonalInfoSectionProps> = ({ user, errors }) => {
  return (
    <div class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Personal Information</h2>
      <div class="mb-4">
        <label for="fullName" class="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
        <input 
          type="text" 
          id="fullName" 
          name="fullName" 
          value={user?.fullName || ''} 
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        />
        {errors?.fullName && errors.fullName.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          value={user?.email || ''} 
          required
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        />
        {errors?.email && errors.email.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>
      <div class="mb-4">
        <label for="phone" class="block text-gray-700 text-sm font-bold mb-2">Phone</label>
        <input 
          type="text" 
          id="phone" 
          name="phone" 
          value={user?.phone || ''}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        />
        {errors?.phone && errors.phone.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>
      <div class="mb-4">
        <label for="location" class="block text-gray-700 text-sm font-bold mb-2">Location</label>
        <input 
          type="text" 
          id="location" 
          name="location" 
          value={user?.location || ''}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        />
        {errors?.location && errors.location.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>
      <div class="mb-4">
        <label for="telegramUsername" class="block text-gray-700 text-sm font-bold mb-2">Telegram Username</label>
        <input 
          type="text" 
          id="telegramUsername" 
          name="telegramUsername" 
          value={user?.telegramUsername || ''}
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        />
        {errors?.telegramUsername && errors.telegramUsername.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>
      <div class="mb-4">
        <label for="professionalSummary" class="block text-gray-700 text-sm font-bold mb-2">Professional Summary</label>
        <textarea 
          id="professionalSummary" 
          name="professionalSummary" 
          rows={4} 
          placeholder="Brief summary of your professional background and career goals"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {user?.professionalSummary || ''}
        </textarea>
        {errors?.professionalSummary && errors.professionalSummary.map(err => (
          <p class="text-red-500 text-xs italic mt-1">{err}</p>
        ))}
      </div>
    </div>
  );
};