import React from 'react';
import styled from 'styled-components';

const MyPhoneNumberCard = ({text}) => {
  return (
    <StyledWrapper>
      <div className="uiverse">
        <span className="tooltip">Assistant</span>
        <span>
          {text}
        </span>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .uiverse {
    position: relative;
    background:rgb(71, 250, 196);
    color: #000;
    padding: 15px;
    margin: 0px;
    border-radius: 10px;
    width: 80px;
    height: 13px;
    font-size: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .tooltip {
    position: absolute;
    top: 0;
    font-size: 14px;
    background: #ffffff;
    color: #ffffff;
    padding: 5px 8px;
    border-radius: 5px;
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .tooltip::before {
    position: absolute;
    content: "";
    height: 8px;
    width: 8px;
    background: #ffffff;
    bottom: -3px;
    left: 50%;
    transform: translate(-50%) rotate(45deg);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .uiverse:hover .tooltip {
    top: -45px;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  svg:hover span,
  svg:hover .tooltip {
    text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.1);
  }

  .uiverse:hover,
  .uiverse:hover .tooltip,
  .uiverse:hover .tooltip::before {
    background: linear-gradient(320deg, rgb(3, 77, 146), rgb(0, 60, 255));
    color: #ffffff;
  }`;

export default MyPhoneNumberCard;
