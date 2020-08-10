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
  ModalContentCarousel: DoubleLinkedCircularLinkList;
  dummyData: ModalContent;

  constructor(private menuButtonsService: MenuButtonsService) { }

  ngOnInit() {
    this.ontoggleHelpModalSubscription = this.menuButtonsService.onHelpButtonActions
      .subscribe((toggleHelpModal:boolean) => {
        this.isModalOpen = toggleHelpModal;
      });

      this.dummyData = {
        title: "Welcome to Dijkstra's algorithm Pathfinding Visualizer",
        subheading: "Visualize the shortest path: Tutorial",
        paragraphBody:
        "Visual representation of Dijkstra's algorithm using TypeScript and Angular. Data structures utilized are min index d-array heap, adjacency list and directed connected weighted graph for the main app. Additonally, a double linked circular linked list was implemented to handle displaying this modal's content(While there are other possible easier ways, I wanted to get more practice with linked lists)",
      }
      this.testLinkLink = new DoubleLinkedCircularLinkList();
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "Adding a start and end square",
        subheading: "Keyboard.",
        paragraphBody: "(1) Adding a 'starting'* square to the board:  on your keyboard press and HOLD down the 's' key while left clicking on a square. (2) Adding a 'ending'* square to the board:  on your keyboard press and HOLD down the 'e' key while left clicking on a square. *The algorithm will find the shortest path between point A(start square) and point B(end square).",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "Adding and removing walls",
        subheading: "Mouse.",
        paragraphBody: "(1) Adding a 'wall' square to the board:  on your mouse LEFT click and hold down while dragging your mouse around squares. (2) Removing a 'wall' square from the board:  on you mouse RIGHT click and hold down while dragging you mouse over 'wall' squares.",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "Menu bar buttons",
        subheading: "The four buttons on the left-hand side.",
        paragraphBody: "(1) START button: once a 'start' and 'end' square has been placed on the board, this will commence the Pathfinding Visualization. (2) CLEAR SEARCH button: will ONLY wipe the animation changes to the board once a Pathfinding Visualization was completed or started. This will not remove start, end or wall squares. (3) FULL RESET button: will wipe the board completely(initial board state). (4) ? button: app tutorial/info",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "Info",
        subheading: "App related information.",
        paragraphBody: "(1) The algorithm will find the shortest path between point A(start square) and point B(end square). (2) Dijkstra's algorithm guarantees the shortest path between two nodes in a graph. (3) Moving from a square to another has a 'cost' of one. Additionally, each square has a weight of one by default. (4) Wall squares are untraversable/impenetrable, in other words, these squares are not taken into account while searching for the shortest path. Moreover, a path cannot use use a wall sqaure or cross throught them in the search for the shortest path to the 'end' square",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.dummyData = {
        title: "More info....",
        subheading: "More plz!",
        paragraphBody: "(5) This is considered the eager implementation of Dijkstra's algorithm because it uses an indexed priority D-ary heap. This heap improvement with the decrease key functionality added, enhances performance of the algorithm. (6) The indexed priority heap allows the algorithm to avoid having duplicate key-value pairs and has faster value updating which improves the speed of the Dijkstra's Algorithm. (7) D-ary heap is a version of a heap: each node(parent) has 'D' number of children. (7) A adjacency list helps Dijkstra's Algorithm in lowering the storage space required to store all of a vertice's neighbours(when compared to an adjacency matrix).",
      }
      this.testLinkLink.insertNewLink(this.dummyData);
      this.testLinkLink.reverseLinkList();

  }

  // private initializeModalContent(): void {

  // }

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
