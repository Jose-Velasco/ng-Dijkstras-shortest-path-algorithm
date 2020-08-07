import { Component, OnInit } from '@angular/core';
import { MenuButtonsService } from 'src/app/services/menu-buttons.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isModalOpen: boolean = false;
  private ontoggleHelpModalSubscription: Subscription;

  constructor(private menuButtonsService: MenuButtonsService) { }

  ngOnInit() {
    this.ontoggleHelpModalSubscription = this.menuButtonsService.onHelpButtonActions
      .subscribe((toggleHelpModal:boolean) => {
        this.isModalOpen = toggleHelpModal;
      });
  }

  ontoggleCloseModal() {
    this.isModalOpen = false;
  }

}
