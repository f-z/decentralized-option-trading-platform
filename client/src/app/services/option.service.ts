import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

const OPTION_KEY = 'option_key';

@Injectable()
export class OptionService {
  private option: Option;

  constructor() {
    this.option = this.loadState() || null;
  }

  private loadState(): Option {
    return JSON.parse(localStorage.getItem(OPTION_KEY));
  }

  private saveState(): void {
    localStorage.setItem(OPTION_KEY, JSON.stringify(this.option));
  }

  getOption(): Option {
    // returning a copy of the stored option
    return { ...this.option };
  }

  setOption(option: Option): void {
    this.option = option;
    this.saveState();
  }

  removeOption(): void {
    delete this.option[OPTION_KEY];
    this.saveState();
  }
}

export interface Option {
  id: number;
  asset: string;
  exercisePrice: number;
  expirationDate: Date; // converted from unix timestamp that is in seconds
}
