import FallbackSpinner from '@/components/display/FallbackSpinner/fallback-spinner';
import { Navigate } from 'react-router-dom';

import React, { Suspense } from 'react';

const LoginPage = React.lazy(() => import('@/core/static-pages/login_page'));
const RegisterPage = React.lazy(
  () => import('@/core/static-pages/register_page')
);
const HomePage = React.lazy(() => import('@/modules/home/pages/index'));
const LayoutPage = React.lazy(() => import('@core/layout/layout'));

const BooksPage = React.lazy(
  () => import('@/modules/settings/entities/books/pages')
);

const RoomsList = React.lazy(() => import('@/modules/rooms/pages'));
const UpdateContractPage = React.lazy(
  () => import('@/modules/rooms/pages/update-contract-page')
);
const ViewContractPage = React.lazy(
  () => import('@/modules/rooms/pages/view-contract-page')
);
const CreateRoomPage = React.lazy(
  () => import('@/modules/rooms/pages/create-room-page')
);

const routes = [
  {
    path: '/',
    element: (
      <Suspense fallback={<FallbackSpinner />}>
        <LayoutPage />
      </Suspense>
    ),
    children: [
      { path: '', element: <Navigate to="/home" /> },
      {
        path: '/home',
        index: true,
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <HomePage />
          </Suspense>
        )
      },
      {
        path: '/rooms',
        element: <RoomsList />
      },
      {
        path: '/rooms/create-room',
        element: <CreateRoomPage />
      },

      {
        path: '/edc/update-contract/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateContractPage />
          </Suspense>
        )
      },
      {
        path: '/edc/update-contract/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <UpdateContractPage />
          </Suspense>
        )
      },

      {
        path: '/edc/view-contract/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewContractPage />
          </Suspense>
        )
      },
      {
        path: '/edc/view-contract/draft/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ViewContractPage />
          </Suspense>
        )
      },
      {
        path: '/entities',
        children: [
          { path: '/entities', element: <Navigate to="books" /> },
          {
            path: 'books',
            key: 'books',
            index: true,
            element: (
              <Suspense fallback={<FallbackSpinner />}>
                <BooksPage />
              </Suspense>
            )
          }
        ]
      },
      {
        path: 'no-permission',
        element: <h1>no permission</h1>
      },
      {
        path: '404',
        element: <h1>404</h1>
      }
    ]
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: 'register',
    element: <RegisterPage />
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
];

export default routes;
