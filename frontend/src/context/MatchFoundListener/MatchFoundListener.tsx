// MatchFoundListener.tsx

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const MatchFoundListener: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const handleMatchFound = (event: CustomEvent) => {
      // Redirect to the GamePage
      history.push('/game');
    };

    window.addEventListener('match-found', handleMatchFound as EventListener);

    return () => {
      window.removeEventListener('match-found', handleMatchFound as EventListener);
    };
  }, [history]);

  return null;
};

export default MatchFoundListener;
