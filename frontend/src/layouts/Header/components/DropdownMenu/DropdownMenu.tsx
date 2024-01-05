import React, { useMemo } from 'react';
import { useComponentVisible } from '../../../../hooks';
import { BoxWithShadow } from '../../../../components';

import { MdExpandMore } from 'react-icons/md';

import styles from './DropdownMenu.module.scss';

interface DropdownMenuProps {
  text?: string;
  menuContent: ({ onCloseHandler }: { onCloseHandler: () => void }) => JSX.Element;
  side?: 'left' | 'right';
  node?: React.ReactNode;
}

function DropdownMenu(props: DropdownMenuProps) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false,
    'mousedown'
  );

  const dropdownClasses = useMemo(() => {
    let defaultClasses = styles['dropdown'];
    if (props.side) defaultClasses += ` ${styles[props.side]}`;
    else defaultClasses += ` ${styles['left']}`;
    return defaultClasses;
  }, [props.side]);

  return (
    <div className={styles['dropdown-block']} ref={ref}>
      {props.text ? (
        <div
          className={`${styles['btn']} ${isComponentVisible && styles['active']}`}
          onClick={() => setIsComponentVisible((prev) => !prev)}>
          {props.text}
          <MdExpandMore className={styles['arrow-icon']} />
        </div>
      ) : (
        <div className={styles['node']} onClick={() => setIsComponentVisible((prev) => !prev)}>
          {props.node}
        </div>
      )}
      {isComponentVisible && (
        <BoxWithShadow className={dropdownClasses}>
          <props.menuContent onCloseHandler={() => setIsComponentVisible(false)} />
        </BoxWithShadow>
      )}
    </div>
  );
}

export default DropdownMenu;
