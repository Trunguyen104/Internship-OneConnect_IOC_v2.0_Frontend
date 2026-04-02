import {
  HttpTransportType,
  HubConnectionBuilder,
  JsonHubProtocol,
  LogLevel,
} from '@microsoft/signalr';

/**
 * SignalR service to manage real-time notification connections.
 */
class NotificationSignalRService {
  constructor() {
    this.connection = null;
    this.handlers = new Set();
  }

  /**
   * Initialize and start the Hub connection.
   */
  async start(token) {
    if (this.connection) return;

    // Use absolute URL from environment or fallback to relative proximal path
    const hubUrl = `${process.env.NEXT_PUBLIC_API_URL || ''}/hub/notifications`;

    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
        skipNegotiation: true, // Only if Hub is configured for WebSockets exclusively
        transport: HttpTransportType.WebSockets,
      })
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Exponential backoff according to AC-02 (1s, 2s, 4s...)
          if (retryContext.previousRetryCount === 0) return 1000;
          if (retryContext.previousRetryCount === 1) return 2000;
          if (retryContext.previousRetryCount === 2) return 4000;
          return 8000;
        },
      })
      .build();

    // Standard client methods according to common backend patterns
    this.connection.on('ReceiveNotification', (notification) => {
      this.handlers.forEach((handler) => handler(notification));
    });

    try {
      await this.connection.start();
      console.log('✅ Notification Hub Connected');
    } catch (err) {
      console.error('❌ Notification Hub Connection Failed:', err);
    }
  }

  /**
   * Subscribe to new notifications.
   */
  subscribe(handler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  /**
   * Stop the connection.
   */
  async stop() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }
}

export const notificationSignalRService = new NotificationSignalRService();
