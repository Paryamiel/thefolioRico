import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import API from '../api';

function Home() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // --- 1. MONGODB POSTS STATE ---
  const [blogPosts, setBlogPosts] = useState([]);

  // Fetch the latest posts when the homepage loads
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await API.get('/posts');
        // Grab only the 3 most recent posts to show on the homepage
        setBlogPosts(response.data.slice(0, 3)); 
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      }
    };
    fetchLatestPosts();
  }, []);

  // --- 2. NAVIGATION CARDS ---
  const navCards = [
    {
      _id: "nav1", 
      title: "About Me",
      description: "Learn about my background as a working student.",
      linkTo: "/about",
      linkText: "Read More →"
    },
    {
      _id: "nav2",
      title: "Contact",
      description: "Get in touch or find helpful resources.",
      linkTo: "/contact",
      linkText: "Contact Me →"
    },
    {
      _id: "nav3",
      title: "Register",
      description: "Sign up for updates and design tips.",
      linkTo: "/register",
      linkText: "Sign Up →"
    }
  ];

  // --- PAC-MAN GAME LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let pacman, pellets, score, gameOver;
    let highScore = localStorage.getItem('pacmanHigh') || 0;
    let animationId; 

    function initGame() {
        pacman = { x: 200, y: 200, size: 12, dir: 'STOP', speed: 3 };
        pellets = [];
        score = 0;
        gameOver = false;
        for(let i=0; i<5; i++) spawnPellet();
        
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(gameLoop);
    }

    function spawnPellet() {
        pellets.push({ x: Math.random() * 360 + 20, y: Math.random() * 360 + 20 });
    }

    function gameLoop() {
        if (gameOver) { drawGameOver(); return; }

        ctx.fillStyle = "black"; 
        ctx.fillRect(0,0,400,400);

        if(pacman.dir === 'R') pacman.x += pacman.speed;
        if(pacman.dir === 'L') pacman.x -= pacman.speed;
        if(pacman.dir === 'U') pacman.y -= pacman.speed;
        if(pacman.dir === 'D') pacman.y += pacman.speed;

        // Wall collision
        if (pacman.x < pacman.size || pacman.x > 400 - pacman.size || 
            pacman.y < pacman.size || pacman.y > 400 - pacman.size) {
            gameOver = true;
            if(score > highScore) {
                highScore = score;
                localStorage.setItem('pacmanHigh', highScore);
            }
        }

        // Pellet collision
        for (let i = pellets.length - 1; i >= 0; i--) {
            let p = pellets[i];
            let dist = Math.hypot(pacman.x - p.x, pacman.y - p.y);
            if (dist < pacman.size + 5) {
                pellets.splice(i, 1); 
                score++;              
                pacman.speed += 0.2;  
                spawnPellet();        
            }
        }

        // Draw Pacman
        ctx.fillStyle = "yellow"; 
        ctx.beginPath();
        ctx.arc(pacman.x, pacman.y, pacman.size, 0.2*Math.PI, 1.8*Math.PI); 
        ctx.lineTo(pacman.x, pacman.y); 
        ctx.fill();

        // Draw Pellets
        ctx.fillStyle = "white"; 
        pellets.forEach(p => { 
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill(); 
        });

        // Draw Score
        ctx.font = "16px Arial"; 
        ctx.fillStyle = "white"; 
        ctx.fillText("Score: " + score, 10, 20);
        ctx.fillText("High Score: " + highScore, 270, 20);

        animationId = requestAnimationFrame(gameLoop);
    }

    function drawGameOver() {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0,0,400,400);
        ctx.fillStyle = "red";
        ctx.font = "bold 30px Arial";
        ctx.fillText("GAME OVER", 110, 180);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("Final Score: " + score, 145, 220);
        ctx.fillText("Press SPACE to Restart", 115, 250);
    }

    const handleKeyDown = (e) => {
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
            e.preventDefault();
        }
        if (gameOver && e.key === " ") initGame();
        if(e.key === "ArrowRight") pacman.dir = 'R';
        if(e.key === "ArrowLeft") pacman.dir = 'L';
        if(e.key === "ArrowUp") pacman.dir = 'U';
        if(e.key === "ArrowDown") pacman.dir = 'D';
    };

    window.addEventListener('keydown', handleKeyDown);
    initGame();

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        cancelAnimationFrame(animationId);
    };
  }, []); 

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-text">
          <h2>Welcome to My Student Portfolio</h2>
          <p>This website represents my journey in <b>Graphic Design</b>, <b>Traditional Art</b>, and my gaming passion in <b>League of Legends</b>.</p>
          <ul style={{ margin: '20px 0 20px 20px' }}>
            <li>Concept Art & Sketching</li>
            <li>Digital Character Design</li>
            <li>Frontend Web Development</li>
          </ul>
          <Link to="/about" className="btn">Explore My Work</Link>
        </div>
        <div className="hero-image">
          <img src="/images/rico-solo.jpg" alt="Rico K. Biete" />
        </div>
      </section>

      <section className="section">
        <h3>Mini Game: Pac-Man</h3>
        <p>Click inside and use Arrow Keys to move!</p>
        <canvas ref={canvasRef} width="400" height="400"></canvas>
      </section>

      {/* --- LATEST BLOG POSTS SECTION --- */}
      <section className="section card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--green)', paddingBottom: '10px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Latest Posts</h3>
          <Link to="/community" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 'bold' }}>View All →</Link>
        </div>
        
        {blogPosts.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#888', textAlign: 'center', padding: '20px 0' }}>
            No posts as of now. Check back later!
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {blogPosts.map((post) => (
              // We wrap the PostCard in a clickable div that navigates to the Community page!
              <div 
                key={post._id} 
                onClick={() => navigate('/community')} 
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Notice: We pass a disabled empty function for handleDelete so it doesn't break */}
                <PostCard post={post} handleDelete={() => {}} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- NAVIGATION CARDS SECTION --- */}
      <div className="section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {navCards.map((card) => (
          <div key={card._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginTop: 0 }}>{card.title}</h3>
            <p style={{ flexGrow: 1, color: '#555' }}>{card.description}</p>
            <Link to={card.linkTo} className="btn" style={{ textAlign: 'center', marginTop: '15px' }}>
              {card.linkText}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Home;