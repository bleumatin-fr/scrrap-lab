import * as React from 'react';
import { Layout, LayoutProps, Menu } from 'react-admin';
import AppBar from './AppBar';

const AppLayout = (props: LayoutProps) => (
    <Layout {...props} appBar={AppBar}  />
);

export default AppLayout;