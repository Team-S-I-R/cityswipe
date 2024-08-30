import React from 'react';
import Match from './page';

const MatchLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="match-layout">
      <Match/>
    </div>
  );
};

export default MatchLayout;
