import { Link } from './link.model';
import { ModalContent } from './modalContent.interface';


/**
 * Jose Juarez Leonardo Velasco Jr 8/09/2020
 * My current implementation of a Double linked circular linked list.
 * used what I learned from my data structures class at Gavilan College from the assignments(pieces):
 * Double-Ended, Double-Linked, Priority-Queue List and Circular List,
 * to create this combinedish version of a linked list. I also did my implementation of reversing a linked list
 * which I have no knowledge of how or what it would look like. This is what I believe it means to revers a linked list.
 *
 * In this linked list their is no end or start and only a current which moves around the list.
 *
 * this can be use full for a number of things such as a image carousel for a app or website,
 * a modal with a couple of pages that use a next and previous button to turn the page
 *
 * TODO: in order to improve the easy and fast reuse ability of this Double linked circular linked list class
 * I need to find a way to make it create new links with any type of data not just what I am useing for this current project (ModalContent interface)
 * possible ideas: use 'any' type
 *
 * TODO add more functionality when I need to.
 */
export class DoubleLinkedCircularLinkList {
  private _currentLink: Link;
  private _numOfLinks: number;

  constructor() {
    this._currentLink = null;
    this._numOfLinks = 0;
  }
  get numOfLinks(): number {
    return this._numOfLinks;
  }
  get currentLink(): Link {
    return this._currentLink;
  }
  set currentLink(newCurrentLink: Link) {
    this._currentLink = newCurrentLink;
  }
  /**
   * if there are no links in the list then returns true
   */
  isEmpty(): boolean {
    return this._numOfLinks === 0;
  }
  /**
   * moves up to the next link relative to the current link.
   * once current link has been changed returns new current link(former next link of the 'old' current link)
   */
  moveToNextLink(): Link {
    this._currentLink = this._currentLink.linkNext;
    return this._currentLink;
  }
  /**
   * moves down to the previous link relative to the current link.
   * once current link has been changed returns new current link(former previous link of the 'old' current link)
   */
  moveToPreviousLink(): Link {
    this._currentLink =  this._currentLink.linkPrevious;
    return this._currentLink;
  }
  /**
   * initializes first link in a empty linked list
   * @param firstLinkData the data to be store in a link
   */
  private insertInitialLink(firstLinkData: ModalContent) {
    if (this.isEmpty()) {
      const newLink: Link = new Link(firstLinkData);
      this._currentLink = newLink;
      this._currentLink.linkNext = newLink;
      this._currentLink.linkPrevious = newLink;
    }
  }
  /**
   * handles adding a new link into the linked list.
   * handles adding the first link and all subsequent link into the linked list.
   * This will add a new link into the spot 'next' of the current link(between the current link and the one in front of it)
   * @param linkData the data to be stored in a link
   */
  insertNewLink(linkData: ModalContent) {
    if(this.isEmpty()) {
      this.insertInitialLink(linkData);
      this._numOfLinks++;
    } else {
      const newLink: Link = new Link(linkData);
      newLink.linkNext = this._currentLink.linkNext;
      newLink.linkPrevious = this._currentLink;
      this._currentLink.linkNext.linkPrevious = newLink;
      this._currentLink.linkNext = newLink;
      this._numOfLinks++;
    }
  }

  /**
   * reverse the linked list.
   * (all links in the list next's point to their previous links and all the links
   * previous's points to what was their old next)
   * this can be useful when first adding all items into the linked list becasue going to the next link
   * after reversing the order will make the list move in ascending order(from when the link was first reversed)
   */
  reverseLinkList():void {
    if(this.isEmpty() || (this._numOfLinks === 1)) {
      return;
    }
    for (let i = 0; i < this._numOfLinks; i++) {
      let nextLinkHolder = this._currentLink.linkNext;
      this._currentLink.linkNext = this._currentLink.linkPrevious;
      this._currentLink.linkPrevious = nextLinkHolder;
      this._currentLink = nextLinkHolder;
    }
  }
}
