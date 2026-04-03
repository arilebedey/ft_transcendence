import { ConsoleLogger } from '@nestjs/common';
import * as net from 'net';

export class CustomLogger extends ConsoleLogger {
  private static client: net.Socket | null = null;
  private static isConnected = false;

  private static ensureClient() {
    if (!this.client) {
      this.client = new net.Socket();
      const port = Number(process.env.LOGSTASH_PORT || 5101);
      const host = process.env.LOGSTASH_HOST || 'logstash';

      this.client.connect(port, host, () => {
        this.isConnected = true;
      });

      this.client.on('error', () => {
        this.isConnected = false;
      });

      this.client.on('close', () => {
        this.isConnected = false;
        this.client = null;
      });
    }
  }

  private sendToLogstash(level: string, message: any, context?: string, trace?: string, extra?: Record<string, any>) {
    if (!process.env.LOGSTASH_HOST) return;
    
    CustomLogger.ensureClient();
    if (!CustomLogger.client) return;

    const payload = JSON.stringify({
      level,
      message,
      context,
      trace,
      ...extra,
      timestamp: new Date().toISOString(),
    });

    try {
      CustomLogger.client.write(payload + '\n');
    } catch {
      // silently ignore to avoid crashing the app
    }
  }

  event(eventType: string, data: Record<string, any>, context?: string) {
    this.sendToLogstash('event', 'Business Event', context, undefined, {
      event_type: eventType,
      ...data,
    });
  }

  log(message: any, context?: string) {
    super.log(message, context);
    this.sendToLogstash('log', message, context);
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.sendToLogstash('error', message, context, trace);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
    this.sendToLogstash('warn', message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
    this.sendToLogstash('debug', message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
    this.sendToLogstash('verbose', message, context);
  }
}
