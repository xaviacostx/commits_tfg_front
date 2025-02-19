import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { AuthService } from '@auth0/auth0-angular';
import { IonContent, IonGrid, IonRow, IonCol, IonTitle, IonList,
    IonItem, IonLabel, IonBadge, IonButton, IonSelect,
    IonSelectOption, IonInput } from '@ionic/angular/standalone';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    IonContent, IonGrid, IonRow, IonCol, IonTitle, IonList,
    IonItem, IonLabel, IonBadge, IonButton, IonSelect,
    IonSelectOption, IonInput ]
})
export class ProductosPage implements OnInit {
  public auth_user: any = null;
  public productos: any = [];
  public productoSeleccionado: any = null;
  public cantidadSeleccionada: number = 0;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe((data: any) => {
      if (!data) {
        console.warn(" No hay datos de usuario aún.");
        return;
      }
      this.auth_user = data;
      console.log(" Usuario autenticado:", this.auth_user);
      this.loadProductos();
    });
  }

  loadProductos() {
    if (!this.auth_user || !this.auth_user.email) {
      console.error(" No se puede cargar productos porque el usuario no está autenticado.");
      return;
    }

    this.http.get(`https://commits-tfg-back.onrender.com/productos`).subscribe(
      (response: any) => {
        this.productos = response;
        console.log(" Productos cargados:", response);
      },
      (error) => {
        console.error(" Error al cargar productos:", error);
      }
    );
  }

  anadirProducto() {
    if (!this.auth_user || !this.auth_user.email) {
      console.error(" Error: No se puede añadir producto porque el usuario no está autenticado.");
      return;
    }

    if (!this.productoSeleccionado || !this.cantidadSeleccionada) {
      console.error(" Debes seleccionar un producto y una cantidad.");
      return;
    }

    let fechaActual = new Date().toISOString().split('T')[0];

    let nuevo_producto = {
      id_usuario: this.auth_user.email,
      id_producto: this.productoSeleccionado.id,
      nombre: this.productoSeleccionado.nombre,
      cantidad_consumida: this.cantidadSeleccionada,
      kcal: (this.cantidadSeleccionada / 100) * this.productoSeleccionado.kcal,
      grasas: (this.cantidadSeleccionada / 100) * this.productoSeleccionado.grasas,
      hidratos_de_carbono: (this.cantidadSeleccionada / 100) * this.productoSeleccionado.hidratos_de_carbono,
      proteina: (this.cantidadSeleccionada / 100) * this.productoSeleccionado.proteina,
      fecha: fechaActual
    };

    console.log(" Enviando producto a la BD:", nuevo_producto);

    this.http.post('https://commits-tfg-back.onrender.com/total_consumido', nuevo_producto).subscribe(
      (response: any) => {
        console.log(" Producto añadido correctamente:", response);
        this.loadProductos(); 
      },
      (error) => {
        console.error(" Error al realizar la solicitud POST:", error);
      }
    );
  }
}