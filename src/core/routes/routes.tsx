import { Navigate } from 'react-router-dom';

import React, { Suspense } from 'react';
import EditRoomPlanPage from '@/modules/rooms/pages/edit-room-plan-page';
import StaffPage from '@/modules/staff/pages/staff-page';
import FallbackSpinner from '@/components/display/FallbackSpinner';

const LoginPage = React.lazy(() => import('@/core/static-pages/login_page'));
const RegisterPage = React.lazy(
  () => import('@/core/static-pages/register_page')
);
const HomePage = React.lazy(() => import('@/modules/home/pages/index'));
const LayoutPage = React.lazy(() => import('@core/layout/layout'));

const RoomsList = React.lazy(() => import('@/modules/rooms/pages'));
const UpdateContractPage = React.lazy(
  () => import('@/modules/rooms/pages/edit-room-plan-page')
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
        path: '/staff',
        element: <StaffPage />
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
        path: '/rooms/edit-room-plan/:id',
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <EditRoomPlanPage />
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
        path: 'no-permission',
        element: <h1>no permission</h1>
      }
      // {
      //   path: '404',
      //   element: <h1>404</h1>
      // }
    ]
  },
  {
    path: 'login',
    element: <LoginPage />
  },
  {
    path: 'register',
    element: <RegisterPage />
  }
  // {
  //   path: '*',
  //   element: <Navigate to="/404" />
  // }
];

export default routes;
