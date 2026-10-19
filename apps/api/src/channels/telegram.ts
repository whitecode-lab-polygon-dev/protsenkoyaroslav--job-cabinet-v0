export interface ChannelSender {
  send(chatId: string, text: string): Promise<void>;
}

const API_BASE = 'https://api.telegram.org/bot';

export function createTelegramSender(): ChannelSender {
  const token = process.env.TELEGRAM_BOT_TOKEN ?? 'local-dev-token';

  return {
    async send(chatId, text) {
      const response = await fetch(`${API_BASE}${token}/sendMessage`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      if (!response.ok) throw new Error(`telegram answered ${response.status}`);
    },
  };
}

// Used by the tests and by local runs: nothing leaves the process.
export function createMemorySender(): ChannelSender & { sent: Array<[string, string]> } {
  const sent: Array<[string, string]> = [];
  return {
    sent,
    async send(chatId, text) {
      sent.push([chatId, text]);
    },
  };
}
