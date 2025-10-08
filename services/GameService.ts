
import { GameState, Player, GameRole, FinalCard, GameSettings } from '@/types/gameTypes';
import { gameRoles, finalCards, defaultGameSettings } from '@/data/gameData';
import NetworkService from './NetworkService';

export class GameService {
  private static instance: GameService;
  private gameState: GameState | null = null;
  private timers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  // Game initialization
  createGame(godId: string, settings: GameSettings): GameState {
    const gameId = this.generateGameId();
    
    this.gameState = {
      id: gameId,
      status: 'waiting',
      day: 0, // معارفه
      phase: 'day',
      players: [],
      roles: gameRoles.filter(role => settings.selectedRoles.includes(role.id)),
      finalCards: finalCards.filter(card => settings.selectedFinalCards.includes(card.id)),
      selectedFinalCards: settings.selectedFinalCards,
      speakingTimeLeft: settings.speakingTimeIntro,
      votingResults: {},
      godId,
      settings
    };

    console.log('Game created:', gameId);
    return this.gameState;
  }

  // Player management
  addPlayerToGame(player: Player): boolean {
    if (!this.gameState || this.gameState.status !== 'waiting') {
      return false;
    }

    if (this.gameState.players.length >= this.gameState.settings.maxPlayers) {
      return false;
    }

    // Check if player with same hidden ID already exists (reconnection)
    const existingPlayerIndex = this.gameState.players.findIndex(p => p.hiddenId === player.hiddenId);
    
    if (existingPlayerIndex >= 0) {
      // Reconnection
      this.gameState.players[existingPlayerIndex] = { ...this.gameState.players[existingPlayerIndex], ...player, isConnected: true };
      console.log('Player reconnected:', player.name);
    } else {
      // New player
      this.gameState.players.push(player);
      console.log('New player added:', player.name);
    }

    NetworkService.updateGameState(this.gameState);
    return true;
  }

  removePlayerFromGame(playerId: string): void {
    if (!this.gameState) return;

    const playerIndex = this.gameState.players.findIndex(p => p.id === playerId);
    if (playerIndex >= 0) {
      this.gameState.players[playerIndex].isConnected = false;
      NetworkService.updateGameState(this.gameState);
    }
  }

  // Game flow control
  startGame(): boolean {
    if (!this.gameState || this.gameState.players.length < this.gameState.settings.minPlayers) {
      return false;
    }

    this.gameState.status = 'setup';
    this.assignRoles();
    this.gameState.status = 'playing';
    this.gameState.day = 0; // معارفه
    this.gameState.phase = 'day';
    
    NetworkService.updateGameState(this.gameState);
    console.log('Game started');
    return true;
  }

  private assignRoles(): void {
    if (!this.gameState) return;

    const availableRoles = [...this.gameState.roles];
    const players = [...this.gameState.players];

    // Shuffle players
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }

    // Assign roles
    players.forEach((player, index) => {
      if (index < availableRoles.length) {
        player.role = availableRoles[index];
      }
    });

    console.log('Roles assigned to players');
  }

  // Timer management
  startSpeakingTimer(playerId: string, duration: number): void {
    if (!this.gameState) return;

    this.clearTimer('speaking');
    this.gameState.currentSpeaker = playerId;
    this.gameState.speakingTimeLeft = duration;

    const timer = setInterval(() => {
      if (this.gameState && this.gameState.speakingTimeLeft > 0) {
        this.gameState.speakingTimeLeft--;
        NetworkService.updateGameState(this.gameState);
      } else {
        this.stopSpeakingTimer();
      }
    }, 1000);

    this.timers.set('speaking', timer);
    NetworkService.updateGameState(this.gameState);
  }

  stopSpeakingTimer(): void {
    this.clearTimer('speaking');
    if (this.gameState) {
      this.gameState.currentSpeaker = undefined;
      this.gameState.speakingTimeLeft = 0;
      NetworkService.updateGameState(this.gameState);
    }
  }

  private clearTimer(name: string): void {
    const timer = this.timers.get(name);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(name);
    }
  }

  // Phase management
  nextPhase(): void {
    if (!this.gameState) return;

    if (this.gameState.phase === 'day') {
      this.gameState.phase = 'night';
      this.stopSpeakingTimer();
    } else if (this.gameState.phase === 'night') {
      this.gameState.day++;
      this.gameState.phase = 'day';
      this.gameState.speakingTimeLeft = this.gameState.settings.speakingTimeRegular;
    }

    NetworkService.updateGameState(this.gameState);
    console.log(`Phase changed to: ${this.gameState.phase}, Day: ${this.gameState.day}`);
  }

  // Voting system
  castVote(voterId: string, targetId: string): void {
    if (!this.gameState || this.gameState.phase !== 'voting') return;

    this.gameState.votingResults[voterId] = targetId;
    NetworkService.updateGameState(this.gameState);
    console.log(`Vote cast: ${voterId} -> ${targetId}`);
  }

  getVotingResults(): { [playerId: string]: number } {
    if (!this.gameState) return {};

    const results: { [playerId: string]: number } = {};
    
    Object.values(this.gameState.votingResults).forEach(targetId => {
      results[targetId] = (results[targetId] || 0) + 1;
    });

    return results;
  }

  // Player elimination
  eliminatePlayer(playerId: string): FinalCard | null {
    if (!this.gameState) return null;

    const player = this.gameState.players.find(p => p.id === playerId);
    if (player) {
      player.isAlive = false;
      
      // Give random final card
      const availableCards = this.gameState.finalCards;
      if (availableCards.length > 0) {
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        console.log(`Player ${player.name} eliminated and received final card: ${randomCard.name}`);
        NetworkService.updateGameState(this.gameState);
        return randomCard;
      }
    }

    NetworkService.updateGameState(this.gameState);
    return null;
  }

  // Game state queries
  getGameState(): GameState | null {
    return this.gameState;
  }

  getAlivePlayers(): Player[] {
    if (!this.gameState) return [];
    return this.gameState.players.filter(p => p.isAlive);
  }

  getDeadPlayers(): Player[] {
    if (!this.gameState) return [];
    return this.gameState.players.filter(p => !p.isAlive);
  }

  // Win condition checking
  checkWinCondition(): string | null {
    if (!this.gameState) return null;

    const alivePlayers = this.getAlivePlayers();
    const mafiaCount = alivePlayers.filter(p => p.role?.team === 'mafia').length;
    const cityCount = alivePlayers.filter(p => p.role?.team === 'city').length;
    const independentCount = alivePlayers.filter(p => p.role?.team === 'independent').length;

    // Mafia wins if they equal or outnumber city
    if (mafiaCount >= cityCount && independentCount === 0) {
      return 'mafia';
    }

    // City wins if all mafia and independents are eliminated
    if (mafiaCount === 0 && independentCount === 0) {
      return 'city';
    }

    // Check for independent wins (specific to each role)
    if (independentCount > 0) {
      // This would need more specific logic for each independent role
      const independentPlayer = alivePlayers.find(p => p.role?.team === 'independent');
      if (independentPlayer && alivePlayers.length === 1) {
        return 'independent';
      }
    }

    return null; // Game continues
  }

  // Utility methods
  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Cleanup
  endGame(): void {
    // Clear all timers
    this.timers.forEach((timer, name) => {
      clearInterval(timer);
    });
    this.timers.clear();

    if (this.gameState) {
      this.gameState.status = 'finished';
      NetworkService.updateGameState(this.gameState);
    }

    console.log('Game ended');
  }
}

export default GameService.getInstance();
