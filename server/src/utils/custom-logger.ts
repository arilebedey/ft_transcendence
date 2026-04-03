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

  private extractContext(optionalParams: any[]): string | undefined {
    // The context is typically the last string argument passed by NestJS's Logger
    if (optionalParams.length > 0 && typeof optionalParams[optionalParams.length - 1] === 'string') {
      return optionalParams[optionalParams.length - 1];
    }
    return undefined;
  }

  log(message: any, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.sendToLogstash('log', message, this.extractContext(optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(message, ...optionalParams);
    // Error trace is sometimes passed before context
    let context = this.extractContext(optionalParams);
    let trace = optionalParams.length > 1 && typeof optionalParams[0] === 'string' ? optionalParams[0] : undefined;
    this.sendToLogstash('error', message, context, trace);
  }

  warn(message: any, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
    this.sendToLogstash('warn', message, this.extractContext(optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
    this.sendToLogstash('debug', message, this.extractContext(optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
    this.sendToLogstash('verbose', message, this.extractContext(optionalParams));
  }
}
