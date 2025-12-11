import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-filter',
  imports: [FormsModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.css',
})
export class ProductFilterComponent {

  filtros = {
    name: '',
    category: '',
    price: 0,
    active: ''
  }

  constructor(private productService: ProductService){}

  aplicarFiltros(){
    this.productService.filtrarProdcutos(this.filtros)
  }

  limpiar(){
    this.filtros = {
      name: '',
      category: '',
      price: 0,
      active: ''
    }

    this.productService.limpiarFiltros();
  }

  
}
