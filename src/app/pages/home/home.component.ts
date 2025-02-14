import { Component } from '@angular/core';
import { TestComponent } from "../test/test.component";

@Component({
  selector: 'app-home',
  imports: [TestComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
