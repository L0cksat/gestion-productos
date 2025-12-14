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

  // Este es el método para realizar la aplicación del filtro de productos por nombre.
  filtrarPorNombre(nombre: string){

    const filtrados = this.productosOriginales.filter(p => p.name.toLowerCase().includes(nombre.toLowerCase()))

    this.productosSubject.next(filtrados)
    
  }

  // Este es el método para realizar la aplicación del filtro de productos por categoría.
  filtrarPorCategoria(categoria: string){

    const filtrados = this.productosOriginales.filter(p => p.category.toLowerCase().includes(categoria.toLowerCase()))

    this.productosSubject.next(filtrados)
  }

  // Este es le método para realizar la aplicación del filtro de productos por activos.
  filtrarPorActivos(SoloActivos: boolean){

    const filtrados = SoloActivos
    ? this.productosOriginales.filter(p => p.active)
    : this.productosOriginales

    this.productosSubject.next(filtrados)
  }

  // Metodo para limpar los filtros aplicados, recuperando la lista de productos originales
  // Cada nuevo producto creado se borrarán. 
  limpiarFiltros(){
    this.productosSubject.next(this.productosOriginales)
  }
  
}
