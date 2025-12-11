import { Component, Input, EventEmitter } from '@angular/core';
import { Product } from '../../services/product';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-products-card',
  imports: [],
  templateUrl: './products-card.html',
  styleUrl: './products-card.css',
})
export class ProductsCard {
  @Input() product!: Product;

  constructor (private productService: ProductService){}

  eliminar(){
    this.productService.eliminarProducto(this.product._id)
  }

}
