import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductFormComponent {
  @Output() productoCreado = new EventEmitter<any>();


  formulario = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    category: new FormControl('', [Validators.required, Validators.minLength(3)]),
    image: new FormControl(''),
    active: new FormControl(true)
  });
  
  enviar(){
    if (this.formulario.valid){
      this.productoCreado.emit(this.formulario.value);
    this.formulario.reset(
      {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      active: true
      }
    )
    }else{
      this.formulario.markAllAsTouched()
    }
    
  }
 
}
