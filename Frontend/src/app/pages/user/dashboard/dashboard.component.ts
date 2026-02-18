import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;

  stats: StatCard[] = [
    {
      title: 'Total Penjualan',
      value: 'Rp 45.6M',
      change: '+12.5%',
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'from-purple-600 to-blue-500'
    },
    {
      title: 'Pesanan Baru',
      value: '156',
      change: '+8.3%',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Produk Aktif',
      value: '89',
      change: '+2.1%',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      title: 'Pelanggan',
      value: '1,234',
      change: '+15.7%',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Get current user from AuthService
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    // Fetch latest user data from API
    this.authService.getUser().subscribe({
      next: (response) => {
        console.log('User data loaded:', response);
      },
      error: (error) => {
        console.error('Error loading user:', error);
      }
    });
  }
}
