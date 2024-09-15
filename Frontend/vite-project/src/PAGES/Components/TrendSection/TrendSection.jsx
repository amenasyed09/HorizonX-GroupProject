import React from 'react';
import './TrendSection.css';
import trendImg from '../../assets/trendsImg.jpg'
const TrendsSection = () => {
  return (
    <div className="trends-section" id='trends'>
      <h3 className='trend-title'>Trends</h3>
      <p className='trend-paragraph'>
      The 10 Markets That Could See the Biggest Home <br></br> Affordability Gains as Mortgage Rates Drop
      </p>
      <button className='read-button'>Read Article</button>
      <img src={trendImg} alt="Trends" />
      
      {/* Add more trends content here */}
    </div>
  );
};

export default TrendsSection;
