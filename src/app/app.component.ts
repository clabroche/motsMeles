import { Component } from '@angular/core';
import { GridService } from './providers/grid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'motsMelees';
  constructor(public gridService: GridService) {

  }
}
