import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-product-filter',
  imports: [ReactiveFormsModule],
  templateUrl: './product-filter.html',
  styleUrl: './product-filter.css',
})
export class ProductFilterComponent implements OnInit{

  filterForm = new FormGroup({
    name: new FormControl(''),
    category: new FormControl(''),
    price: new FormControl(null),
    active: new FormControl('')
  });

  constructor(private productService: ProductService){}

  ngOnInit(){
    this.filterForm.valueChanges.subscribe(valores =>{
      this.productService.filtrarProductos(valores)
    });
  }

  limpiar(){
    this.filterForm.reset({
      name: '',
      category: '',
      price: null,
      active: ''
    });

  }
}

  //Este codigo es para el FormsTemplate: Hay que poner en el import: import { FormsModule } y luego en el imports en el 
  //@Component hay que poner [FormsModule]

  /*filtros = {
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
  }*/
  

