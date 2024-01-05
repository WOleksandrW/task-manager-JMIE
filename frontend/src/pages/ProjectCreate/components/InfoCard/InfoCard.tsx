import React from 'react';

import './InfoCard.scss';

interface InfoCardProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  imgBackground?: string;
}

function InfoCard(props: InfoCardProps) {
  return (
    <div className="info-card">
      <div className="picture-container" style={{ backgroundColor: props.imgBackground }}>
        <img className="picture" src={props.src} alt={props.alt} />
      </div>

      <div className="info">
        <p className="title">{props.title}</p>
        <p className="description">{props.description}</p>
      </div>
    </div>
  );
}

export default InfoCard;
