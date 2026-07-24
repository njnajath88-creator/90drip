export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#" className="footer-logo">
              90drip
            </a>
          </div>
          <div>
            <h4 className="footer-col-title">Shop</h4>
            <ul className="footer-links">
              <li>
                <a href="#shop">New Arrivals</a>
              </li>
              <li>
                <a href="#shop">Bestsellers</a>
              </li>
              <li>
                <a href="#shop">Sale</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">Customer Care</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Size Guide</a>
              </li>
              <li>
                <a href="#">Shipping Info</a>
              </li>
              <li>
                <a href="#">Returns</a>
              </li>
              <li>
                <a href="/admin">Admin Portal</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="footer-col-title">About</h4>
            <ul className="footer-links">
              <li>
                <a href="#">Our Story</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 90Drip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
