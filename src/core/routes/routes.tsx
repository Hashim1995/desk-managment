/* eslint-disable no-use-before-define */
import { Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import EditRoomPlanPage from '@/modules/rooms/pages/edit-room-plan-page';
import StaffPage from '@/modules/staff/pages/staff-page';
import FallbackSpinner from '@/components/display/FallbackSpinner';
import ReportsPage from '@/modules/reports/pages/reports-page';
import AllowedEmailsPage from '@/modules/allowed-emails/pages/allowed-emails-page';

const LoginPage = React.lazy(() => import('@/core/static-pages/login_page'));

const HomePage = React.lazy(() => import('@/modules/home/pages/index'));
const LayoutPage = React.lazy(() => import('@core/layout/layout'));

const RoomsList = React.lazy(() => import('@/modules/rooms/pages'));
const UpdateContractPage = React.lazy(
  () => import('@/modules/rooms/pages/edit-room-plan-page')
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
        path: '/allowed-emails',
        element: <AllowedEmailsPage />
      },
      {
        path: '/rooms',
        element: <RoomsList />
      },
      {
        path: '/reports',
        element: <ReportsPage />
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
  }

  // {
  //   path: '*',
  //   element: <Navigate to="/404" />
  // }
];

export default routes;
