import styles from './ComponentWithMessage.module.scss';

interface ComponentWithErrorProps {
  errorMessage?: string;
  children: React.ReactNode;
}

function ComponentWithMessage(props: ComponentWithErrorProps) {
  return (
    <div className={styles['component-block']}>
      {props.children}
      {props.errorMessage && <p className={styles['message']}>{props.errorMessage}</p>}
    </div>
  );
}

export default ComponentWithMessage;
