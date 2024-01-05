import React, { useMemo } from 'react';

import { AiFillInstagram, AiFillYoutube, AiOutlineTwitter } from 'react-icons/ai';
import { BiLogoFacebook } from 'react-icons/bi';

import styles from './Footer.module.scss';

function Footer() {
  const socials = useMemo(
    () => [
      {
        icon: AiFillInstagram,
        link: 'https://www.instagram.com/'
      },
      {
        icon: BiLogoFacebook,
        link: 'https://www.facebook.com/'
      },
      {
        icon: AiOutlineTwitter,
        link: 'https://twitter.com/'
      },
      {
        icon: AiFillYoutube,
        link: 'https://youtube.com/'
      }
    ],
    []
  );

  return (
    <footer className={styles['footer']}>
      <div className={styles['inner']}>
        <div className={styles['title-block']}>
          <div className={styles['logo']}></div>
          <h1 className={styles['title']}>
            <span className={styles['title-letter']}>J</span>ust
            <span className={styles['title-letter']}>M</span>ake
            <span className={styles['title-letter']}>I</span>t
            <span className={styles['title-letter']}>E</span>asier
          </h1>
        </div>
        <div className={styles['socials-block']}>
          <h3 className={styles['block-title']}>Socials:</h3>
          <ul className={styles['socials']}>
            {socials.map((social, idx) => (
              <li key={`social-${idx}`} className={styles['social']}>
                <a
                  href={social.link}
                  className={styles['social-link']}
                  target="_blank"
                  rel="noreferrer">
                  <social.icon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
