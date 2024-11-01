/**
 * Copyright 2024 The Fire Company
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { Genkit } from 'genkit';
import { genkitPlugin } from 'genkit/plugin';
import OpenAI from 'openai';

import { dallE3, dallE3Model } from './dalle.js';
import {
  openaiEmbedder,
  SUPPORTED_EMBEDDING_MODELS,
  textEmbedding3Large,
  textEmbedding3Small,
  textEmbeddingAda002,
} from './embedder.js';
import {
  gpt35Turbo,
  gpt4,
  gpt4Turbo,
  gpt4Vision,
  gpt4o,
  gpt4oMini,
  gptModel,
  SUPPORTED_GPT_MODELS,
} from './gpt.js';
import { SUPPORTED_TTS_MODELS, ttsModel, tts1, tts1Hd } from './tts.js';
import { whisper1, whisper1Model } from './whisper.js';
export {
  dallE3,
  gpt35Turbo,
  gpt4,
  gpt4Turbo,
  gpt4Vision,
  gpt4o,
  gpt4oMini,
  tts1,
  tts1Hd,
  whisper1,
  textEmbedding3Large,
  textEmbedding3Small,
  textEmbeddingAda002,
};

export interface PluginOptions {
  apiKey?: string;
}

/**
 * This module provides an interface to the OpenAI models through the Genkit
 * plugin system. It allows users to interact with various models by providing
 * an API key and optional configuration.
 *
 * The main export is the `openai` plugin, which can be configured with an API
 * key either directly or through environment variables. It initializes the
 * OpenAI client and makes available the models for use.
 *
 * Exports:
 * - gpt4o: Reference to the GPT-4o model.
 * - gpt4oMini: Reference to the GPT-4o-mini model.
 * - gpt4Turbo: Reference to the GPT-4 Turbo model.
 * - gpt4Vision: Reference to the GPT-4 Vision model.
 * - gpt4: Reference to the GPT-4 model.
 * - gpt35Turbo: Reference to the GPT-3.5 Turbo model.
 * - dallE3: Reference to the DALL-E 3 model.
 * - tts1: Reference to the Text-to-speech 1 model.
 * - tts1Hd: Reference to the Text-to-speech 1 HD model.
 * - whisper: Reference to the Whisper model.
 * - textEmbedding3Large: Reference to the Text Embedding Large model.
 * - textEmbedding3Small: Reference to the Text Embedding Small model.
 * - textEmbeddingAda002: Reference to the Ada model.
 * - openai: The main plugin function to interact with OpenAI.
 *
 * Usage:
 * To use the models, initialize the openai plugin inside `configureGenkit` and
 * pass the configuration options. If no API key is provided in the options, the
 * environment variable `OPENAI_API_KEY` must be set.
 *
 * Example:
 * ```
 * import openai from 'genkitx-openai';
 *
 * export default configureGenkit({
 *  plugins: [
 *    openai({ apiKey: 'your-api-key' })
 *    ... // other plugins
 *  ]
 * });
 * ```
 */
export const openAI = (options?: PluginOptions) =>
  genkitPlugin('openai', async (ai: Genkit) => {
    let apiKey = options?.apiKey || process.env.OPENAI_API_KEY;
    if (!apiKey)
      throw new Error(
        'please pass in the API key or set the OPENAI_API_KEY environment variable'
      );
    const client = new OpenAI({ apiKey });

    for (const name of Object.keys(SUPPORTED_GPT_MODELS)) {
      gptModel(ai, name, client);
    }
    dallE3Model(ai, client);
    whisper1Model(ai, client);
    for (const name of Object.keys(SUPPORTED_TTS_MODELS)) {
      ttsModel(ai, name, client);
    }
    for (const name of Object.keys(SUPPORTED_EMBEDDING_MODELS)) {
      openaiEmbedder(ai, name, options);
    }
  });

export default openAI;
