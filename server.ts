/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  app.post('/api/tutor', async (req, res) => {
    try {
      const { systemInstruction, history, message } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Mesaj boş olamaz.' });
        return;
      }

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }],
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Busy (503/429), hung (15 s timeout) or failing model → try the next one, no SDK retries
      const models = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-flash-lite-latest'];
      let response;
      let model = '';
      for (model of models) {
        try {
          response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              abortSignal: AbortSignal.timeout(15000),
              httpOptions: { retryOptions: { attempts: 1 } },
            },
          });
          break;
        } catch (err: any) {
          if (model === models[models.length - 1]) throw err;
          console.warn(`Tutor: ${model} cevap vermedi (${String(err?.message).slice(0, 80)}), sıradaki modele geçiliyor`);
        }
      }

      const reply = response?.text || 'Bu aşamada klinik kararı verirken hangi kriteri önceliklendirmelisin?';
      res.json({ reply, model });
    } catch (error: any) {
      console.error('Tutor API Error:', error);
      res.status(500).json({
        error: 'Tutor şu anda yanıt veremiyor. Lütfen sorunuzu tekrar iletin.',
        detail: process.env.GEMINI_API_KEY ? error?.message : 'GEMINI_API_KEY tanımlı değil',
      });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RadyoAI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
