import 'express-session'; // Import the original module to augment it
import { CustomSessionData } from '../common/interfaces/session.interface'; // Import your custom type

declare module 'express-session' {
  // Merge the `CustomSessionData` interface into the existing SessionData interface
  interface SessionData extends CustomSessionData {}
}

export {};