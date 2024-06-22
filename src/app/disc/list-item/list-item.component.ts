import { Component, Input } from '@angular/core';
import { discModel } from '../disc.model';
import { ErrImgPipe } from '../../pipes/pipe/errImg/err-img.pipe';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [CommonModule, ErrImgPipe,RouterLink ],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {
  @Input() disc?: discModel;

  constructor() {

  }

}
