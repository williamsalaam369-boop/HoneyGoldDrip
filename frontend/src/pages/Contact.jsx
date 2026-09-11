import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";

const API = process.env.REACT_APP_BACKEND_URL;

const SUBJECTS = ["General", "Customer Support", "Wholesale", "Collaboration", "Press", "Business Inquiry"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/api/contact`, form);
      setSent(true);
      toast("Message received", { description: "The house will be in touch soon." });
    } catch {
      toast("Message could not be sent", { description: "Please check your details and try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="hg-arch hg-contact" data-testid="contact-page">
      <section className="hg-shop-head">
        <Reveal>
          <p className="hg-kicker">Reach the House</p>
          <h1 className="hg-arch-title" data-testid="contact-title">Contact</h1>
          <div className="hg-rule hg-rule--center" />
          <p className="hg-arch-quote" data-testid="contact-statement">
            Questions, collaborations, wholesale, press — every inquiry is read.
          </p>
        </Reveal>
      </section>

      <Reveal className="hg-contact-wrap">
        {sent ? (
          <div className="hg-contact-sent" data-testid="contact-success">
            <img src="/images/official/logo.png" alt="" className="hg-about-emblem" />
            <h2 className="hg-chapter-title">Message Received</h2>
            <p className="hg-chapter-lede">
              Thank you for writing to HoneyGold Drip™. The house will respond
              as soon as possible.
            </p>
            <button
              className="hg-btn hg-btn--ghost hg-btn--small"
              onClick={() => {
                setSent(false);
                setForm({ name: "", email: "", subject: "General", message: "" });
              }}
              data-testid="contact-send-another"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="hg-contact-form" onSubmit={submit} data-testid="contact-form">
            <div className="hg-form-row">
              <label className="hg-form-field">
                <span className="hg-pdp-label">Name</span>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  data-testid="contact-name-input"
                />
              </label>
              <label className="hg-form-field">
                <span className="hg-pdp-label">Email</span>
                <input
                  type="email"
                  required
                  maxLength={200}
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  data-testid="contact-email-input"
                />
              </label>
            </div>

            <label className="hg-form-field">
              <span className="hg-pdp-label">Inquiry Type</span>
              <select value={form.subject} onChange={set("subject")} data-testid="contact-subject-select">
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="hg-form-field">
              <span className="hg-pdp-label">Message</span>
              <textarea
                required
                rows={7}
                maxLength={5000}
                value={form.message}
                onChange={set("message")}
                placeholder="Write to the house…"
                data-testid="contact-message-input"
              />
            </label>

            <button
              type="submit"
              className="hg-btn hg-btn--solid hg-contact-submit"
              disabled={sending}
              data-testid="contact-submit-button"
            >
              {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        )}
      </Reveal>
    </main>
  );
}
