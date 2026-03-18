import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabsNavigator from './TabsNavigator';

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabsNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;