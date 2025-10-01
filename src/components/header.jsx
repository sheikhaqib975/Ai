function Header() {
    (
        <nav className="navbar navbar-expand-lg fixed-top" style={customStyles.navbar}>
          <div className="container">
            <div className="navbar-brand d-flex align-items-center">
              <div style={customStyles.iconBox} className="me-2">
                <Icons.Stethoscope />
              </div>
              <span className="fw-bold fs-4">MediCare AI</span>
            </div>
            
            <button 
              className="navbar-toggler border-0" 
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{color: '#ffffff'}}
            >
              {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>

            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
              <ul className="navbar-nav ms-auto me-4">
                <li className="nav-item">
                  <a className="nav-link text-light" href="#services">Services</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-light" href="#specialties">Specialties</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-light" href="#how-it-works">How It Works</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-light" href="#contact">Contact</a>
                </li>
              </ul>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-light btn-sm" style={customStyles.outlineBtn}>
                  Sign In
                </button>
                <button className="btn btn-sm" style={customStyles.emeraldBtn}>
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>
        
);
      }
      export default Header;
