import React, { ReactNode, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '@/redux/store';
import { IUserPermissions } from '@/models/user';
import FallbackSpinner from '../display/FallbackSpinner';

interface IPrivateRoute {
  children: ReactNode;
  route: string;
}

function PrivateRoute({ children, route }: IPrivateRoute) {
  const permissions: IUserPermissions = useSelector(
    (state: RootState) => state.user.permissions
  );
  if (permissions?.pages.some(t => t.Key === route && t.Status === true)) {
    return <Suspense fallback={<FallbackSpinner />}>{children}</Suspense>;
  }
  return <Navigate to="/no-permission" />;
}

export default PrivateRoute;
