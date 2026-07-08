import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  FiCalendar, FiSearch, FiShield, FiClock,
  FiArrowRight, FiStar, FiUsers, FiHeart,
  FiVideo, FiFileText, FiCheckCircle,
} from "react-icons/fi";
import { FaStethoscope, FaUserMd, FaBrain, FaHeartbeat, FaTooth, FaBaby, FaBone, FaAllergies } from "react-icons/fa";
import { SiteShell } from "../components/SiteShell";
import { SPECIALITY_TILES } from "../data/doctors";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediCare — Book Trusted Doctors Online" },
      { name: "description", content: "Find verified doctors, book appointments instantly, and manage your healthcare visits in one place." },
      { property: "og:title", content: "MediCare — Book Trusted Doctors Online" },
      { property: "og:description", content: "Find verified doctors, book appointments instantly, and manage your healthcare visits in one place." },
    ],
  }),
  component: Index,
});

const SPEC_ICONS = [FaHeartbeat, FaAllergies, FaBone, FaBaby, FaBrain, FaStethoscope];

function Index() {
  const navigate = useNavigate();

  const goFindDoctor = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate({ to: "/doctors" });
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <SiteShell>
      <section className="hero">
        <div className="med-container hero-grid">
          <div className="med-anim-up">
            <span className="hero-eyebrow"><FiShield /> Trusted Healthcare</span>
            <h1>
              Your health, <span className="accent">simplified.</span><br />
              Book doctors in minutes.
            </h1>
            <p className="lead">
              Discover verified specialists, view real-time availability, and confirm
              appointments instantly — all from one beautifully simple platform.
            </p>
            <div className="hero-actions">
              <button onClick={goFindDoctor} className="med-btn med-btn-primary med-btn-lg">
                Find a Doctor <FiArrowRight />
              </button>
              <Link to="/register" className="med-btn med-btn-outline med-btn-lg">
                Create Account
              </Link>
            </div>
          </div>

          <div className="hero-card med-anim-up">
            <div className="hero-card-inner">
              <div className="doc-mini">
                <div className="av">AS</div>
                <div className="info">
                  <b>Dr. Aarav Sharma</b>
                  <span>Cardiologist · Apollo Hospitals</span>
                </div>
              </div>
              <div className="panel">
                <div className="panel-title">Today's available slots</div>
                <div className="slots" style={{ marginTop: 10 }}>
                  <span className="slot">9:00 AM</span>
                  <span className="slot">9:30 AM</span>
                  <span className="slot active">10:30 AM</span>
                  <span className="slot">11:00 AM</span>
                  <span className="slot">3:30 PM</span>
                </div>
              </div>
              <div className="panel">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div className="panel-title">Appointment confirmed</div>
                    <div className="panel-value">Wed, 10:30 AM</div>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "grid", placeItems: "center", fontSize: 22 }}>
                    <FiCheckCircle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="med-section">
        <div className="med-container">
          <div className="section-head">
            <h2>Everything you need for better care</h2>
            <p>Designed for patients and doctors — fast, secure, and refreshingly simple.</p>
          </div>
          <div className="feat-grid">
            {[
              { ic: <FiSearch />, t: "Find specialists", d: "Search by name, speciality, hospital, or experience." },
              { ic: <FiCalendar />, t: "Instant booking", d: "Live slots with one-tap confirmation and reminders." },
              { ic: <FiVideo />, t: "Video consults", d: "Talk to doctors from home with secure video calls." },
              { ic: <FiFileText />, t: "Health records", d: "Visits, prescriptions, and reports in one place." },
            ].map((f) => (
              <div className="feat-card" key={f.t}>
                <div className="feat-icon">{f.ic}</div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="med-section" style={{ paddingTop: 0 }}>
        <div className="med-container">
          <div className="section-head">
            <h2>Browse by speciality</h2>
            <p>From cardiology to paediatrics — find the right expert for your need.</p>
          </div>
          <div className="spec-grid">
            {SPECIALITY_TILES.map((s, i) => {
              const I = SPEC_ICONS[i % SPEC_ICONS.length];
              return (
                <Link to="/doctors" key={s.name} className="spec-tile">
                  <div className="ic"><I /></div>
                  <b>{s.name}</b>
                  <span>{s.desc}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="med-section" style={{ paddingTop: 0 }}>
        <div className="med-container">
          <div className="section-head">
            <h2>How MediCare works</h2>
            <p>Four simple steps from search to consultation.</p>
          </div>
          <div className="steps-grid">
            {[
              { t: "Search", d: "Find doctors by speciality, location, or rating." },
              { t: "Choose", d: "Compare profiles, fees, and patient reviews." },
              { t: "Book", d: "Pick a slot and confirm in seconds." },
              { t: "Consult", d: "Visit in person or via secure video call." },
            ].map((s, i) => (
              <div className="step-card" key={s.t}>
                <div className="step-n">{i + 1}</div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="med-section" style={{ paddingTop: 0 }}>
        <div className="med-container">
          <div className="cta-band">
            <div>
              <h2>Ready to book your next appointment?</h2>
              <p>Manage your healthcare with MediCare today.</p>
            </div>
            <Link to="/register" className="med-btn med-btn-lg" style={{ background: "#fff", color: "var(--med-blue-700)" }}>
              Get Started Free <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
