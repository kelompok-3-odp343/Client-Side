import React, { useState } from 'react';
import { LoadingContext } from './LoadingContext';
import LoadingOverlay from '../shared/components/LoadingOverlay';

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <LoadingOverlay />}
    </LoadingContext.Provider>
  );
};