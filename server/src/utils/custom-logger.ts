import { ConsoleLogger } from '@nestjs/common';
import * as net from 'net';

export class CustomLogger extends ConsoleLogger {
  private static client: net.Socket | null = null;
  private static isConnected = false;

  private static ensureClient() {
    if (!this.client) {
      this.client = new net.Socket();
      const port = Number(process.env.LOGSTASH_PORT || 5000);
      const host = process.env.LOGSTASH_HOST || 'logstash';
      // temporairement en dur pour les tests locaux
      // const port = 5050;
      // const host = 'host.docker.internal';

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

  private sendToLogstash(level: string, message: any, context?: string, trace?: string) {
    CustomLogger.ensureClient();
    if (!CustomLogger.client || !CustomLogger.isConnected) return;

    const payload = JSON.stringify({
      level,
      message,
      context,
      trace,
      timestamp: new Date().toISOString(),
    });

    try {
      CustomLogger.client.write(payload + '\n');
    } catch {
      // on ignore pour ne pas casser l'app
    }
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
