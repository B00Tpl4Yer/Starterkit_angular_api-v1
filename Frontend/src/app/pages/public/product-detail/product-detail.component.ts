import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  product = {
    id: 1,
    name: 'Keripik Mangga Arumanis',
    price: 25000,
    description: 'Rasakan sensasi mangga arumanis asli dalam bentuk keripik yang renyah. Diproses dengan suhu rendah (vacuum frying) sehingga nutrisi dan vitamin tetap terjaga.',
    weight: '100g',
    ingredients: ['Mangga Segar', 'Minyak Nabati'],
    rating: 4.8,
    reviews: 124,
    image: '🥭'
  };

  quantity = 1;

  incrementParam() {
    this.quantity++;
  }

  decrementParam() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
