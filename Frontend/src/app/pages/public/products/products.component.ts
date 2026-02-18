import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  products = [
    {
      id: 1,
      name: 'Keripik Mangga Arumanis',
      description: 'Manis alami tanpa tambahan gula, renyah di setiap gigitan.',
      price: 25000,
      image: '🥭',
      category: 'Buah Kering',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Keripik Nangka Super',
      description: 'Aroma nangka yang khas dengan tekstur super crispy.',
      price: 28000,
      image: '🍈',
      category: 'Buah Kering',
      rating: 4.9
    },
    {
      id: 3,
      name: 'Keripik Salak Pondoh',
      description: 'Rasa unik manis sepat yang bikin ketagihan.',
      price: 22000,
      image: '🟤',
      category: 'Buah Kering',
      rating: 4.7
    },
    {
      id: 4,
      name: 'Keripik Apel Malang',
      description: 'Dibuat dari apel malang segar pilihan.',
      price: 24000,
      image: '🍎',
      category: 'Buah Kering',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Keripik Pisang Cavendish',
      description: 'Potongan tebal dengan rasa manis creamy.',
      price: 20000,
      image: '🍌',
      category: 'Buah Kering',
      rating: 4.5
    },
    {
      id: 6,
      name: 'Mix Fruit Chips',
      description: 'Campuran berbagai buah dalam satu kemasan.',
      price: 35000,
      image: '🥗',
      category: 'Mix',
      rating: 4.9
    }
  ];
}
