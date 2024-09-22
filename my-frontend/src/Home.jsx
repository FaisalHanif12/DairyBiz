import React from 'react';
import './Home.css'; // Importing stylesheet for Home component

// Home component definition
const Home = () => {
  const currentYear = new Date().getFullYear(); // Gets the current year for the copyright in the footer

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
          </p> // Description of the feature
        </div>
        <div className="feature">
          <h2 className="featureTitle">Farm Fresh</h2> 
          <p className="featureDescription">
            From our farm to your table, enjoy the fresh dairy products every day.
          </p> // Description for the Farm Fresh feature
        </div>
        <div className="feature">
          <h2 className="featureTitle">Sustainable Practices</h2> 
          <p className="featureDescription">
            We believe in sustainable farming, ensuring our cows are happy and healthy.
          </p> // Description of sustainable practices
        </div>
      </section>
      <footer className="footer">
        <div className="ownerInfo">
          <h3 className="ownerTitle">Farm Owners</h3> 
          <p className="ownerName">Maher Rizwan</p> 
          <p className="ownerContact">Contact: +966533528462</p> 
          <p className="ownerName">Maher Haroon</p> // Another owner name
          <p className="ownerContact">Contact: 03107865430</p> 
          <p className="ownerName">Maher Ans</p> // Third owner name
          <p className="ownerContact">Contact: 03184594874</p> 
        </div>
        <p className="footerText">&copy; {currentYear} Maher Dairy Farm. All rights reserved.</p> 
      </footer>
    </div>
  );
};

export default Home; // Exporting Home component
