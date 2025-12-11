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

  // Este es el método para realizar la aplicación de los filtros a los productos.
  filtrarProdcutos(filtros: any){

    // Creamos la variable para que pueda ser cambiado (let en vez de const)
    let productosFiltrados = this.productosOriginales

    //Aquí ya implementamos los filtros que aparecerán en la página, 
    // los cuales usaremos para realizar el filtro de los productos
    // Emepezamos con el filtro para el nombre
    //Pedimos dentro del if que busque y comprueba que el producto que intentamos filtar tenga nombre, categoria, etc
    //si lo tiene entonces lo convierte a minusculas y lo busca, si no lo tiene se descarta y pasa al siguente sin intentar convertirlo (en el caso de un string).
    if (filtros.name){
      productosFiltrados = productosFiltrados.filter(p =>
        p.name && p.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    if (filtros.category){
      productosFiltrados = productosFiltrados.filter(p =>
        p.category && p.category.toLowerCase().includes(filtros.category.toLowerCase())
      );
    }

    if (filtros.price){
      productosFiltrados = productosFiltrados.filter(p =>
        p.price <= filtros.price
      );
    }

    //Aquí con el filtro del Estado le pedimos en el if que comprube cual de los estados viene,
    //si es vacio "" entonces no filtra nada ya que no devuleve true o false. En el caso de isActiveFilter, va a comprobar lo que le llega
    //desde el HTML, si es un true lo convierte en String (por si acaso) y devuelve true, mostrando los Activos.
    //En el caso de los Inactivos, hace lo mismo pero con false, comprueba, devuelve false en String y muestra los Inactivos.

    // Con el productosFiltrados conseguimos que protegernos de datos "sucios" del JSON que llamamos a través del API
    // con la variable productActiveStatus preguntamos que si es true o false en el atributo active, y lo comparamos con isActiveFilter para mostrar
    // ACtivo o Inactivo. Si no tiene campo o es no definido automáticamente devuelve false.
    if ( filtros.active !== '' && filtros.active !== null && filtros.active !== undefined){
      const isActiveFilter = String(filtros.active) === 'true'

      productosFiltrados = productosFiltrados.filter(p => {
        const productActiveStatus = p.active === true
        return productActiveStatus === isActiveFilter
      });
    }

    this.productosSubject.next(productosFiltrados)
  }

  // Metodo para limpar los filtros aplicados, recuperando la lista de productos originales
  // Cada nuevo producto creado se borrarán. 
  limpiarFiltros(){
    this.productosSubject.next(this.productosOriginales)
  }
  
}
