import React from 'react';
import './LoanSection.css';
import manImg from '../../assets/manImg.jpg';

const LoanSection = () => {
  return (
    <div className='loan-container'>
        <img src={manImg} alt="Man with a home loan" />
        <div className='text-content'>
            <h1 className='loan-title'>
                Need a home loan? Get pre-approved
            </h1>
            <p className='loan-paragraph'>
                Find a lender who can offer competitive mortgage rates and help you with pre-approval.
            </p>
            <button className='pre-approved-button'>
                Get pre-approved now
            </button>
        </div>
    </div>
  );
}

export default LoanSection;
