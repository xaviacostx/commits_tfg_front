import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
    IonGrid, IonRow, IonCol, IonList,
    IonItem, IonLabel, IonBadge, IonButton } from '@ionic/angular/standalone';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { AuthService } from '@auth0/auth0-angular';






@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, RouterLink,  IonContent, IonHeader, IonTitle, IonToolbar,
    IonContent, IonGrid, IonRow, IonCol, IonTitle, IonList,
    IonItem, IonLabel, IonBadge, IonButton  ]
})
export class HomePage implements OnInit {
  // public user = {
  //   id: '',
  //   nombre: ''
  // };

  public productos:any = [];

  public total_consumido: any = [];
  public totalGrasas: number = 0;
  public totalHidratos: number = 0;
  public totalProteinas: number = 0;
  public totalKcal: number = 0;
  public total_consumido_dia: any = [];
  public total_consumido_mes: any = [];
  public total_consumido_ano: any = [];



  public dia: any = {
    grasas: 0,
    proteinas: 0,
    hidratos: 0,
    kcal: 0,
  }
  public mes: any = {
    grasas: 0,
    proteinas: 0,
    hidratos: 0,
    kcal: 0,
  }

  public ano: any = {
    grasas: 0,
    proteinas: 0,
    hidratos: 0,
    kcal: 0,
  }

  public host: string = 'https://commits-tfg-back.onrender.com';


  constructor(private http: HttpClient, public auth: AuthService) { }
  
  public auth_user: any;
  public db_user: any;


  
  ngOnInit() {
    this.auth.user$.subscribe((data: any) => {
      if (!data) {
        console.warn(" No hay datos de usuario aún.");
        return;
      }
  
      this.auth_user = data;
      console.log(" Usuario autenticado:", this.auth_user);
  
      // Verificamos si el email existe antes de llamar a loadUser()
      if (this.auth_user.email) {
        console.log(" Email encontrado:", this.auth_user.email);
        this.loadUser();
      } else {
        console.error(" auth_user.email sigue siendo undefined.");
      }
    });
  }
    
    
  

  loadUser() {
    if (!this.auth_user || !this.auth_user.email) {
        console.error(" No se puede cargar el usuario porque auth_user.email es undefined.");
        return;
    }

    console.log(" Cargando usuario desde DB:", this.auth_user.email);

    this.http.get(`https://commits-tfg-back.onrender.com/user/${this.auth_user.email}`).subscribe(
        (response: any) => {
            if (response && response !== 'User not found') {
                console.log(" Usuario encontrado en la BD:", response);
                this.db_user = response;
                this.auth_user.id = response.id;
                this.auth_user.name = response.name;
                this.auth_user.picture = response.picture;
                
                // Cargar datos de consumo
                this.cargarDia();
                this.anadirConsumido();
                this.cargarMes();
                this.cargarAno();
            } else {
                console.warn(" Usuario no encontrado en la BD, creando usuario...");
                this.createUser();
            }
        },
        (error) => {
            console.error(" Error al cargar el usuario:", error);
        }
    );
}
  

createUser() {
  let user = {
      id: this.auth_user.email,
      name: this.auth_user.name,
      picture: this.auth_user.picture
  };

  this.http.post('https://commits-tfg-back.onrender.com/user', user).subscribe(
      (response: any) => {
          console.log(" Usuario creado correctamente:", response);
          this.db_user = user;
          this.auth_user.id = user.id;
          this.auth_user.name = user.name;
          this.auth_user.picture = user.picture;

          // Cargar datos de consumo después de crear usuario
          this.cargarDia();
          this.anadirConsumido();
          this.cargarMes();
          this.cargarAno();
      },
      (error) => {
          console.error(" Error al crear usuario:", error);
      }
  );
}

cargarDia() {
  if (!this.auth_user || !this.auth_user.email) {
      console.error(" No se puede cargar los datos del día porque el usuario no está autenticado.");
      return;
  }

  let fechaActual = new Date().toISOString().split('T')[0];

  this.http.get(`https://commits-tfg-back.onrender.com/total_consumido_dia/${this.auth_user.email}/${fechaActual}`)
      .subscribe((response: any) => {
          this.total_consumido_dia = response;
          console.log(' Datos cargados en total_consumido_dia:', response);
          this.calcularDia();
      }, (error) => {
          console.error(" Error al cargar los datos diarios:", error);
      });
}

cargarMes() {
  if (!this.auth_user || !this.auth_user.email) {
      console.error(" No se puede cargar los datos del mes porque el usuario no está autenticado.");
      return;
  }

  let fechaMes = new Date().toISOString().slice(0, 7);

  this.http.get(`https://commits-tfg-back.onrender.com/total_consumido_mes/${this.auth_user.email}/${fechaMes}`)
      .subscribe((response: any) => {
          this.total_consumido_mes = response;
          console.log(' Datos cargados en total_consumido_mes:', response);
          this.calcularMes();
      }, (error) => {
          console.error(" Error al cargar los datos mensuales:", error);
      });
}

  cargarAno() {
    if (!this.auth_user || !this.auth_user.email) {
        console.error(" No se puede cargar los datos del año porque el usuario no está autenticado.");
        return;
    }

    let anoActual = new Date().getFullYear();

    this.http.get(`https://commits-tfg-back.onrender.com/total_consumido_ano/${this.auth_user.email}/${anoActual}`)
        .subscribe((response: any) => {
            this.total_consumido_ano = response;
            console.log(' Datos cargados en total_consumido_ano:', response);
            this.calcularAno();
        }, (error) => {
            console.error(" Error al cargar los datos anuales:", error);
        });
}


  anadirConsumido(){
    this.http.get(`https://commits-tfg-back.onrender.com/prueba_total_consumido`).subscribe((response: any) => {
      this.total_consumido = response; // Asigna los datos recibidos
      console.log('Datos cargados en total_consumido:', this.total_consumido);
  
      // Calcula los totales después de cargar los datos
      this.calcularTotales();
      console.log(this.total_consumido);
    });
  }



  calcularDia(){
this.total_consumido_dia.forEach((item: any) => {
  this.dia.grasas = this.dia.grasas + Number(item.grasas || 0)
  this.dia.hidratos = this.dia.hidratos + Number(item.hidratos_de_carbono || 0)
  this.dia.proteinas = this.dia.proteinas + Number(item.proteina || 0)
  this.dia.kcal = this.dia.kcal + Number(item.kcal || 0)

  this.dia.grasas = Number(this.dia.grasas.toFixed(3));
  this.dia.hidratos = Number(this.dia.hidratos.toFixed(3));
  this.dia.proteinas = Number(this.dia.proteinas.toFixed(3));
  this.dia.kcal = Number(this.dia.kcal.toFixed(3));
})
}

calcularMes(){
  this.total_consumido_mes.forEach((item: any) => {
    this.mes.grasas = this.mes.grasas + Number(item.grasas || 0)
    this.mes.hidratos = this.mes.hidratos + Number(item.hidratos_de_carbono || 0)
    this.mes.proteinas = this.mes.proteinas + Number(item.proteina || 0)
    this.mes.kcal = this.mes.kcal + Number(item.kcal || 0)
  });
  
    this.mes.grasas = Number(this.mes.grasas.toFixed(3));
    this.mes.hidratos = Number(this.mes.hidratos.toFixed(3));
    this.mes.proteinas = Number(this.mes.proteinas.toFixed(3));
    this.mes.kcal = Number(this.mes.kcal.toFixed(3));

  }

  calcularAno(){
    this.total_consumido_ano.forEach((item: any) => {
      this.ano.grasas = this.ano.grasas + Number(item.grasas || 0)
      this.ano.hidratos = this.ano.hidratos + Number(item.hidratos_de_carbono || 0)
      this.ano.proteinas = this.ano.proteinas + Number(item.proteina || 0)
      this.ano.kcal = this.ano.kcal + Number(item.kcal || 0)
    
      this.ano.grasas = Number(this.ano.grasas.toFixed(3));
      this.ano.hidratos = Number(this.ano.hidratos.toFixed(3));
      this.ano.proteinas = Number(this.ano.proteinas.toFixed(3));
      this.ano.kcal = Number(this.ano.kcal.toFixed(3));
    })
    }


















  calcularTotales(){
    this.total_consumido.forEach((item: any) => {
      this.totalGrasas = this.totalGrasas + Number(item.grasas || 0);
      this.totalProteinas += Number(item.proteina || 0);
      this.totalHidratos += Number(item.hidratos_de_carbono || 0);
      this.totalKcal += Number(item.kcal || 0);})

      console.log('Totales calculados:');
      console.log('Grasas:', this.totalGrasas);
      console.log('Proteinas:', this.totalProteinas);
      console.log('Hidratos:', this.totalHidratos);
      console.log('Kcal:', this.totalKcal);

      this.totalGrasas = Number(this.totalGrasas.toFixed(3));
      this.totalProteinas = Number(this.totalProteinas.toFixed(3));
      this.totalHidratos = Number(this.totalHidratos.toFixed(3));
      this.totalKcal = Number(this.totalKcal.toFixed(3));

      
      console.log('Totales calculados maximo 3 digitos decimales:');
      console.log('Grasas:', this.totalGrasas);
      console.log('Proteinas:', this.totalProteinas);
      console.log('Hidratos:', this.totalHidratos);
      console.log('Kcal:', this.totalKcal);
  }
  


  }

