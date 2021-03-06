// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FREQUENCY_08_0_KHZ, FREQUENCY_16_0_KHZ, FREQUENCY_19_5_KHZ } from '@physical-layer/constants';
import { DspModeToDspConfigInitializerLookUp } from '@physical-layer/model';

export const FREQUENCY_MARGIN = 800;
export const FREQUENCY_FORBIDDEN_RANGE: Array<[number, number]> = [
  [FREQUENCY_08_0_KHZ - FREQUENCY_MARGIN, FREQUENCY_08_0_KHZ + FREQUENCY_MARGIN],
  [FREQUENCY_16_0_KHZ - FREQUENCY_MARGIN, FREQUENCY_16_0_KHZ + FREQUENCY_MARGIN],
  [FREQUENCY_19_5_KHZ - FREQUENCY_MARGIN, +Infinity]
];
export const FREQUENCY_END_LOWER = FREQUENCY_08_0_KHZ - FREQUENCY_MARGIN;
export const FREQUENCY_END_UPPER = FREQUENCY_16_0_KHZ - FREQUENCY_MARGIN;
export const FREQUENCY_END_INAUDIBLE = FREQUENCY_19_5_KHZ - FREQUENCY_MARGIN;

/*
  Bands that avoids 8 kHz and 16 kHz:

     3000 -  6000  | 3 kHz
     1000 -  7000  | 6 kHz
     9000 - 15000  | 6 kHz
    16500 - 19500  | 3 kHz

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  SAFE_MARGIN_FACTOR_FAST (~1.3 in example below):
  `           `           `           `           `           `   rxIntervalMilliseconds intervals
  '                       '                       '               txIntervalMilliseconds intervals
              ..................      ..................          fftWindowTime #1
  ..................      ..................                      fftWindowTime #2

  SAFE_MARGIN_FACTOR_SLOW (~2.2 in example below):
  `                  `                  `                  `                  `   rxIntervalMilliseconds intervals
  '                                     '                                     '   txIntervalMilliseconds intervals
                     ..................                    ..................     fftWindowTime #1
  ..................                    ..................                        fftWindowTime #2

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  Simplified formula to understand the relation between parameters:

    txIntervalMilliseconds = safeMarginFactor * fftWindowTime

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  Theoretical limits (safeMarginFactor = 1, supported sample rates 48 kHz and 44.1 kHz):

    +-----------------+-----------+-----------------+-------------+---------------+
    |    band name    |  fftSize  |  fftWindowTime  |  bandwidth  |  rawByteRate  |
    +-----------------+-----------+-----------------+-------------+---------------+
    |  Extraordinary  |    1024   |      23.2 ms    |   12.0 kHz  |    43.1 B/s   |
    |  Fat            |    2048   |      46.4 ms    |    6.0 kHz  |    21.5 B/s   |
    |  Normal         |    4096   |      92.9 ms    |    3.0 kHz  |    10.8 B/s   |
    |  Slim           |    8192   |     185.8 ms    |    1.5 kHz  |     5.4 B/s   |
    +-----------------+-----------+-----------------+-------------+---------------+
*/

const SAFE_MARGIN_FACTOR_FAST = 1.344;
const SAFE_MARGIN_FACTOR_SLOW = 2.15;

export const DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP: DspModeToDspConfigInitializerLookUp = {
  // Extraordinary band ~ 12.0 kHz
  ExtraordinaryBandFast: {
    fftSize: 1024,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: 1.7
  },
  ExtraordinaryBandSlow: {
    fftSize: 1024,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: 2.24
  },

  // Fat band ~ 6.0 kHz
  FatBandFastAudibleLower: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandFastAudibleUpper: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandFastInaudible: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandSlowAudibleLower: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  FatBandSlowAudibleUpper: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  FatBandSlowInaudible: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },

  // Normal band ~ 3.0 kHz
  NormalBandFastAudibleLower: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandFastAudibleUpper: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandFastInaudible: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandSlowAudibleLower: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  NormalBandSlowAudibleUpper: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  NormalBandSlowInaudible: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },

  // Slim band ~ 1.5 kHz
  SlimBandFastAudibleLower: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandFastAudibleUpper: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandFastInaudible: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandSlowAudibleLower: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  SlimBandSlowAudibleUpper: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  SlimBandSlowInaudible: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  }
};

export const SUPPORTED_SAMPLE_RATES: [number, number] = [48000, 44100]; // only these two samples rates are supported
