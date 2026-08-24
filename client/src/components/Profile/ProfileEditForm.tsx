import { useState } from "react";

import type {
  CareerProfile,
  UpdateProfileData,
} from "../../services/profileApi";

interface Props {
  profile: CareerProfile;
  saving: boolean;
  error: string;

  onCancel: () => void;

  onSave: (
    data: UpdateProfileData
  ) => Promise<void>;
}

function ProfileEditForm({
  profile,
  saving,
  error,
  onCancel,
  onSave,
}: Props) {
  const [headline, setHeadline] =
    useState(profile.headline ?? "");

  const [bio, setBio] =
    useState(profile.bio ?? "");

  const [location, setLocation] =
    useState(profile.location ?? "");

  const [phone, setPhone] =
    useState(profile.phone ?? "");

  const [githubUrl, setGithubUrl] =
    useState(profile.githubUrl ?? "");

  const [linkedinUrl, setLinkedinUrl] =
    useState(profile.linkedinUrl ?? "");

  const [portfolioUrl, setPortfolioUrl] =
    useState(profile.portfolioUrl ?? "");

  const submit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    await onSave({
      headline,
      bio,
      location,
      phone,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    });
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-5"
    >
      <h2 className="text-2xl font-bold">
        Edit Profile
      </h2>

      <div>
        <label className="mb-2 block font-medium">
          Headline
        </label>

        <input
          value={headline}
          onChange={(event) =>
            setHeadline(event.target.value)
          }
          placeholder="Full Stack Developer"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Bio
        </label>

        <textarea
          value={bio}
          onChange={(event) =>
            setBio(event.target.value)
          }
          rows={4}
          placeholder="Tell us about yourself..."
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Location
        </label>

        <input
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
          placeholder="Hyderabad"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Phone
        </label>

        <input
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value)
          }
          placeholder="Phone number"
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          GitHub URL
        </label>

        <input
          type="url"
          value={githubUrl}
          onChange={(event) =>
            setGithubUrl(event.target.value)
          }
          placeholder="https://github.com/..."
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          LinkedIn URL
        </label>

        <input
          type="url"
          value={linkedinUrl}
          onChange={(event) =>
            setLinkedinUrl(event.target.value)
          }
          placeholder="https://linkedin.com/in/..."
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          Portfolio URL
        </label>

        <input
          type="url"
          value={portfolioUrl}
          onChange={(event) =>
            setPortfolioUrl(event.target.value)
          }
          placeholder="https://..."
          className="w-full rounded-lg border p-3"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border px-5 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ProfileEditForm;