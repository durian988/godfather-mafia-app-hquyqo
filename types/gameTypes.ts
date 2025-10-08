
export interface Player {
  id: string;
  name: string;
  hiddenId: string;
  role?: GameRole;
  isAlive: boolean;
  isConnected: boolean;
  socketId?: string;
  lastActivity: Date;
}

export interface GameRole {
  id: string;
  name: string;
  description: string[];
  team: 'city' | 'mafia' | 'independent';
  color: string;
  abilities: string[];
}

export interface FinalCard {
  id: string;
  name: string;
  description: string[];
  audioPath?: string;
}

export interface GameState {
  id: string;
  status: 'waiting' | 'setup' | 'playing' | 'finished';
  day: number; // 0 = معارفه
  phase: 'day' | 'night' | 'voting' | 'defense';
  players: Player[];
  roles: GameRole[];
  finalCards: FinalCard[];
  selectedFinalCards: string[];
  currentSpeaker?: string;
  speakingTimeLeft: number;
  votingResults: { [playerId: string]: string };
  godId: string;
  settings: GameSettings;
}

export interface GameSettings {
  minPlayers: number;
  maxPlayers: number;
  speakingTimeIntro: number; // 40 seconds for معارفه
  speakingTimeRegular: number; // 2 minutes for regular days
  challengeTime: number; // 1 minute for challenges
  defenseTime: number; // 2 minutes for defense
  safeMode: boolean;
  selectedRoles: string[];
  selectedFinalCards: string[];
}

export interface NetworkMessage {
  type: 'join' | 'leave' | 'update' | 'speak' | 'vote' | 'challenge' | 'cheat_detected';
  playerId?: string;
  data?: any;
  timestamp: Date;
}

export interface CheatDetection {
  playerId: string;
  type: 'splitscreen' | 'popup' | 'background' | 'screenshot';
  timestamp: Date;
}
