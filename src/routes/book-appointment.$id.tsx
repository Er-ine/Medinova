import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  FiCalendar, FiClock, FiUser, FiPhone, FiFileText,
  FiChevronLeft, FiChevronRight, FiCheckCircle, FiArrowRight,
} from "react-icons/fi";
import { SiteShell } from "../components/SiteShell";
import { SlotPicker } from "../components/SlotPicker";
import { getDoctor } from "../data/doctors";

export const Route = createFileRoute("/book-appointment/$id")({
  loader: ({ params }) => {
    const d = getDoctor(params.id);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Book ${loaderData?.name ?? "Appointment"} — MediCare` }, { name: "description", content: "Book your appointment in seconds." }],
  }),
  notFoundComponent: () => (
    <SiteShell><div className="med-page med-container"><h1>Doctor not found</h1><Link to="/doctors" className="med-btn med-btn-primary" style={{ marginTop: 16 }}>Back to doctors</Link></div></SiteShell>
  ),
  errorComponent: () => <SiteShell><div className="med-page med-container">Something went wrong.</div></SiteShell>,
  component: BookingPage,
});

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function BookingPage() {
  const doctor = Route.useLoaderData();
  const navigate = useNavigate();
  const today = new Date();

  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [cursor]);

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const isPast = (d: Date) => {
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  const dateLabel = selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

  const canSubmit = name && phone && reason && slot;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    const newPatientAppt = {
      id: "a" + Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.specialization,
      date: selectedDate.toLocaleDateString("en-CA"), // YYYY-MM-DD
      time: slot,
      status: "Confirmed"
    };
    const savedAppts = JSON.parse(localStorage.getItem("bookedAppointments") || "[]");
    localStorage.setItem("bookedAppointments", JSON.stringify([...savedAppts, newPatientAppt]));

    const newDocAppt = {
      id: "p" + Date.now(),
      doctorName: doctor.name,
      name: name,
      age: 30, // Mock age
      time: slot,
      problem: reason,
      status: "Waiting"
    };
    const savedDocAppts = JSON.parse(localStorage.getItem("bookedPatients") || "[]");
    localStorage.setItem("bookedPatients", JSON.stringify([...savedDocAppts, newDocAppt]));

    setConfirmed(true);
  };

  return (
    <SiteShell>
      <div className="med-page">
        <div className="med-container">
          <div className="booking-grid">
            <aside className="booking-summary med-anim-up">
              <div className="top">
                <div className="av">{doctor.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <div className="name">{doctor.name}</div>
                  <div className="qual">{doctor.specialization}</div>
                </div>
              </div>
              <div className="info">
                <div className="row"><span>Hospital</span><b>{doctor.hospital}</b></div>
                <div className="row"><span>Experience</span><b>{doctor.experience} yrs</b></div>
                <div className="row"><span>Consultation fee</span><b>₹{doctor.fee}</b></div>
                <div className="row"><span>Hours</span><b style={{ fontSize: 12 }}>{doctor.hours}</b></div>
              </div>
              <Link to="/doctor/$id" params={{ id: doctor.id }} className="med-btn med-btn-outline med-btn-block" style={{ marginTop: 18 }}>
                View Full Profile
              </Link>
            </aside>

            <form className="booking-main" onSubmit={submit}>
              <section className="booking-section med-anim-up">
                <h3><FiCalendar /> Select date</h3>
                <div className="cal-head">
                  <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><FiChevronLeft /></button>
                  <b>{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</b>
                  <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><FiChevronRight /></button>
                </div>
                <div className="cal-grid">
                  {DOW.map((d) => <div key={d} className="cal-dow">{d}</div>)}
                  {days.map((d, i) => {
                    const otherMonth = d.getMonth() !== cursor.getMonth();
                    const past = isPast(d);
                    const selected = isSameDay(d, selectedDate);
                    const isToday = isSameDay(d, today);
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={past}
                        onClick={() => setSelectedDate(d)}
                        className={`cal-day ${otherMonth ? "is-other" : ""} ${isToday ? "is-today" : ""} ${selected ? "is-selected" : ""}`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="booking-section med-anim-up">
                <h3><FiClock /> Choose a time slot</h3>
                <SlotPicker selected={slot} onSelect={setSlot} />
              </section>

              <section className="booking-section med-anim-up">
                <h3><FiFileText /> Patient details</h3>
                <div className="form-grid">
                  <div className="med-field">
                    <label>Full name</label>
                    <div className="med-input-wrap">
                      <FiUser />
                      <input className="med-input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Patient name" />
                    </div>
                  </div>
                  <div className="med-field">
                    <label>Phone number</label>
                    <div className="med-input-wrap">
                      <FiPhone />
                      <input className="med-input" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div className="med-field full">
                    <label>Reason for visit</label>
                    <textarea
                      className="med-input med-input-plain"
                      style={{ minHeight: 100, paddingTop: 12 }}
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Briefly describe your symptoms or reason..."
                    />
                  </div>
                  <div className="med-field">
                    <label>Appointment date</label>
                    <input className="med-input med-input-plain" value={dateLabel} readOnly />
                  </div>
                  <div className="med-field">
                    <label>Selected time slot</label>
                    <input className="med-input med-input-plain" value={slot ?? "Choose a slot"} readOnly />
                  </div>
                </div>
              </section>

              <div className="confirm-bar">
                <div className="meta">
                  <b>{dateLabel}{slot ? ` · ${slot}` : ""}</b>
                  <span>Total payable: ₹{doctor.fee}</span>
                </div>
                <button type="submit" disabled={!canSubmit} className="med-btn med-btn-lg" style={{ opacity: canSubmit ? 1 : 0.6 }}>
                  Confirm Appointment <FiArrowRight />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {confirmed && (
        <div className="modal-backdrop" onClick={() => setConfirmed(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon"><FiCheckCircle /></div>
            <h3>Appointment Confirmed</h3>
            <p>We've sent a confirmation to your phone. Please arrive 10 minutes early.</p>
            <div className="modal-meta">
              <div className="r"><span>Doctor</span><b>{doctor.name}</b></div>
              <div className="r"><span>Patient</span><b>{name}</b></div>
              <div className="r"><span>Date</span><b>{dateLabel}</b></div>
              <div className="r"><span>Time</span><b>{slot}</b></div>
              <div className="r"><span>Fee</span><b>₹{doctor.fee}</b></div>
            </div>
            <div className="modal-actions">
              <button className="med-btn med-btn-outline med-btn-block" onClick={() => setConfirmed(false)}>Close</button>
              <button className="med-btn med-btn-primary med-btn-block" onClick={() => navigate({ to: "/patient-dashboard" })}>Go to dashboard</button>
            </div>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
