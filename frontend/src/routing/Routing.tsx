import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout/MainLayout';
import {
  Auth,
  Board,
  Dashboard,
  NotFound,
  Profile,
  ProjectCreate,
  Projects,
  Settings,
  SingleProject,
  TaskPopup,
  Team
} from '../pages';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

function Routing() {
  const isToken = useSelector((state: RootState) => state.signInUpSlice.isTokenReceived);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {isToken ? (
              <Route path="/" element={<AuthLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="sign-in" element={<Navigate to="/" />} />
                <Route path="sign-up" element={<Navigate to="/" />} />
                <Route path="projects" element={<Projects />} />
                <Route path="create-project" element={<ProjectCreate />} />
                <Route path="projects/:id" element={<SingleProject />}>
                  <Route index element={<Navigate to="board" />} />
                  <Route path="board" element={<Board />}>
                    <Route path="selected-task/:taskId" element={<TaskPopup />} />
                  </Route>
                  <Route path="settings" element={<Settings />} />
                  <Route path="team" element={<Team />} />
                </Route>
                <Route path="profile" element={<Profile />} />
              </Route>
            ) : (
              <>
                <Route path="/" element={<Auth view="sign-in" />} />
                <Route path="sign-in" element={<Auth view="sign-in" />} />
                <Route path="sign-up" element={<Auth view="sign-up" />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Routing;
