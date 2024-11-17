import L from 'leaflet';

// Pending
import BlindPending from './pending/blind_pending.svg';
import WheelchairPending from './pending/wheelchair_pending.svg';

// Evaluating
import BlindEvaluating from './evaluating/blind_evaluating.svg';
import WheelchairEvaluating from './evaluating/wheelchair_evaluating.svg';

// Ongoing
import BlindOngoing from './ongoing/blind_ongoing.svg';
import WheelchairOngoing from './ongoing/wheelchair_ongoing.svg';

// Done
import BlindDone from './done/blind_done.svg';
import WheelchairDone from './done/wheelchair_done.svg';

interface IMarkers {
  [key: string]: {
    [key: string]: L.Icon;
  };
}

const marker = (icon: string): L.Icon =>
  L.icon({
    iconUrl: icon,
    iconSize: [38, 49],
    iconAnchor: [17, 49],
    popupAnchor: [-3, -76],
  });

export const markers: IMarkers = {
  wheelchair: {
    PENDING: marker(WheelchairPending),
    EVALUATING: marker(WheelchairEvaluating),
    ONGOING: marker(WheelchairOngoing),
    FINISHED: marker(WheelchairDone),
  },
  blind: {
    PENDING: marker(BlindPending),
    EVALUATED: marker(BlindEvaluating),
    ONGOING: marker(BlindOngoing),
    FINISHED: marker(BlindDone),
  },
  RAMP: {
    PENDING: marker(WheelchairPending),
    EVALUATING: marker(WheelchairEvaluating),
    ONGOING: marker(WheelchairOngoing),
    FINISHED: marker(WheelchairDone),
  },
};
