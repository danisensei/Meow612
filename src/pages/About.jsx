import { Link } from 'react-router-dom'
import './About.css'

const team = [
  { name: 'Alex Rivera', role: 'Founder & Head Coach', emoji: '🏋️', bio: '10+ years in calisthenics, former national champion. Alex built Meow612 to give athletes gear that keeps up with their ambitions.' },
  { name: 'Priya Sharma', role: 'Product Designer', emoji: '🎨', bio: 'Merging industrial design with athletic performance. Every product Priya designs passes her personal training test first.' },
  { name: 'Jordan Lee', role: 'Head of Operations', emoji: '⚙️', bio: 'Former CrossFit coach turned ops wizard. Jordan ensures every order ships fast and every customer is stoked.' },
]

const values = [
  { icon: '💪', title: 'No Shortcuts', desc: "We never compromise on materials or craftsmanship. If it doesn't meet our standards, it doesn't leave our workshop." },
  { icon: '🌍', title: 'Community First', desc: 'We invest back into the calisthenics community through tutorials, events, and athlete sponsorships.' },
  { icon: '♻️', title: 'Sustainable', desc: 'Responsibly sourced wood, recycled packaging, and a carbon-neutral shipping program.' },
  { icon: '🔬', title: 'Innovation', desc: 'Constantly iterating on our designs based on athlete feedback and the latest materials science.' },
]

const milestones = [
  { year: '2019', event: 'Meow612 founded in a garage workshop' },
  { year: '2020', event: 'First 100 customers — all from word of mouth' },
  { year: '2021', event: 'Launched the Pro Wooden Parallets — still our #1 seller' },
  { year: '2022', event: 'Expanded to apparel and accessories' },
  { year: '2023', event: 'Shipped to 50+ countries, 5,000 orders' },
  { year: '2025', event: '10,000+ athletes and counting' },
]

export default function About() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="glow-orb about-hero__orb" />
        <div className="container about-hero__inner">
          <div className="about-hero__content">
            <div className="section-label">🌟 Our Story</div>
            <h1 className="section-title">Built by Athletes,<br /><span>For Athletes.</span></h1>
            <p className="section-subtitle">
              Meow612 started because we couldn't find gear that matched our standards. 
              So we built it ourselves — and now tens of thousands of athletes train with it every day.
            </p>
            <Link to="/shop" className="btn-primary" id="about-shop-btn">Shop the Collection →</Link>
          </div>
          <div className="about-hero__visual">
            <div className="about-big-emoji">⚡</div>
            <p className="about-tagline">"Train hard.<br />Stay consistent.<br />Level up."</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <div className="section-header-center">
            <div className="section-label">🧬 Our DNA</div>
            <h2 className="section-title">What We <span>Stand For</span></h2>
          </div>
          <div className="values-grid">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header-center">
            <div className="section-label">📅 Our Journey</div>
            <h2 className="section-title">From Garage to <span>Global</span></h2>
          </div>
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className={`timeline-item ${i % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <span className="timeline-year">{m.year}</span>
                  <p className="timeline-event">{m.event}</p>
                </div>
              </div>
            ))}
            <div className="timeline-line" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team-section">
        <div className="container">
          <div className="section-header-center">
            <div className="section-label">👥 The Crew</div>
            <h2 className="section-title">Meet the <span>Team</span></h2>
          </div>
          <div className="team-grid">
            {team.map((member, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{member.emoji}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta__card">
            <div className="glow-orb about-cta__orb" />
            <div className="about-cta__content">
              <h2 className="section-title">Ready to <span>Level Up?</span></h2>
              <p className="section-subtitle">Join 10,000+ athletes who train with Meow612 gear.</p>
              <div className="about-cta__btns">
                <Link to="/shop" className="btn-primary" id="about-cta-shop-btn">Shop Now →</Link>
                <a href="mailto:hello@meow612.com" className="btn-outline" id="contact-btn">Get in Touch</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
