import React, { useEffect, useMemo, useState } from 'react';
import { useComponentVisible } from '../../hooks';
import { BtnAction, Input, Preloader } from '../';

import { MdClose, MdDone } from 'react-icons/md';

import styles from './EditableText.module.scss';

enum classNameValues {
  ONE = 'form',
  TWO = 'loader-block',
  THREE = 'text',
  FOUR = 'input',
  FIVE = 'error-message',
  SIX = 'control-panel',
  SEVEN = 'btn-block',
  EIGHT = 'form-container',
  NINE = 'text-block',
  TEN = 'placeholder'
}

interface EditableTextProps {
  value: string;
  onSubmit: (value: string) => Promise<boolean>;
  classNameObj?: { [key in classNameValues]?: string };
  title?: string;
  isActive?: boolean;
  onVisibleEdit?: () => void;
  onHideEdit?: () => void;
  postText?: string;
  postIcon?: React.ReactElement;
  emptyPlaceholder?: string;
}

function EditableText(props: EditableTextProps) {
  const {
    ref,
    isComponentVisible: isInputTitleVisible,
    setIsComponentVisible: setIsInputTitleVisible
  } = useComponentVisible(!!props.isActive, 'mousedown');

  const [isLoaderGoing, setIsLoaderGoing] = useState(false);
  const [afterLoadingIcon, setAfterLoadingIcon] = useState(false);
  const [value, setValue] = useState(props.value);
  const [valueError, setValueError] = useState(false);

  const classNames = useMemo(() => {
    const defaultClassNames: { [key: string]: string } = {};
    for (const key in classNameValues) {
      const value = classNameValues[key as keyof typeof classNameValues];
      defaultClassNames[value] = styles[value];
    }

    if (props.classNameObj) {
      Object.entries(props.classNameObj).forEach((arr) => {
        defaultClassNames[arr[0]] += ` ${arr[1]}`;
      });
    }

    return defaultClassNames;
  }, [props.classNameObj]);

  const onSubmitHandler = async () => {
    if (!valueError) {
      setIsInputTitleVisible(false);
      setIsLoaderGoing(true);
      const answer = await props.onSubmit(value.trim());
      setIsLoaderGoing(false);
      if (answer) {
        setAfterLoadingIcon(true);
        setTimeout(() => setAfterLoadingIcon(false), 1500);
      }
    }
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  useEffect(() => {
    setValueError(!props.emptyPlaceholder && value.trim().length === 0);
  }, [value]);

  useEffect(() => {
    if (!isInputTitleVisible) {
      setValue(`${props.value}`);
      if (props.onHideEdit) props.onHideEdit();
    } else {
      if (props.onVisibleEdit) props.onVisibleEdit();
    }
  }, [isInputTitleVisible]);

  return (
    <div className={classNames['form-container']}>
      <div ref={ref} className={classNames['form']}>
        {!isInputTitleVisible ? (
          <div className={classNames['text-block']} onClick={() => setIsInputTitleVisible(true)}>
            {props.emptyPlaceholder && !value.length ? (
              <div className={classNames['placeholder']}>{props.emptyPlaceholder}</div>
            ) : (
              <>
                <div className={classNames['text']}>{value}</div>
                {props.postText && <div className={styles['post-text']}>{props.postText}</div>}
                {props.postIcon && <div className={styles['post-icon']}>{props.postIcon}</div>}
              </>
            )}
          </div>
        ) : (
          <>
            <Input
              className={classNames['input']}
              autoFocus
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') onSubmitHandler();
              }}
            />
            {valueError && (
              <span className={classNames['error-message']}>
                {props.title ? `${props.title} title` : 'Value'} can&apos;t be empty
              </span>
            )}
            <div className={classNames['control-panel']}>
              <BtnAction image={MdDone} btnClassType="first" onClick={() => onSubmitHandler()} />
              <BtnAction
                image={MdClose}
                btnClassType="first"
                onClick={() => setIsInputTitleVisible(false)}
              />
            </div>
          </>
        )}
      </div>
      <div className={classNames['loader-block']}>
        {isLoaderGoing ? <Preloader text="" /> : afterLoadingIcon && <MdDone />}
      </div>
    </div>
  );
}

export default EditableText;
