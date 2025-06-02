import React from 'react';

function AboutPage() {
  return (
    <div className="app">
      <div className="container">
        <div className="about-page">
          <div className="about-header">
            <h1>About OKR Tracker</h1>
          </div>
          
          <div className="about-content">
            <div className="about-image">
              <img 
                src="https://cdn.jsdelivr.net/gh/nahumyamin/okr-tracker-assets/ChatGPT Image Jun 2, 2025 at 05_46_18 PM.png" 
                alt="Nahum - Creator of OKR Tracker" 
              />
            </div>
            
            <div className="about-text">
              <p>
                Hi, my name is Nahum. I've created this simple web application as a fun weekend project to do some code vibing. My passion for OKR tracking started after reading the inspiring book <em>Measure What Matters: How Google, Bono, and the Gates Foundation Rock the World with OKRs</em> by John Doerr. It really opened my eyes to how powerful structured goals can be when it comes to driving focus and meaningful progress.
              </p>
              
              <p>
                I'm always on the hunt for ways to improve my productivity — reading, experimenting, and learning about different methods and systems to stay focused and move the needle where it matters most.
              </p>
              
              <p>
                This project was not just about building something useful, but also about challenging myself to explore how far AI capabilities have come. It was a fun exercise in seeing how the gap between design and code is getting smaller, faster, and a lot more exciting.
              </p>
              
              <p>
                Hope you find it useful — or at least inspiring enough to start your own experiments.
              </p>
              
              <p>
                If you have any questions or just want to connect, you can find me on <a href="https://www.linkedin.com/in/nahumyamin/" target="_blank" rel="noopener noreferrer">LinkedIn</a>. Always happy to chat about productivity, tech, or music.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage; 