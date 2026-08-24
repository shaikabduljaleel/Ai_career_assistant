import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  type CareerProfile,
} from "../services/profileApi";
import ProfileEditForm from "../components/Profile/ProfileEditForm";

function Profile() {
  const [profile, setProfile] =
    useState<CareerProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");
  const [editing, setEditing] = useState(false);
const [saving, setSaving] = useState(false);
const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();

        setProfile(data);
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load your career profile."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>
          You haven't created your career profile yet.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Profile Header */}
        <section className="rounded-xl bg-white p-8 shadow">
  {!editing ? (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {profile.headline ??
              "Your Career Profile"}
          </h1>

          {profile.bio && (
            <p className="mt-3 text-gray-600">
              {profile.bio}
            </p>
          )}

          {profile.location && (
            <p className="mt-2 text-sm text-gray-500">
              📍 {profile.location}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="mt-4 space-y-1 text-sm text-gray-600">
        {profile.phone && (
          <p>📱 {profile.phone}</p>
        )}

        {profile.githubUrl && (
          <p>
            GitHub:{" "}
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {profile.githubUrl}
            </a>
          </p>
        )}

        {profile.linkedinUrl && (
          <p>
            LinkedIn:{" "}
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {profile.linkedinUrl}
            </a>
          </p>
        )}

        {profile.portfolioUrl && (
          <p>
            Portfolio:{" "}
            <a
              href={profile.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {profile.portfolioUrl}
            </a>
          </p>
        )}
      </div>
    </>
  ) : (
    <ProfileEditForm
      profile={profile}
      saving={saving}
      error={saveError}
      onCancel={() => {
        setEditing(false);
        setSaveError("");
      }}
      onSave={async (data) => {
        try {
          setSaving(true);
          setSaveError("");

          const updatedProfile =
            await updateProfile(data);

          setProfile((current) => ({
            ...current!,
            ...updatedProfile,
          }));

          setEditing(false);
        } catch (error) {
          setSaveError(
            error instanceof Error
              ? error.message
              : "Unable to update profile"
          );
        } finally {
          setSaving(false);
        }
      }}
    />
  )}
</section>

        {/* Education */}
        <section className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-bold">
            Education
          </h2>

          {profile.education.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No education added yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {profile.education.map(
                (education) => (
                  <div
                    key={education.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <h3 className="font-semibold">
                      {education.degree}
                    </h3>

                    <p className="text-gray-700">
                      {education.institution}
                    </p>

                    {education.field && (
                      <p className="text-sm text-gray-500">
                        {education.field}
                      </p>
                    )}

                    <p className="text-sm text-gray-500">
                      {education.startYear} -{" "}
                      {education.endYear}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* Experience */}
        <section className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-bold">
            Experience
          </h2>

          {profile.experience.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No experience added yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {profile.experience.map(
                (experience) => (
                  <div
                    key={experience.id}
                    className="border-b pb-4 last:border-b-0"
                  >
                    <h3 className="font-semibold">
                      {experience.role}
                    </h3>

                    <p className="text-gray-700">
                      {experience.company}
                    </p>

                    {experience.location && (
                      <p className="text-sm text-gray-500">
                        {experience.location}
                      </p>
                    )}

                    <p className="mt-2 text-gray-600">
                      {experience.description}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* Skills */}
        <section className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-bold">
            Skills
          </h2>

          {profile.skills.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No skills added yet.
            </p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              {profile.skills.map(
                (profileSkill) => (
                  <span
                    key={profileSkill.skillId}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700"
                  >
                    {profileSkill.skill.name}
                    {" · "}
                    {profileSkill.level}
                  </span>
                )
              )}
            </div>
          )}
        </section>

        {/* Goals */}
        <section className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-xl font-bold">
            Career Goals
          </h2>

          {profile.goals.length === 0 ? (
            <p className="mt-4 text-gray-500">
              No career goals added yet.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {profile.goals.map((goal) => (
                <div
                  key={goal.id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <h3 className="font-semibold">
                    {goal.title}
                  </h3>

                  {goal.targetRole && (
                    <p className="text-gray-600">
                      Target role:{" "}
                      {goal.targetRole}
                    </p>
                  )}

                  {goal.description && (
                    <p className="mt-2 text-gray-600">
                      {goal.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Profile;