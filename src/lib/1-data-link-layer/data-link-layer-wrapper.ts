// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import {
  DataLinkLayerWrapperListenHandlers,
  DataLinkLayerWrapperSendHandlers,
  RxTimeTickState,
  TxTimeTickState
} from '@data-link-layer/model';

export class DataLinkLayerWrapper {
  protected rxHandlers: DataLinkLayerWrapperListenHandlers;
  protected rxInterval: any;
  protected txHandlers: DataLinkLayerWrapperSendHandlers;
  protected txInterval: any;
  protected txTimeout: any;

  public constructor(public readonly dataLinkLayer: DataLinkLayer) {}

  public listen(handlers: DataLinkLayerWrapperListenHandlers): boolean {
    if (this.rxInterval) {
      return false;
    }

    this.rxHandlers = handlers;
    this.handleRxInterval();

    return true;
  }

  public listenStop(inputDisable: boolean = true, notifyComplete: boolean = true): void {
    clearInterval(this.rxInterval);
    this.rxInterval = null;
    notifyComplete && this.rxHandlers && this.rxHandlers.complete && this.rxHandlers.complete();
    inputDisable && this.dataLinkLayer.physicalLayer.audioMonoIo.inputDisable();
  }

  public send(bytes: number[], handlers: DataLinkLayerWrapperSendHandlers): boolean {
    if (this.txInterval || this.txTimeout) {
      return false;
    }

    this.txHandlers = handlers;
    this.dataLinkLayer.setTxBytes(bytes);
    this.handleTxInterval();

    return true;
  }

  public sendStop(outputDisable: boolean = true, notifyComplete: boolean = true): void {
    clearInterval(this.txInterval);
    clearTimeout(this.txTimeout);
    this.txInterval = null;
    this.txTimeout = null;
    notifyComplete && this.txHandlers && this.txHandlers.complete && this.txHandlers.complete();
    outputDisable && this.dataLinkLayer.physicalLayer.audioMonoIo.outputDisable();
  }

  protected getCurrentTime(): number {
    return new Date().getTime();
  }

  protected handleRxInterval(): void {
    this.rxInterval = setInterval(() => {
      if (this.dataLinkLayer.rxTimeTick(this.getCurrentTime()) === RxTimeTickState.Stopped) {
        this.listenStop(false);
      } else if (this.rxHandlers.next) {
        this.dataLinkLayer.getRxBytesCollection().forEach((rxBytes: number[]) => this.rxHandlers.next(rxBytes, false));
        this.dataLinkLayer
          .getRxBytesErrorCorrectedCollection()
          .forEach((rxBytes: number[]) => this.rxHandlers.next(rxBytes, true));
      }
    }, this.dataLinkLayer.physicalLayer.getDspConfig().rxIntervalMilliseconds);
  }

  protected handleTxInterval(): void {
    const getTxGuardTimeout = (): any =>
      setTimeout(() => {
        this.txHandlers.next && this.txHandlers.next(this.dataLinkLayer.getTxProgress());
        this.sendStop(false);
      }, this.dataLinkLayer.getTxGuardMilliseconds());

    this.sendStop(false, false);
    this.txHandlers.next && this.txHandlers.next(this.dataLinkLayer.getTxProgress());

    switch (this.dataLinkLayer.txTimeTick(this.getCurrentTime())) {
      case TxTimeTickState.Guard:
        this.txTimeout = getTxGuardTimeout();
        break;

      case TxTimeTickState.Idle:
        // do nothing as intervals and timers where already stopped at this point
        break;

      case TxTimeTickState.Symbol:
        this.txInterval = setInterval(() => {
          this.txHandlers.next && this.txHandlers.next(this.dataLinkLayer.getTxProgress());

          switch (this.dataLinkLayer.txTimeTick(this.getCurrentTime())) {
            case TxTimeTickState.Guard:
              this.sendStop(false, false);
              this.txTimeout = getTxGuardTimeout();
              break;

            case TxTimeTickState.Idle:
              this.sendStop(false, false); // probably it will never happen but stop the interval just in case...
              break;

            case TxTimeTickState.Symbol:
              // do nothing as we already set interval that will handle it in next tick
              break;
          }
        }, this.dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds);
        break;
    }
  }
}
