// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithm } from '../shared/model';
import { FrameModeToFrameConfigLookUp } from './model';

export const frameModeToFrameConfigLookUp: FrameModeToFrameConfigLookUp = {
  Header2BytesPayloadLengthBetween1And8BytesFletcher16: {
    checkAlgorithm: CheckAlgorithm.Fletcher16,
    headerFirstByteChecksumMask: 0x1F,
    headerFirstBytePayloadLengthBitShift: 5,
    headerFirstBytePayloadLengthMask: 0xE0,
    headerLength: 2,
    headerPayloadLengthEnabled: true,
    headerPayloadLengthOffset: 1,
    payloadLength: null,
    payloadLengthMax: 8,
    payloadLengthMin: 1
  },
  Header3BytesPayloadLengthBetween1And8BytesSha1: {
    checkAlgorithm: CheckAlgorithm.Sha1,
    headerFirstByteChecksumMask: 0x1F,
    headerFirstBytePayloadLengthBitShift: 5,
    headerFirstBytePayloadLengthMask: 0xE0,
    headerLength: 3,
    headerPayloadLengthEnabled: true,
    headerPayloadLengthOffset: 1,
    payloadLength: null,
    payloadLengthMax: 8,
    payloadLengthMin: 1
  },
  Header3BytesPayloadLengthFixedAt8BytesSha1: {
    checkAlgorithm: CheckAlgorithm.Sha1,
    headerFirstByteChecksumMask: null,
    headerFirstBytePayloadLengthBitShift: null,
    headerFirstBytePayloadLengthMask: null,
    headerLength: 3,
    headerPayloadLengthEnabled: false,
    headerPayloadLengthOffset: null,
    payloadLength: 8,
    payloadLengthMax: null,
    payloadLengthMin: null
  }
};
