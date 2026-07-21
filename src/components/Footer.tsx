import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <span className="logo-mark">◎</span> Nimbus
          </Link>
          <p>Work, reimagined for actual humans.</p>
          <div className="socials">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">◍</a>
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Dribbble">●</a>
          </div>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/blog">Blog</Link>
            <a href="#">Changelog</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#">Docs</a>
            <a href="#">Help center</a>
            <a href="#">Community</a>
            <a href="#">Status</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
            <a href="#">GDPR</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2019 Nimbus, Inc. Made with 💜 and too much cold brew.</span>
        <span>Designed like it’s peak 2010s.</span>
      </div>
    </footer>
  )
}
