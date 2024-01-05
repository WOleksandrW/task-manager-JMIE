import { useCallback, useMemo } from 'react';
import { useComponentVisible } from '../../hooks';

import { MdKeyboardArrowDown } from 'react-icons/md';

import styles from './SelectPanel.module.scss';

export type Option = {
  value: string;
  text: string;
};

interface SelectPanelProps {
  options: Option[];
  onSelect: (value: string) => void;
  selectStyleType?: 'accent';
  selectedItem: number;
  isSelectedHide?: boolean;
  placeholder?: string;
  emptyMessage?: string;
}

function SelectPanel(props: SelectPanelProps) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(
    false,
    'mousedown'
  );

  const displayText = useMemo(() => {
    if (props.selectedItem >= 0) return props.options[props.selectedItem].text;
    if (props.placeholder) return props.placeholder;
    return 'Select item';
  }, [props.options, props.selectedItem, props.placeholder]);

  const selectClassName = useMemo(() => {
    let str = styles['select'];
    if (props.selectStyleType) str += ` ${styles['accent']}`;
    return str;
  }, [props.selectStyleType]);

  const options = useMemo(() => {
    let array = props.options;
    if (props.isSelectedHide) {
      array = array.filter(
        (option) =>
          props.selectedItem < 0 || option.value !== props.options[props.selectedItem].value
      );
    }
    return array;
  }, [props.options, props.isSelectedHide, props.selectedItem]);

  const onClickHandler = useCallback((option: Option) => {
    setIsComponentVisible(false);
    props.onSelect(option.value);
  }, []);

  return (
    <div className={styles['select-panel']} ref={ref}>
      <div className={selectClassName} onClick={() => setIsComponentVisible(!isComponentVisible)}>
        <div className={styles['text']}>{displayText}</div>
        <span className={styles['icon']}>
          <MdKeyboardArrowDown />
        </span>
      </div>
      {isComponentVisible && (
        <div className={styles['option-list']}>
          {options.length > 0
            ? options.map((option, idx) => (
                <div className={styles['option']} key={idx} onClick={() => onClickHandler(option)}>
                  {option.text}
                </div>
              ))
            : props.emptyMessage && (
                <div className={styles['empty-message']}>{props.emptyMessage}</div>
              )}
        </div>
      )}
    </div>
  );
}

export default SelectPanel;
