import React from 'react';
import styled from 'styled-components';

const Loader = () => {
    return (
        <StyledWrapper>
            <div className="card">
                <div className="loader">
                    <p>Your order is </p>
                    <div className="words">
                        <span className="word"> placed !</span>
                        <span className="word"> confirmed !</span>
                    </div>
                </div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .card {
    /* color used to softly clip top and bottom of the .words container */
    --bg-color: var(--background-color);
    background-color: var(--bg-color);
    padding: 1rem 2rem;
    border-radius: 1.25rem;
    border: none;
    box-shadow: none;
    padding-top: 0rem;
  }
  .loader {
    color: rgb(124, 124, 124);
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 25px;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    height: 40px;
    padding: 10px 10px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border-radius: 8px;
  }

  .words {
    overflow: hidden;
    position: relative;
  }
  .words::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      var(--bg-color) 10%,
      transparent 30%,
      transparent 70%,
      var(--bg-color) 90%
    );
    z-index: 20;
  }

  .word {
    display: block;
    height: 100%;
    padding-left: 6px;
    color: var(--accent-color);
    animation: spin_4991 2s linear forwards;
  }

  @keyframes spin_4991 {
     0% {
    transform: translateY(0%);
  }
    25%{
    transform: translateY(0%);
    }
    100% {
    transform: translateY(-100%);
}
  }
@media screen and (max-width: 468px) {
    .loader {
        font-size: 20px;
    }
}
`;

export default Loader;
