import { Keypoint } from '@tensorflow-models/blazeface';

/**
 * Calculates the euclidean distance between two points.
 */
function euclideanDist(p1: Keypoint, p2: Keypoint): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the Eye Aspect Ratio (EAR) given the keypoints for an eye.
 * The keypoints should be in the order specified by BlazeFace:
 * [left, right, top, bottom, center]
 */
export function getEAR(eyeKeypoints: Keypoint[]): number {
  if (eyeKeypoints.length < 5) {
    return 0;
  }
  // Vertical eye landmarks
  const p2 = eyeKeypoints[2]; // Top
  const p6 = eyeKeypoints[3]; // Bottom
  // Horizontal eye landmarks
  const p1 = eyeKeypoints[0]; // Left
  const p4 = eyeKeypoints[1]; // Right

  const verticalDist = euclideanDist(p2, p6);
  const horizontalDist = euclideanDist(p1, p4);

  const ear = verticalDist / horizontalDist;
  return ear;
}
