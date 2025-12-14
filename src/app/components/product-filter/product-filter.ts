import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-filter',
  imports: [CommonModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.css',
})
export class ProductFilterComponent {

  constructor(private productService: ProductService) {}

  onNombreChange(event: Event){
    const valor = (event.target as HTMLInputElement).value
    this.productService.filtrarPorNombre(valor)
  }

  onCategoriaChange(event: Event){
    const valor = (event.target as HTMLInputElement).value
    this.productService.filtrarPorCategoria(valor)
  }

  onActivoChange(event: Event){
    const marcado =(event.target as HTMLInputElement).checked
    this.productService.filtrarPorActivos(marcado)
  }

}

  

