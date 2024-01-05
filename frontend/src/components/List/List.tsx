import React, { useMemo } from 'react';
import { EmptyData, Preloader } from '../';

import styles from './List.module.scss';

interface ListProps {
  isLoading?: boolean;
  textLoader?: string;
  textEmpty?: string;
  count: number;
  children: React.ReactNode;
  errorMessage?: string;
}

function List(props: ListProps) {
  const errorMessage = useMemo(() => {
    if (props.errorMessage) return props.errorMessage;
    if (!props.count) {
      return props.textEmpty ?? 'List is empty';
    }
    return '';
  }, [props.errorMessage, props.count]);

  return (
    <>
      {props.isLoading ? (
        <div className={styles['empty']}>
          <Preloader text={props.textLoader} />
        </div>
      ) : (
        <>
          {errorMessage.length > 0 ? (
            <EmptyData text={errorMessage} className={styles['empty']} />
          ) : (
            props.children
          )}
        </>
      )}
    </>
  );
}

export default List;
