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
    IN_REVIEW: marker(WheelchairEvaluating),
    IN_PROGRESS: marker(WheelchairOngoing),
    RESOLVED: marker(WheelchairDone),
  },
  blind: {
    PENDING: marker(BlindPending),
    IN_REVIEW: marker(BlindEvaluating),
    IN_PROGRESS: marker(BlindOngoing),
    RESOLVED: marker(BlindDone),
  },
  RAMP: {
    PENDING: marker(WheelchairPending),
    IN_REVIEW: marker(WheelchairEvaluating),
    IN_PROGRESS: marker(WheelchairOngoing),
    RESOLVED: marker(WheelchairDone),
  },
  tactile_paving: {
    PENDING: marker(BlindPending),
    IN_REVIEW: marker(BlindEvaluating),
    IN_PROGRESS: marker(BlindOngoing),
    RESOLVED: marker(BlindDone),
  },
  bathroom_adaptations: {
    PENDING: marker(WheelchairPending),
    IN_REVIEW: marker(WheelchairEvaluating),
    IN_PROGRESS: marker(WheelchairOngoing),
    RESOLVED: marker(WheelchairDone),
  },
  braille_signs: {
    PENDING: marker(BlindPending),
    IN_REVIEW: marker(BlindEvaluating),
    IN_PROGRESS: marker(BlindOngoing),
    RESOLVED: marker(BlindDone),
  },
  braille_auditory_adaptations: {
    PENDING: marker(BlindPending),
    IN_REVIEW: marker(BlindEvaluating),
    IN_PROGRESS: marker(BlindOngoing),
    RESOLVED: marker(BlindDone),
  },
  reserved_parking: {
    PENDING: marker(WheelchairPending),
    IN_REVIEW: marker(WheelchairEvaluating),
    IN_PROGRESS: marker(WheelchairOngoing),
    RESOLVED: marker(WheelchairDone),
  },
};
