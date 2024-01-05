import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { fetchSignUp, setMessageSign } from '../../../../redux/signInUpSlice';
import { authValidation } from '../../../../data';
import { Button, ComponentWithMessage, Input } from '../../../../components';

import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const { NAME_REGEX, EMAIL_REGEX, PASSWORD_MIN_LENGTH, PASSWORD_REGEX } = authValidation;

interface SignUpProps {
  styles?: { [key: string]: string };
}

function SignUp(props: SignUpProps) {
  const dispatch: ThunkDispatch<RootState, undefined, AnyAction> = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const errorFirstName = useMemo(() => {
    if (firstName.length === 0) return undefined;
    if (!firstName.match(NAME_REGEX)) {
      return 'First name must be 1 word and contain only letters';
    }
  }, [firstName]);

  const errorLastName = useMemo(() => {
    if (lastName.length === 0) return undefined;
    if (!lastName.match(NAME_REGEX)) {
      return 'Last name must be 1 word and contain only letters';
    }
  }, [lastName]);

  const errorEmail = useMemo(() => {
    if (email.length === 0) return undefined;
    if (!email.match(EMAIL_REGEX)) {
      return 'Email should have correct format';
    }
  }, [email]);

  const errorPassword = useMemo(() => {
    if (password.length === 0) return undefined;
    if (password.length < PASSWORD_MIN_LENGTH) {
      return `Password is too short - should be ${PASSWORD_MIN_LENGTH} chars minimum.`;
    } else if (!password.match(PASSWORD_REGEX)) {
      return 'Password must contain at least one letter, one number and one special character';
    }
  }, [password]);

  const errorConfirmPassword = useMemo(() => {
    if (confirmPassword.length === 0) return undefined;
    if (password !== confirmPassword) {
      return 'Confirm password must be equal password';
    }
  }, [password, confirmPassword]);

  const submitHandler = useCallback(async () => {
    const data = {
      firstName,
      lastName,
      email,
      password
    };

    const answer = await dispatch(fetchSignUp(data));
    if (answer.meta.requestStatus === 'fulfilled') navigate('/sign-in');
    setTimeout(() => {
      dispatch(setMessageSign(''));
    }, 1500);
  }, [firstName, lastName, email, password, confirmPassword]);

  return (
    <form
      className={props.styles?.['form']}
      onSubmit={(event) => {
        event.preventDefault();
        !errorFirstName &&
          !errorLastName &&
          !errorEmail &&
          !errorPassword &&
          !errorConfirmPassword &&
          submitHandler();
      }}>
      <ComponentWithMessage errorMessage={errorFirstName}>
        <Input
          className={props.styles?.['input']}
          placeholder="First Name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
          styleType={errorFirstName ? 'invalid' : undefined}
        />
      </ComponentWithMessage>
      <ComponentWithMessage errorMessage={errorLastName}>
        <Input
          className={props.styles?.['input']}
          placeholder="Last Name"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
          styleType={errorLastName ? 'invalid' : undefined}
        />
      </ComponentWithMessage>
      <ComponentWithMessage errorMessage={errorEmail}>
        <Input
          className={props.styles?.['input']}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          styleType={errorEmail ? 'invalid' : undefined}
        />
      </ComponentWithMessage>
      <ComponentWithMessage errorMessage={errorPassword}>
        <div className={props.styles?.['input-block']}>
          <Input
            className={props.styles?.['input']}
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            styleType={errorPassword ? 'invalid' : undefined}
          />
          <button
            className={props.styles?.['btn-eye']}
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}>
            {isPasswordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
          </button>
        </div>
      </ComponentWithMessage>
      <ComponentWithMessage errorMessage={errorConfirmPassword}>
        <div className={props.styles?.['input-block']}>
          <Input
            className={props.styles?.['input']}
            type={isConfirmPasswordVisible ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            styleType={errorConfirmPassword ? 'invalid' : undefined}
          />
          <button
            className={props.styles?.['btn-eye']}
            type="button"
            onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}>
            {isConfirmPasswordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
          </button>
        </div>
      </ComponentWithMessage>
      <Button className={props.styles?.['btn']} type="submit" styleButton="primary">
        Sign up
      </Button>
      <Link className={props.styles?.['link']} to="/sign-in">
        Already have an account? Sign in!
      </Link>
    </form>
  );
}

export default SignUp;
