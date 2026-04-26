import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { RevenueCatProvider } from './src/context/RevenueCatContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <RevenueCatProvider>
      <AuthProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AuthProvider>
    </RevenueCatProvider>
  );
}
