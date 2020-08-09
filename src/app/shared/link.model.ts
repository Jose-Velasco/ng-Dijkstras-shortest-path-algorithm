import { ModalContent } from './modalContent.interface';

/**
 * link to be used for a link list.
 *
 * TODO: need to find a way to make this more reuseable by makeing the data type of _data be any thing
 * the user wants possible idea fix: use they type 'any'
 */
export class Link {
  private _data: ModalContent;
  private _linkNext: Link;
  private _linkPrevious: Link;

  constructor(dataContent: ModalContent) {
    this._data = dataContent;
    this._linkNext = null;
    this._linkPrevious = null;
  }
  get data(): ModalContent {
    return this._data;
  }
  get linkNext(): Link {
    return this._linkNext;
  }
  set linkNext(nextLinkToPointTo: Link) {
    this._linkNext = nextLinkToPointTo;
  }
  get linkPrevious(): Link {
    return this._linkPrevious;
  }
  set linkPrevious(previousLinkToPointTo: Link) {
    this._linkPrevious = previousLinkToPointTo;
  }
}
