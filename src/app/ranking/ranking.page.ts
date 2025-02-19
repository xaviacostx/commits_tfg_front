import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { AuthService } from '@auth0/auth0-angular';
import { IonContent, IonGrid, IonRow, IonCol, IonTitle,
    IonList, IonItem, IonLabel, IonBadge, IonButton,
    IonSelect, IonSelectOption, IonInput } from '@ionic/angular/standalone';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, IonGrid, IonRow, IonCol, IonTitle,
    IonList, IonItem, IonLabel, IonBadge, IonButton,
    IonSelect, IonSelectOption, IonInput]
})
export class RankingPage implements OnInit {

  constructor(private http: HttpClient, public auth: AuthService) {}

  rankingProductosVeces: any = [];
  rankingProductosCantidad: any = [];

  ngOnInit() {
    this.obtenerRankingCantidad();
    this.obtenerRankingGlobal();
    
  }


  obtenerRankingCantidad() {
    this.http.get('https://commits-tfg-back.onrender.com/ranking').subscribe(
      (response: any) => {
          this.rankingProductosCantidad = response;
          console.log(" Ranking de productos:", response);
      },
      (error) => {
          console.error(" Error al cargar el ranking de productos:", error);
      }
  );
  }
  obtenerRankingGlobal() {
    this.http.get('https://commits-tfg-back.onrender.com/ranking_veces').subscribe(
      (response: any) => {
          this.rankingProductosVeces = response;
          console.log(" Ranking de productos:", response);
      },
      (error) => {
          console.error(" Error al cargar el ranking de productos:", error);
      }
  );
  }
  
}
