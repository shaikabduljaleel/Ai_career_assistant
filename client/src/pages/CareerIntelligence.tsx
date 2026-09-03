import { useEffect, useState } from "react";
import {
  getCareerIntelligence,
  type CareerIntelligence,
} from "../services/careerIntelligenceApi";

function CareerIntelligence() {
  const [data, setData] = useState<CareerIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCareerIntelligence = async () => {
      try {
        const result = await getCareerIntelligence();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load career intelligence"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCareerIntelligence();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Career Intelligence...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No career data found</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1>Career Intelligence</h1>

      {/* Profile */}
      <section style={{ marginTop: "30px" }}>
        <h2>Profile</h2>

        <p>
          <strong>Headline:</strong>{" "}
          {data.profile.headline || "Not provided"}
        </p>

        <p>
          <strong>Bio:</strong>{" "}
          {data.profile.bio || "Not provided"}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {data.profile.location || "Not provided"}
        </p>
      </section>

      {/* Skills */}
      <section style={{ marginTop: "30px" }}>
        <h2>Skills</h2>

        <p>
          <strong>Total Skills:</strong>{" "}
          {data.skills.summary.total}
        </p>

        <p>
          Beginner: {data.skills.summary.beginner} |{" "}
          Intermediate: {data.skills.summary.intermediate} |{" "}
          Advanced: {data.skills.summary.advanced} |{" "}
          Expert: {data.skills.summary.expert}
        </p>

        {data.skills.items.length > 0 ? (
          <ul>
            {data.skills.items.map((skill) => (
              <li key={skill.id}>
                {skill.name} — {skill.level}
              </li>
            ))}
          </ul>
        ) : (
          <p>No skills added yet.</p>
        )}
      </section>

      {/* Experience */}
      <section style={{ marginTop: "30px" }}>
        <h2>Experience</h2>

        <p>
          <strong>Total:</strong> {data.experience.total}
        </p>

        {data.experience.items.map((experience) => (
          <div key={experience.id} style={{ marginBottom: "20px" }}>
            <h3>
              {experience.role} — {experience.company}
            </h3>

            <p>{experience.location}</p>

            <p>
              {new Date(experience.startDate).toLocaleDateString()}{" "}
              -{" "}
              {experience.endDate
                ? new Date(
                    experience.endDate
                  ).toLocaleDateString()
                : "Present"}
            </p>

            <p>{experience.description}</p>
          </div>
        ))}
      </section>

      {/* Education */}
      <section style={{ marginTop: "30px" }}>
        <h2>Education</h2>

        <p>
          <strong>Total:</strong> {data.education.total}
        </p>

        {data.education.items.map((education) => (
          <div key={education.id} style={{ marginBottom: "20px" }}>
            <h3>
              {education.degree} — {education.field}
            </h3>

            <p>{education.institution}</p>

            <p>
              {education.startYear} - {education.endYear || "Present"}
            </p>

            <p>{education.description}</p>
          </div>
        ))}
      </section>

      {/* Career Goals */}
      <section style={{ marginTop: "30px" }}>
        <h2>Career Goals</h2>

        {data.goals.length > 0 ? (
          data.goals.map((goal) => (
            <div key={goal.id} style={{ marginBottom: "20px" }}>
              <h3>{goal.title}</h3>

              <p>{goal.description}</p>

              <p>
                <strong>Target Role:</strong>{" "}
                {goal.targetRole || "Not specified"}
              </p>

              <p>
                <strong>Target Date:</strong>{" "}
                {goal.targetDate
                  ? new Date(
                      goal.targetDate
                    ).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
          ))
        ) : (
          <p>No career goals added yet.</p>
        )}
      </section>
    </div>
  );
}

export default CareerIntelligence;