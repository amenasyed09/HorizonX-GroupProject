import React, { useState } from 'react';
import './DiscoverSection.css';
import svg1 from '../../assets/spot-agent.svg';
import svg2 from '../../assets/spot-cash.svg';
import svg3 from '../../assets/spot-calculator.svg';
import svg4 from '../../assets/spot-money.svg';
import svg5 from '../../assets/spot-rent.svg';
import svg6 from '../../assets/spot-arrows.svg';
import svg7 from '../../assets/spot-profile.svg';
import svg8 from '../../assets/spot-pending.svg';
import svg9 from '../../assets/spot-house.svg';
import svg10 from '../../assets/spot-sell.svg';




const DiscoverSection = () => {
  const [activeButton, setActiveButton] = useState('buying');

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const buyingItems = [
    {
      title: 'Get professional help in your home search',
      img: svg1,
      paragraph: 'We\'ll connect you with a local agent who can explore neighborhoods, find a home that fits your needs, and stay on budget.',
      link: '/professional-help',
      linkText: 'Connect with an agent'
    },
    {
      title: 'Find out how much you can afford',
      img: svg2,
      paragraph: 'We\'ll help you estimate your budget range. Set up your buyer profile to assist in your search.',
      link: '/affordability',
      linkText: 'Try our affordability calculator'
    },
    {
      title: 'Understand your monthly cost',
      img: svg3,
      paragraph: 'Get an in-depth look at your monthly and closing costs.',
      link: '/monthly-costs',
      linkText: 'Try our mortgage calculator'
    },
    {
      title: 'Get help with your down payment',
      img: svg4,
      paragraph: 'You may be able to buy a home with just 3.5% down.',
      link: '/down-payment',
      linkText: 'Find down payment help'
    }
  ];

  const rentingItems = [
    {
      title: 'Rent with the option to buy',
      img: svg5,
      paragraph: 'Lease from Home Partners of America with an option to buy.',
      link: '/rental-program',
      linkText: 'Check Program availability'
    },
    {
      title: "Find out if it's better to rent or buy",
      img: svg6,
      paragraph: 'Determine if buying or renting makes more financial sense.',
      link: '/rent-vs-buy',
      linkText: 'Try our rent or buy calculator'
    },
    {
      title: 'Save time with a renter profile',
      img: svg7,
      paragraph: 'Create a free renter profile to share with any landlord.',
      link: '/create-profile',
      linkText: 'Create a profile'
    }
  ];
  const sellingItems = [
    {
      title: 'Get a home valuation',
      img: svg8,
      paragraph: 'Find out how much your home is worth.',
      link: '/home-valuation',
      linkText: 'Get a valuation'
    },
    {
      title: 'List your home with an expert',
      img: svg9,
      paragraph: 'Connect with a local agent to list your home.',
      link: '/list-your-home',
      linkText: 'Find an agent'
    },
    {
      title: 'Understand selling costs',
      img: svg10,
      paragraph: 'Get insights into the costs of selling your home.',
      link: '/selling-costs',
      linkText: 'See costs'
    }
  ];

  const renderGridItems = () => {
    const items = activeButton === 'buying' ? buyingItems : (activeButton === 'renting' ? rentingItems : sellingItems);
    return items.map((item, index) => (
      <div className="grid-item" key={index}>
        <h4 className="grid-title">{item.title}</h4>
        <img src={item.img} alt={item.title} />
        <p className="grid-paragraph">{item.paragraph}</p>
        {item.link && <a href={item.link} className="grid-link">{item.linkText}</a>}
      </div>
    ));
  };

  return (
    <div className="discover-container">
      <h2 className="h2-title">Discover how we can help</h2>
      <div className="button-container">
        <button
          className={`buying-button ${activeButton === 'buying' ? 'active' : ''}`}
          onClick={() => handleButtonClick('buying')}
        >
          Buying
        </button>
        <button
          className={`renting-button ${activeButton === 'renting' ? 'active' : ''}`}
          onClick={() => handleButtonClick('renting')}
        >
          Renting
        </button>
        <button
          className={`selling-button ${activeButton === 'selling' ? 'active' : ''}`}
          onClick={() => handleButtonClick('selling')}
        >
          Selling
        </button>
      </div>
      {(activeButton === 'buying' || activeButton === 'renting' || activeButton === 'selling') && (
        <div className={`grid-container ${activeButton}`}>
          {renderGridItems()}
        </div>
      )}
    </div>
  );
};

export default DiscoverSection;
