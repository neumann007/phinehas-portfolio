'use client'

import Link from 'next/link'
import Carousel from '@/components/Carousel'
import TheLab from '@/components/TheLab'

export default function Home() {
  return (
    <main className="page">

      {/* HERO */}
      <section className="hero">
        <p className="mono hero__tag">
          Full-stack engineer
        </p>
        <h1 className="heading-xl hero__headline">
          A developer who thinks
          <br />
          in systems and builds
          <br />
          <span className="teal">things that should exist.</span>
        </h1>
        <p className="text-body hero__desc">
          Full-stack engineer with 3 years building products, developer
          tools, and infrastructure across Django, FastAPI, React,
          Next.js, PostgreSQL, and DevOps.
        </p>
        {/* <div className="hero__actions">
          <Link href="/projects" className="link-teal">See my work ↓</Link>
          <Link href="/about" className="link-muted">About me →</Link>
        </div> */}
      </section>

      <section className="lab-transition">
        <div className="lab-transition__inner">
          {/* <p className="lab-transition__eyebrow">The Lab</p> */}
          <h2 className="lab-transition__heading">
            An Engineer <br/> who doesn't just write code.<br />
            <span className="lab-transition__heading--accent">
              Designs the foundations of systems.
            </span>
          </h2>
          <p className="lab-transition__subtext">
            Watch how experience changes everything — from what works to what scales.
          </p>
          {/* <div className="lab-transition__divider">
            <span className="lab-transition__divider-line" />
            <span className="lab-transition__divider-dot" />
            <span className="lab-transition__divider-line" />
          </div> */}
        </div>
      </section>

      {/* THE LAB */}
      <section className="home-typewriter-section">
        <TheLab />
      </section>

      {/* <div className="divider" /> */}

      {/* THE DECK */}
      {/* <section className="section">
        <p className="mono" style={{ marginBottom: '2rem' }}>The Deck — leave your mark</p>
        <div className="echoes-section">
          <div className="echoes-section__content">
            <h2 className="heading-md" style={{ marginBottom: '1rem' }}>
              Everyone who visits
              <br />
              <span className="teal">signs the wall.</span>
            </h2>
            <p className="text-body" style={{ maxWidth: '360px', marginBottom: '1.5rem' }}>
              A growing wall of signatures. Draw your name, leave a thought.
              Find out who else has been here — and what they were thinking.
            </p>
            <a href="/deck" className="link-teal">
              Sign the Deck ↓
            </a>
          </div>
          <div className="echoes-placeholder">ECHOES GLOBE</div>
        </div>
      </section>

      <div className="divider" /> */}

      {/* SCRIVE TEASER */}
      <section className="scrive-teaser">
        <svg className="scrive-teaser__rays" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="godray-center" cx="50%" cy="60%" r="60%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="1" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="600" cy="300" rx="500" ry="200" fill="url(#godray-center)" />
          {[100, 250, 400, 550, 650, 800, 950, 1100].map((x2, i) => (
            <polygon key={i} points={`600,300 ${x2 - 30},0 ${x2 + 30},0`} fill="#2dd4bf" opacity={0.15} />
          ))}
        </svg>
        <div className="scrive-teaser__particles">
          {[
            { left: '5%',  top: '80%', size: 2, duration: '6s',  delay: '0s'    },
            { left: '12%', top: '60%', size: 1, duration: '8s',  delay: '1s'    },
            { left: '20%', top: '90%', size: 2, duration: '7s',  delay: '2s'    },
            { left: '30%', top: '70%', size: 1, duration: '9s',  delay: '0.5s'  },
            { left: '40%', top: '85%', size: 2, duration: '6s',  delay: '3s'    },
            { left: '50%', top: '75%', size: 1, duration: '8s',  delay: '1.5s'  },
            { left: '58%', top: '90%', size: 2, duration: '7s',  delay: '0s'    },
            { left: '65%', top: '65%', size: 1, duration: '9s',  delay: '2.5s'  },
            { left: '72%', top: '80%', size: 2, duration: '6s',  delay: '1s'    },
            { left: '80%', top: '70%', size: 1, duration: '8s',  delay: '3.5s'  },
            { left: '88%', top: '85%', size: 2, duration: '7s',  delay: '0.5s'  },
            { left: '95%', top: '60%', size: 1, duration: '9s',  delay: '2s'    },
          ].map((p, i) => (
            <div
              key={i}
              className="scrive-teaser__particle"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                left: p.left,
                top: p.top,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
        <div className="scrive-teaser__content">
          <p className="scrive-teaser__label">Coming soon</p>
          <h2 className="scrive-teaser__heading">Scrive</h2>
          <p className="scrive-teaser__description">
            Visual project scaffolding. Design your architecture before
            you write your first line of code.
          </p>
          <a
            href="https://scrive.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="scrive-teaser__cta"
          >
            Join the waitlist →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer container">
        <span className="mono">Phinehas Newman · 2026</span>
        <span className="mono">Accra, Ghana</span>
      </footer>

    </main>
  )
}