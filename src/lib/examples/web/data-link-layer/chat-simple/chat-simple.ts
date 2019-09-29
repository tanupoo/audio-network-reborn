// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  DataLinkLayer,
  DataLinkLayerWrapper,
  getBytesFromHex,
  getHexFromBytes,
  getTextFromUtf8Bytes,
  getUtf8BytesFromText
} from '@'; // in your code it would be: ... from 'audio-network-lite';
import * as domUtils from '@examples/web/dom-utils';

export class DataLinkLayerChatSimpleWebExample {
  public dataLinkLayerWrapper: DataLinkLayerWrapper;

  public constructor() {
    domUtils.getByTagName('html').classList.add('data-link-layer-chat-simple');
    domUtils.getById('audio-network-lite-root').innerHTML = require('./chat-simple.html');
    this.dataLinkLayerWrapper = new DataLinkLayerWrapper(new DataLinkLayer());
    /*
    this.dataLinkLayerWrapper.dataLinkLayer.setFrameConfigInitializer({
      checkAlgorithm: CheckAlgorithm.Sha1,
      headerLength: 20,
      payloadLengthBitSize: 0,
      payloadLengthFixed: 1,
      payloadLengthOffset: 1
    });
    this.dataLinkLayerWrapper.dataLinkLayer.physicalLayer.setDspConfigInitializer({
      fftSize: 4096,
      frequencyEnd: 7000,
      safeMarginFactor: 1.2
    });
    console.log(this.dataLinkLayerWrapper.dataLinkLayer.getFrameConfig());
    console.log(this.dataLinkLayerWrapper.dataLinkLayer.physicalLayer.getDspConfig());
    */
    this.initializeHtmlElements();
  }

  public listenEnable(): void {
    domUtils.getById('listen-wrapper').classList.add('enabled');
    this.dataLinkLayerWrapper.listen({
      complete: () => domUtils.getById('listen-wrapper').classList.remove('enabled'),
      next: bytes => this.logFrame(bytes, true)
    });
  }

  public send(): void {
    const { max, min } = this.dataLinkLayerWrapper.dataLinkLayer.getFrameConfig().payloadLength;
    const value = domUtils.getByIdInput('send-field').value;
    const bytes = domUtils.getByIdInput('send-as-hex-checkbox').checked
      ? getBytesFromHex(value)
      : getUtf8BytesFromText(value);

    if (bytes.length < min || max < bytes.length) {
      alert('Payload of ' + bytes.length + ' B is out of range <' + min + ', ' + max + '>');
      return;
    }

    this.sendStart();
    this.dataLinkLayerWrapper.send(bytes, {
      complete: () => this.sendComplete(bytes),
      next: progress => (domUtils.getById('send-progress-bar').style.width = progress * 100 + '%')
    });
  }

  protected initializeHtmlElements(): void {
    domUtils.getById('send-button').addEventListener('click', () => this.send());
    domUtils.getById('listen-enable-button').addEventListener('click', () => this.listenEnable());
    domUtils.getById('send-field').addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.send();
      }
    });
  }

  protected logFrame(bytes: number[], isReceived: boolean): void {
    const div = domUtils.createElement('div');

    div.innerHTML = `<div>${getTextFromUtf8Bytes(bytes)}<br/>${getHexFromBytes(bytes)}</div>`;
    div.classList.add(isReceived ? 'received' : 'sent');
    domUtils.getById('messages-wrapper').appendChild(div);
  }

  protected sendStart(): void {
    domUtils.getById('sent-wrapper').classList.add('sending-in-progress');
    domUtils.getByIdInput('send-field').disabled = true;
    domUtils.getByIdInput('send-button').disabled = true;
  }

  protected sendComplete(bytes: number[]): void {
    const sendField = domUtils.getById('send-field') as HTMLInputElement;

    domUtils.getById('sent-wrapper').classList.remove('sending-in-progress');
    domUtils.getByIdInput('send-button').disabled = false;
    sendField.disabled = false;
    sendField.value = '';
    sendField.focus();
    this.logFrame(bytes, false);
  }
}
