import React from 'react';
import './Home.css'; // Make sure the path is correct

const Home = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="container">
      <header className="header">
        <h1 className="headerTitle">Welcome to Maher Dairy Farms</h1>
        <p className="headerSubtitle">Your trusted source for fresh dairy products.</p>
      </header>
      <section className="features">
        <div className="feature">
          <h2 className="featureTitle">Quality Milk</h2>
          <p className="featureDescription">
            Our farm provides the highest quality, nutrient-rich milk with a taste you'll love.
          </p>
        </div>
        <div className="feature">
          <h2 className="featureTitle">Farm Fresh</h2>
          <p className="featureDescription">
            From our farm to your table, enjoy the fresh dairy products every day.
          </p>
        </div>
        <div className="feature">
          <h2 className="featureTitle">Sustainable Practices</h2>
          <p className="featureDescription">
            We believe in sustainable farming, ensuring our cows are happy and healthy.
          </p>
        </div>
      </section>
      <footer className="footer">
        <div className="ownerInfo">
          <h3 className="ownerTitle">Farm Owners</h3>
          <p className="ownerName">Maher Rizwan</p>
          <p className="ownerContact">Contact: +966533528462</p>
          <p className="ownerName">Maher Haroon</p>
          <p className="ownerContact">Contact: 03107865430</p>
          <p className="ownerName">Maher Ans</p>
          <p className="ownerContact">Contact: 03184594874</p>
        </div>
        <p className="footerText">&copy; {currentYear} Maher Dairy Farm. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
