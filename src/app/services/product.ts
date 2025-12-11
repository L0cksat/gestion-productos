import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  active: boolean; 
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private url = 'https://api.npoint.io/1dee63ad8437c82b24fe'

  private productosSubject = new BehaviorSubject<Product[]>([]);
  productos$ = this.productosSubject.asObservable();

  private productosOriginales: Product[] = [];

  constructor (private http: HttpClient){

  }

  cargarProductos(){
    this.http.get<Product[]>(this.url).subscribe({
      next: (productos) => {
        this.productosOriginales = productos;
        this.productosSubject.next(productos);
      },
      error: (err) => console.error('Error al cargar productos: ', err)
    })
  }

  agregarProductos(datos: any){
    const nuevoProducto: Product = {
      _id: crypto.randomUUID(), // La trampilla que genera la ID único --IMPORTANTE-
      name: datos.name,
      description: datos.description,
      price: datos.price,
      category: datos.category,
      image: datos.image,
      active: datos.active
    };
    // Esto es para poder añadir el nuevo producto al principio de la lista
    this.productosOriginales =[nuevoProducto, ...this.productosOriginales];

    // Esto es para emitir la nueva lista pra que Angular actualice la vista.
    this.productosSubject.next(this.productosOriginales);

  }

  eliminarProducto(id: string){
    this.productosOriginales = this.productosOriginales.filter(p => p._id !== id)
    this.productosSubject.next(this.productosOriginales)
  }

  filtrarProdcutos(filtros: any){

    console.log('Filtros aplicados: ', filtros)

    let productosFiltrados = this.productosOriginales

    if (filtros.name){
      productosFiltrados = productosFiltrados.filter(p =>
        p.name && p.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    if (filtros.category){
      productosFiltrados = productosFiltrados.filter(p =>
        p.category &&p.category.toLowerCase().includes(filtros.category.toLowerCase())
      );
    }

    if (filtros.price){
      productosFiltrados = productosFiltrados.filter(p =>
        p.price <= filtros.price
      );
    }

    if ( filtros.active !== '' && filtros.active !== null && filtros.active !== undefined){
      const isActiveFilter = String(filtros.active) === 'true'

      console.log('Filtrando por estado activo:', isActiveFilter);

      productosFiltrados = productosFiltrados.filter(p => {
        const productActiveStatus = p.active === true
        return productActiveStatus === isActiveFilter
      });
    }

    console.log('Resultados encontrados:', productosFiltrados.length);

    this.productosSubject.next(productosFiltrados)
  }

  limpiarFiltros(){
    this.productosSubject.next(this.productosOriginales)
  }
  
}
