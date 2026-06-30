import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FiUser, FiStar, FiClock, FiAward, FiBriefcase, FiMapPin, FiMessageSquare, FiCalendar } from "react-icons/fi";
import { SiteShell } from "../components/SiteShell";
import { getDoctor } from "../data/doctors";
import { REVIEWS } from "../data/appointments";

export const Route = createFileRoute("/doctor/$id")({
  loader: ({ params }) => {
    const d = getDoctor(params.id);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Doctor"} — MediCare` },
      { name: "description", content: loaderData?.about ?? "View doctor profile and book appointment on MediCare." },
    ],
  }),
  notFoundComponent: () => (
    <SiteShell><div className="med-page med-container"><h1>Doctor not found</h1><p>This profile is no longer available.</p><Link to="/doctors" className="med-btn med-btn-primary" style={{ marginTop: 16 }}>Back to doctors</Link></div></SiteShell>
  ),
  errorComponent: () => <SiteShell><div className="med-page med-container">Something went wrong loading this profile.</div></SiteShell>,
  component: DoctorProfile,
});

function DoctorProfile() {
  const d = Route.useLoaderData();

  return (
    <SiteShell>
      <div className="med-page">
        <div className="med-container">
          <div className="profile-grid">
            <div>
              <div className="profile-header med-anim-up">
                <div className="av">{d.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <h1>{d.name}</h1>
                  <div className="qual">{d.qualification}</div>
                  <div className="meta">
                    <span className="pill"><FiAward /> {d.specialization}</span>
                    <span className="pill"><FiBriefcase /> {d.experience} yrs experience</span>
                    <span className="pill"><FiStar /> {d.rating} ({d.reviews})</span>
                    <span className="pill"><FiMapPin /> {d.hospital}</span>
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <h3><FiUser /> About</h3>
                <p>{d.about}</p>
              </div>

              <div className="profile-section">
                <h3><FiAward /> Quick info</h3>
                <div className="kv-grid">
                  <div className="kv"><div className="k">Experience</div><div className="v">{d.experience} years</div></div>
                  <div className="kv"><div className="k">Consultation fee</div><div className="v">₹{d.fee}</div></div>
                  <div className="kv"><div className="k">Working hours</div><div className="v">{d.hours}</div></div>
                  <div className="kv"><div className="k">Hospital</div><div className="v">{d.hospital}</div></div>
                </div>
              </div>

              <div className="profile-section">
                <h3><FiMessageSquare /> Languages spoken</h3>
                <div className="langs">
                  {d.languages.map((l) => <span key={l} className="lang-chip">{l}</span>)}
                </div>
              </div>

              <div className="profile-section">
                <h3><FiStar /> Patient reviews</h3>
                <div className="reviews">
                  {REVIEWS.map((r, i) => (
                    <div className="review" key={i}>
                      <div className="head">
                        <div className="who">
                          <div className="av">{r.name[0]}</div>
                          <b>{r.name}</b>
                        </div>
                        <div className="stars">{Array.from({ length: r.rating }).map((_, i) => <FiStar key={i} fill="currentColor" />)}</div>
                      </div>
                      <p>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="book-side">
              <h3>Book Appointment</h3>
              <div className="fee-row">
                <span style={{ color: "var(--med-muted)", fontSize: 13 }}>Consultation fee</span>
                <b>₹{d.fee}</b>
              </div>
              <div className="next">
                <FiClock style={{ verticalAlign: "-2px", marginRight: 6 }} />
                Next available: <b>{d.availableToday ? "Today, 10:30 AM" : "Tomorrow, 11:00 AM"}</b>
              </div>
              <Link to="/book-appointment/$id" params={{ id: d.id }} className="med-btn med-btn-primary med-btn-block med-btn-lg">
                <FiCalendar /> Book Appointment
              </Link>
              <Link to="/doctors" className="med-btn med-btn-ghost med-btn-block" style={{ marginTop: 8 }}>
                Back to results
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}