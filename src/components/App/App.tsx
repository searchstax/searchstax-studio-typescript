import React from 'react';
import './App.css';
import { SearchResultPage } from '../SearchResultPage/SearchResultPage';

import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.REACT_APP_GA_ID ?? '');

// User-specific variables/preferences
const sessionId: string = '1234';
const uuid: string = '5678';
const language: string = 'en';

const App: React.FC<unknown> = () => {
  return (
    <div className="App">
      <SearchResultPage sessionId={sessionId} uuid={uuid} language={language} />
    </div>
  );
}

export default App;
