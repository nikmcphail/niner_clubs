export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">

      <h1 className="home-title">Niner Clubs</h1>

      <h2 style={{'fontStyle': 'italic'}}className="home-subtitle">Finding the <span style={{ color: 'var(--uncc-gold)' }}>perfect</span> club, all in <span style={{ color: 'var(--uncc-gold)' }}>one</span> place</h2>
      
      <button className="about-us-button">About Us</button>

      <div className="info-box">
          <p>Welcome to our website! We are dedicated to providing the best service possible. Our team is committed to excellence, and we strive to exceed your expectations.</p>
          <p>Thank you for visiting our website!</p>
          <p>- The Niner Clubs Team</p>
      </div>
    </div>
  );
}
/*
* @TODO: figure out why the button about us is not centered
* @TODO: change the background color and text color
* @TODO: change the text to show group members, our mission, etc.
*/