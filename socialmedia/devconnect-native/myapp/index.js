// index.js
import 'react-native-gesture-handler';  // This must be the first import
import { AppRegistry } from 'react-native';
import App from './App';  // Update the path to match your project structure
import { name as appName } from './app.json';

// Enable LogBox for development
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

AppRegistry.registerComponent(appName, () => App);