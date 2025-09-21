import { Suspense } from 'react';
import WebsiteDetailsClient from './WebsiteDetailsClient';

const WebsiteDetailsPage = () => {
  return (
    <Suspense>
      <WebsiteDetailsClient />
    </Suspense>
  );
};

export default WebsiteDetailsPage;