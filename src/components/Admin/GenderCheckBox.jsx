import React from 'react';
import styled from 'styled-components';

const GenderCheckBox = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <div className="tabs">
          <input type="radio" id="radio-1" name="tabs" defaultChecked />
          <label className="tab" htmlFor="radio-1">Men</label>
          <input type="radio" id="radio-2" name="tabs" />
          <label className="tab" htmlFor="radio-2">Women</label>
          <input type="radio" id="radio-3" name="tabs" />
          <label className="tab" htmlFor="radio-3">Unisex</label>
          <span className="glider" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    padding: 0px;
  }
  .tabs {
    display: flex;
    position: relative;
    background-color: #fffefc;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.15), 0 6px 12px 0 rgba(0, 0, 0, 0.15);
    padding: 0.75rem;
    border-radius: 99px;
    width: fit-content;
  }

  .tabs * {
    z-index: 2;
  }

  .container input[type="radio"] {
    display: none;
  }

  .tab {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 22px;
    width: 60px;
    font-size: 0.85rem; /* Font size for desktop */
    color: black;
    font-weight: 500;
    border-radius: 99px;
    cursor: pointer;
    transition: color 0.15s ease-in;
    padding-top: 8px;
  }

  .container input[type="radio"]:checked + label {
    color: var(--background-color);
  }

  .container input[type="radio"]:checked + label > .notification {
    background-color: var(--accent-color);
    color: #fff;
    margin: 0px;
  }

  .container input[id="radio-1"]:checked ~ .glider {
    transform: translateX(0);
  }

  .container input[id="radio-2"]:checked ~ .glider {
    transform: translateX(100%);
  }

  .container input[id="radio-3"]:checked ~ .glider {
    transform: translateX(200%);
  }

  .glider {
    position: absolute;
    display: flex;
    height: 30px;
    width: 60px;
    background-color: var(--accent-color);
    z-index: 1;
    border-radius: 99px;
    transition: 0.25s ease-out;
  }

  @media (max-width: 1024px) {
    .tabs {
      transform: scale(0.9); /* Adjusted scale for tablets */
      padding: 0.6rem; /* Adjusted padding for tablets */
    }

    .tab {
      font-size: 0.9rem; /* Adjusted font size for tablets */
      height: 28px;
      width: 56px;
    }

    .glider {
      height: 28px;
      width: 56px;
    }
  }

  @media (max-width: 700px) {
    .tabs {
      transform: scale(0.9); /* Adjusted scale for mobiles */
      padding: 1rem; /* Adjusted padding for mobiles */
      padding-left: 25px;
      margin-left: -5px;
      }
      label.tab{
        font-size: medium;
        margin-right: 20px;
    }
    .tab {
      font-size: 0.8rem; /* Adjusted font size for mobiles */
      height: 25px;
      width: 50px;
    }

    .glider {
      height: 35px;
      width: 70px;
      margin-left: -10px;
    }
  }
`;

export default GenderCheckBox;
