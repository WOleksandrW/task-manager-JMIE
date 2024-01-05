import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { fetchSignIn, setMessageSign } from '../../../../redux/signInUpSlice';
import { Button, Input } from '../../../../components';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

interface SignInProps {
  styles?: { [key: string]: string };
}

function SignIn(props: SignInProps) {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const submitHandler = useCallback(async () => {
    const data = {
      email,
      password
    };

    const answer = await dispatch(fetchSignIn(data));
    if (answer.meta.requestStatus === 'fulfilled') navigate('/');
    setTimeout(() => {
      dispatch(setMessageSign(''));
    }, 1500);
  }, [email, password]);

  return (
    <form
      className={props.styles?.['form']}
      onSubmit={(event) => {
        event.preventDefault();
        submitHandler();
      }}>
      <Input
        className={props.styles?.['input']}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <div className={props.styles?.['input-block']}>
        <Input
          className={props.styles?.['input']}
          type={isPasswordVisible ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button
          className={props.styles?.['btn-eye']}
          type="button"
          onClick={() => setIsPasswordVisible((prev) => !prev)}>
          {isPasswordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
        </button>
      </div>
      <Button className={props.styles?.['btn']} type="submit" styleButton="primary">
        Sign in
      </Button>
      <Link className={props.styles?.['link']} to="/sign-up">
        Don&apos;t have an account yet? Sign up
      </Link>
    </form>
  );
}

export default SignIn;
