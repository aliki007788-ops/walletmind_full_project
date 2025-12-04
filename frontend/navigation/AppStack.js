import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../screens/DashboardScreen';
import OpportunityScreen from '../screens/OpportunityScreen';

const Stack = createStackNavigator();
export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Opportunity" component={OpportunityScreen} />
    </Stack.Navigator>
  );
}
