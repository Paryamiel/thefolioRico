import React from 'react';

function About() {
  return (
    <main className="page">
      <section className="card">
        <h2>About Me & My Passion</h2>
        <p>I am <b>Rico K. Biete</b>. I enjoy art, graphic design, and gaming. I balance work and school while developing my skills in creative design.</p>
        
        <img 
          src="/images/drawing.jpg" 
          alt="Traditional Sketch" 
          style={{ width: '100%', borderRadius: '12px', margin: '20px 0' }} 
        />
        
        <blockquote style={{ borderLeft: '5px solid var(--green)', paddingLeft: '20px', fontStyle: 'italic' }}>
          "Art washes away from the soul the dust of everyday life." — Pablo Picasso
        </blockquote>
      </section>

      <section className="card">
        <h3>My Journey Timeline</h3>
        <ol style={{ marginLeft: '20px', marginBottom: '20px' }}>
          <li>2020: Began exploring pencil sketching.</li>
          <li>2023: Started Digital Art & Photoshop.</li>
          <li>2026: Launched this Web Portfolio.</li>
        </ol>
        
        <img 
          src="/images/kayle.jpg" 
          alt="League of Legends Fanart" 
          style={{ width: '100%', borderRadius: '12px' }} 
        />
      </section>
    </main>
  );
}

export default About;