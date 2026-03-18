import type { FC } from "hono/jsx";
import type { UserSchemaType } from "../validation";
import type { fetchUserProfile } from "..";

type PersonalInfoSectionProps = {
  user?: Pick<
    NonNullable<Awaited<ReturnType<typeof fetchUserProfile>>>,
    keyof UserSchemaType
  >;
  errors?: Record<string, string[]>;
};

export const PersonalInfoSection: FC<PersonalInfoSectionProps> = ({
  user,
  errors,
}) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">👤</span>
          Personal Information
        </h2>
        <p class="text-blue-200 mt-1">Tell us about yourself</p>
      </div>
      
      <div class="p-8 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="fullName" class="block text-sm font-semibold text-gray-200 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={user?.fullName || ""}
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
              placeholder="Enter your full name"
            />
            {errors?.fullName &&
              errors.fullName.map((err) => (
                <p class="text-red-400 text-sm mt-1 flex items-center">
                  <span class="mr-1">⚠️</span>{err}
                </p>
              ))}
          </div>

          <div>
            <label for="email" class="block text-sm font-semibold text-gray-200 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user?.email || ""}
              required
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
              placeholder="your.email@example.com"
            />
            {errors?.email &&
              errors.email.map((err) => (
                <p class="text-red-400 text-sm mt-1 flex items-center">
                  <span class="mr-1">⚠️</span>{err}
                </p>
              ))}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="phone" class="block text-sm font-semibold text-gray-200 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={user?.phone || ""}
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
              placeholder="+1 (555) 123-4567"
            />
            {errors?.phone &&
              errors.phone.map((err) => (
                <p class="text-red-400 text-sm mt-1 flex items-center">
                  <span class="mr-1">⚠️</span>{err}
                </p>
              ))}
          </div>

          <div>
            <label for="location" class="block text-sm font-semibold text-gray-200 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={user?.location || ""}
              class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
              placeholder="City, Country"
            />
            {errors?.location &&
              errors.location.map((err) => (
                <p class="text-red-400 text-sm mt-1 flex items-center">
                  <span class="mr-1">⚠️</span>{err}
                </p>
              ))}
          </div>
        </div>

        <div>
          <label for="telegramUsername" class="block text-sm font-semibold text-gray-200 mb-2">
            Telegram Username
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
            <input
              type="text"
              id="telegramUsername"
              name="telegramUsername"
              value={user?.telegramUsername || ""}
              class="w-full pl-8 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400"
              placeholder="username"
            />
          </div>
          <p class="text-sm text-gray-400 mt-1">
            💡 Recommended for employer communication on Afriwork
          </p>
          {errors?.telegramUsername &&
            errors.telegramUsername.map((err) => (
              <p class="text-red-400 text-sm mt-1 flex items-center">
                <span class="mr-1">⚠️</span>{err}
              </p>
            ))}
        </div>

        <div>
          <label for="professionalSummary" class="block text-sm font-semibold text-gray-200 mb-2">
            Professional Summary
          </label>
          <textarea
            id="professionalSummary"
            name="professionalSummary"
            rows={4}
            placeholder="Brief summary of your professional background, key skills, and career goals..."
            class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-white placeholder-gray-400 resize-none"
          >
            {user?.professionalSummary || ""}
          </textarea>
          <p class="text-sm text-gray-400 mt-1">
            📝 This helps AI generate better cover letters for you
          </p>
          {errors?.professionalSummary &&
            errors.professionalSummary.map((err) => (
              <p class="text-red-400 text-sm mt-1 flex items-center">
                <span class="mr-1">⚠️</span>{err}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};
