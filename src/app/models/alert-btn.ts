import { AlertButton } from '@ionic/core';

export class AlertBtn implements AlertButton {

  text: string
  role?: string
  cssClass?: string | string[];
  handler?: (value: any) => boolean | void | { [key: string]: any; };

  constructor(
    text: string, role?: string, css?: string | string[],
    handler?: (value: any) => boolean | void | { [key: string]: any; }
  ) {
    this.text = text;
    this.role = role;
    this.cssClass = css;
    this.handler = handler;
  }
}
