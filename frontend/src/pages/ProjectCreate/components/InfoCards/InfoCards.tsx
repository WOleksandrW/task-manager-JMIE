import React, { useMemo } from 'react';
import { colorsData } from '../../../../data';
import { InfoCard } from '../';

import Kanban from '../../../../assets/icons/kanban.svg';
import TeamManaged from '../../../../assets/icons/team-managed.svg';

import styles from './InfoCards.module.scss';

const { COLOR_BG } = colorsData;

interface InfoCardsProps {
  className?: string;
}

function InfoCards(props: InfoCardsProps) {
  const className = useMemo(() => {
    let str = styles['info-cards'];
    if (props.className) str += ` ${props.className}`;
    return str;
  }, [props.className]);

  const cards = useMemo(
    () => [
      {
        blockTitle: 'Template',
        infoTitle: 'Kanban',
        infoImg: Kanban,
        infoAlt: 'Kanban',
        infoDescription:
          'Get a visual representation of the project and work on it using tasks on the functional board.'
      },
      {
        blockTitle: 'Type',
        infoTitle: 'Managed by a team',
        infoImg: TeamManaged,
        infoAlt: 'Team Managed',
        infoDescription: 'Manage your own workflows and practices in an independent space.',
        imgBackground: COLOR_BG.lightPurple
      }
    ],
    []
  );

  return (
    <div className={className}>
      {cards.map((card, idx) => (
        <div key={`info-card-${idx}`} className={styles['block']}>
          <p className={styles['title']}>{card.blockTitle}</p>

          <InfoCard
            title={card.infoTitle}
            description={card.infoDescription}
            src={card.infoImg}
            alt={card.infoAlt}
            imgBackground={card.imgBackground}
          />
        </div>
      ))}
    </div>
  );
}

export default InfoCards;
