import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonGrid, IonRow, IonCol, IonTitle,
    IonList, IonItem, IonLabel, IonBadge, IonButton } from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule,
    IonContent, IonGrid, IonRow, IonCol, IonTitle,
    IonList, IonItem, IonLabel, IonBadge, IonButton]
})
export class LogInPage implements OnInit {

  constructor(@Inject(DOCUMENT) public document: Document, private auth: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.auth.loginWithRedirect({
      appState: {
        target: '/home'
      }
    })
  }

  logout() {
    this.auth.logout({ 
      logoutParams: {
        returnTo: this.document.location.origin 
      }
    });
}
}