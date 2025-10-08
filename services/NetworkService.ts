
import { Platform } from 'react-native';
import * as Network from 'expo-network';
import { Player, GameState, NetworkMessage, CheatDetection } from '@/types/gameTypes';

export class NetworkService {
  private static instance: NetworkService;
  private serverIP: string = '';
  private serverPort: number = 3000;
  private isServerRunning: boolean = false;
  private connectedPlayers: Map<string, Player> = new Map();
  private gameState: GameState | null = null;
  private messageHandlers: Map<string, (message: NetworkMessage) => void> = new Map();

  private constructor() {}

  static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.serverIP = await Network.getIpAddressAsync();
      console.log('Network service initialized with IP:', this.serverIP);
    } catch (error) {
      console.error('Failed to initialize network service:', error);
      throw error;
    }
  }

  async startServer(): Promise<string> {
    try {
      if (this.isServerRunning) {
        return this.getServerUrl();
      }

      // In a real implementation, you would start an actual HTTP server here
      // For React Native, you might need to use a native module or a different approach
      console.log('Starting HTTP server on:', this.getServerUrl());
      
      // Simulate server startup
      this.isServerRunning = true;
      
      // Start Socket.IO server simulation
      this.startSocketServer();
      
      return this.getServerUrl();
    } catch (error) {
      console.error('Failed to start server:', error);
      throw error;
    }
  }

  stopServer(): void {
    console.log('Stopping server...');
    this.isServerRunning = false;
    this.connectedPlayers.clear();
    this.gameState = null;
  }

  private startSocketServer(): void {
    // In a real implementation, you would set up Socket.IO server here
    console.log('Socket.IO server started');
  }

  getServerUrl(): string {
    return `http://${this.serverIP}:${this.serverPort}`;
  }

  isRunning(): boolean {
    return this.isServerRunning;
  }

  // Player management
  addPlayer(player: Player): void {
    this.connectedPlayers.set(player.id, player);
    console.log('Player added:', player.name);
    this.broadcastMessage({
      type: 'update',
      data: { players: Array.from(this.connectedPlayers.values()) },
      timestamp: new Date()
    });
  }

  removePlayer(playerId: string): void {
    const player = this.connectedPlayers.get(playerId);
    if (player) {
      this.connectedPlayers.delete(playerId);
      console.log('Player removed:', player.name);
      this.broadcastMessage({
        type: 'leave',
        playerId,
        timestamp: new Date()
      });
    }
  }

  getConnectedPlayers(): Player[] {
    return Array.from(this.connectedPlayers.values());
  }

  // Game state management
  updateGameState(gameState: GameState): void {
    this.gameState = gameState;
    this.broadcastMessage({
      type: 'update',
      data: { gameState },
      timestamp: new Date()
    });
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  // Message handling
  onMessage(type: string, handler: (message: NetworkMessage) => void): void {
    this.messageHandlers.set(type, handler);
  }

  sendMessage(playerId: string, message: NetworkMessage): void {
    // In a real implementation, you would send the message to the specific player
    console.log('Sending message to player:', playerId, message);
  }

  broadcastMessage(message: NetworkMessage): void {
    // In a real implementation, you would broadcast to all connected players
    console.log('Broadcasting message:', message);
    
    // Trigger message handlers
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  // Cheat detection
  reportCheat(detection: CheatDetection): void {
    console.log('Cheat detected:', detection);
    this.broadcastMessage({
      type: 'cheat_detected',
      playerId: detection.playerId,
      data: detection,
      timestamp: new Date()
    });
  }

  // Client-side methods for players
  async connectToServer(serverUrl: string, playerName: string, hiddenId: string): Promise<boolean> {
    try {
      console.log('Connecting to server:', serverUrl);
      console.log('Player:', playerName, 'Hidden ID:', hiddenId);
      
      // In a real implementation, you would connect to the server using Socket.IO client
      // For now, we'll simulate a successful connection
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Connected to server successfully');
          resolve(true);
        }, 1000);
      });
    } catch (error) {
      console.error('Failed to connect to server:', error);
      return false;
    }
  }

  disconnectFromServer(): void {
    console.log('Disconnecting from server...');
    // In a real implementation, you would disconnect from the Socket.IO server
  }

  // Utility methods
  validateServerUrl(url: string): boolean {
    const urlPattern = /^https?:\/\/[\d.]+:\d+$/;
    return urlPattern.test(url);
  }

  generateHiddenId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export default NetworkService.getInstance();
