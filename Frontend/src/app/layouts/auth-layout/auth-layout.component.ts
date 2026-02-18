import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalToastContainerComponent } from '../../components/global-toast-container/global-toast-container.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, GlobalToastContainerComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {
  
}
