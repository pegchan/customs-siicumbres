import { CustomizationProvider } from './context';
import { CustomizationLayout } from './components/CustomizationLayout';

function App() {
  return (
    <CustomizationProvider>
      <CustomizationLayout />
    </CustomizationProvider>
  );
}

export default App;