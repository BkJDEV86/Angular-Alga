import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-pessoas-grid',
  templateUrl: './pessoas-grid.component.html',
  styleUrls: ['./pessoas-grid.component.css']
})
export class PessoasGridComponent  {

  /* A propriedade pessoas é uma entrada para o componente  */
  @Input() pessoas: any[] = [];

}
