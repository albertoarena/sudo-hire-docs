import { measurementId } from '../scripts/analytics';

// The GA4 measurement ID, from PUBLIC_GA_MEASUREMENT_ID at build time. With
// no ID, the site has no banner, no Analytics settings button and no script.
// An ID that is not a GA4 ID fails the build.
//
// The ID is not a secret: it is in the source of every page that uses it. It
// comes from the environment, so a local build never sends hits to the real
// property.
export const gaMeasurementId = measurementId(import.meta.env.PUBLIC_GA_MEASUREMENT_ID);
