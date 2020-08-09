import { Component, OnInit } from '@angular/core';
import { MenuButtonsService } from 'src/app/services/menu-buttons.service';
import { Subscription } from 'rxjs';
import { DoubleLinkedCircularLinkList } from 'src/app/shared/doubleLinkedCircularLinkList.model';
import { ModalContent } from 'src/app/shared/modalContent.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isModalOpen: boolean = false;
  private ontoggleHelpModalSubscription: Subscription;
  testLinkLink: DoubleLinkedCircularLinkList;
  dummyData: ModalContent;

  constructor(private menuButtonsService: MenuButtonsService) { }

  ngOnInit() {
    this.ontoggleHelpModalSubscription = this.menuButtonsService.onHelpButtonActions
      .subscribe((toggleHelpModal:boolean) => {
        this.isModalOpen = toggleHelpModal;
      });

      this.dummyData = {
        title: "TEST TITTLE",
        subheading: "subheading for the title",
        paragraphBody: "this is the main content  of the guide/instruction thing modal MODAL!!!",
      }
      this.testLinkLink = new DoubleLinkedCircularLinkList();
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "TEST TITTLE222222222",
        subheading: "subheading for the title22222222",
        paragraphBody: "2222this is the main content  of the guide/instruction thing modal MODAL!!!",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "TEST TITTLE33333",
        subheading: "subheading for the title3333",
        paragraphBody: "3333this is the main content  of the guide/instruction thing modal MODAL!!!",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "TEST TITTLE44444",
        subheading: "subheading for the title4444",
        paragraphBody: "4444this is the main content  of the guide/instruction thing modal MODAL!!!",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "TEST TITTLE55555",
        subheading: "55",
        paragraphBody: "55555",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "66666666",
        subheading: "subheading for the 666666",
        paragraphBody: "66666!",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.testLinkLink.reverseLinkList();

  }

  nextPageOfContent(): void {
    this.testLinkLink.moveToNextLink();
  }

  previousPageOfContent(): void {
    this.testLinkLink.moveToPreviousLink();
  }

  ontoggleCloseModal() {
    this.isModalOpen = false;
  }

}
