import React, { useMemo } from 'react';
import MapA from '~/assets/images/mapA.svg?react';
import MapB from '~/assets/images/mapB.svg?react';
import MapC from '~/assets/images/mapC.svg?react';
import MapA1 from '~/assets/images/mapA1.svg?react';
import MapB1 from '~/assets/images/mapB1.svg?react';
import MapC1 from '~/assets/images/mapC1.svg?react';

function MapLayer({ zone }) {
  return (
    <div>
      {' '}
      {useMemo(() => {
        if (zone === 'A') return <MapA />;
        else if (zone === 'B') return <MapB />;
        else if (zone === 'C') return <MapC />;
        else if (zone === 'A1') return <MapA1 />;
        else if (zone === 'B1') return <MapB1 />;
        else if (zone === 'C1') return <MapC1 />;
      }, [zone])}
    </div>
  );
}

export default MapLayer;
