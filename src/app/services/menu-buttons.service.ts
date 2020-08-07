import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuButtonsService {
  private _onHelpModaltoggle = new Subject<boolean>();

  constructor() { }

  get onHelpButtonActions(): Observable<boolean> {
    return this._onHelpModaltoggle.asObservable();
  }

  /**
   * toggles modals state from open to close
   * @param toggleOpenClose True is open. False is close.
   */
  openHelpModal(toggleOpenClose: boolean): void {
    this._onHelpModaltoggle.next(toggleOpenClose);
  }
}
