import { Link } from "react-router-dom";

const socials = [
  { name: "Facebook", href: "https://www.facebook.com", icon: FacebookIcon },
  { name: "X", href: "https://x.com", icon: XIcon },
  { name: "Instagram", href: "https://www.instagram.com", icon: InstagramIcon },
  { name: "LinkedIn", href: "https://www.linkedin.com", icon: LinkedInIcon },
  { name: "YouTube", href: "https://www.youtube.com", icon: YouTubeIcon },
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />

      <div className="site-footer__inner">
        <div className="site-footer__hero">
          <div className="site-footer__story">
            <p className="site-footer__kicker">
              Software outsourcing · Digital transformation
            </p>
            <h2>Build faster. Scale with confidence.</h2>
            <p>
              Restart Technology is your trusted partner for software
              outsourcing and digital transformation. We build high-performance
              web and mobile applications with global expert teams, helping
              companies cut costs, innovate faster, and scale with confidence.
              Your success drives everything we do.
            </p>
            <a
              className="site-footer__cta"
              href="mailto:info@restart-technology.com"
            >
              Let&apos;s talk
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="site-footer__visual">
            <img src="/assets/footer/1766569978974370.png" alt="" />
          </div>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <img
              src="/fullwhitelogo.svg"
              alt="Restart Technology"
              width={190}
              height={32}
            />
            <h3>Install the app</h3>
            <p>From App Store or Google Play</p>
            <a href="https://play.google.com" rel="noreferrer" target="_blank">
              <img
                src="/assets/footer/google-play.jpg"
                alt="Get it on Google Play"
              />
            </a>
          </div>

          <nav className="site-footer__nav" aria-label="Footer">
            <h3>Explore</h3>
            <ul>
              <li>
                <Link to="/products">Home</Link>
              </li>
              <li>
                <a
                  href="https://restart-technology.com"
                  rel="noreferrer"
                  target="_blank"
                >
                  Clients
                </a>
              </li>
              <li>
                <a href="mailto:info@restart-technology.com">Contact us</a>
              </li>
            </ul>
          </nav>

          <section
            className="site-footer__offices"
            aria-labelledby="offices-heading"
          >
            <h3 id="offices-heading">Offices</h3>
            <article>
              <span>Cairo</span>
              <p>Apt. 304, 107 El-Merghany St., Heliopolis, Egypt</p>
            </article>
            <article>
              <span>Dubai</span>
              <p>Concord Tower, 9th Floor, Media City, UAE</p>
            </article>
          </section>

          <section
            className="site-footer__connect"
            aria-labelledby="connect-heading"
          >
            <h3 id="connect-heading">Connect</h3>
            <a
              className="site-footer__mail"
              href="mailto:info@restart-technology.com"
            >
              info@restart-technology.com
            </a>
            <ul className="site-footer__social">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    rel="noreferrer"
                    target="_blank"
                    aria-label={social.name}
                  >
                    <social.icon />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="site-footer__bottom">
          <p>
            © 2026 All rights reserved to Restart Technology.
            <br /> Powered by{" "}
            <a
              className="site-footer__credit"
              href="mailto:ahmedmostafakhedr31@gmail.com"
            >
              Ahmed Mostafa
            </a>
          </p>
          <img
            className="site-footer__payments"
            src="/assets/footer/payment-method.png"
            alt="Visa, Mastercard, Maestro, and American Express"
          />
        </div>
      </div>
    </footer>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.5 4h2.3l-5.7 6.5L21 20h-5.2l-4-5.3L7 20H4.7l6.1-7L3.5 4H8.8l3.6 4.8L17.5 4Zm-1 14.4h1.3L7.6 5.5H6.2l10.3 12.9Z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5ZM17 7.75a.75.75 0 1 1-.75.75.75.75 0 0 1 .75-.75Z"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.5 9H4v11h2.5V9ZM5.3 3.5A1.8 1.8 0 1 0 5.3 7a1.8 1.8 0 0 0 0-3.5ZM20 20h-2.5v-5.6c0-1.8-.8-2.4-1.8-2.4s-2 .8-2 2.5V20H11.2V9H13.7v1.5c.6-1 1.8-1.8 3.4-1.8 2.4 0 4 1.5 4 4.8V20Z"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M23 8.5a4 4 0 0 0-2.8-2.8C18.4 5.3 12 5.3 12 5.3s-6.4 0-8.2.4A4 4 0 0 0 1 8.5 42 42 0 0 0 1 15.5a4 4 0 0 0 2.8 2.8c1.8.4 8.2.4 8.2.4s6.4 0 8.2-.4A4 4 0 0 0 23 15.5 42 42 0 0 0 23 8.5ZM10 14.8V9.2l5.2 2.8L10 14.8Z"
      />
    </svg>
  );
}
