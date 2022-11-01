import { Component, Input} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-message',
  /*Se o método temErro() retornar true mostra a div senão não mostra  */
  template: `

       <div *ngIf="temErro()" class="p-message p-message-error">
         {{ text }}
        </div>

  `,
  styles: [  `
  .p-message-error {
    margin: 0;
    margin-top: 4px;
    padding: 3px;
  }

  `]
})

export class MessageComponent {

/* O decorator @Input ou a propriedade Inputs são usadas para passar dados do componente pai
 para o filho. No componente filho incluímos o decorator @Input(), definindo que a propriedade
  autor poderá ser alterada pelo componente pai.*/

  /* As versões mais recentes do Angular forçam algumas práticas do Typescript, como a
   inicialização das variáveis */
   /* O problema maior é que estamos passando uma variável do tipo NgForm (descricao, por exemplo)
   para um componente que recebe uma entrada do tipo FormControl (control, no componente message).
    Nas versões anteriores do Typescript e do Angular essa diferença era simplesmente ignorada e
     tudo funcionava bem. Agora tem que ter a concordância estrita de tipos, a não ser que seja
      alterada a configuração do TSLint, o que não é uma boa ideia a longo prazo.
Uma forma de resolver esse problema é passar uma variável do tipo control para o componente. Para
 isso basta adicionar '.control' em cada um dos campos em que existe verificação. Por exemplo

 <app-message [control]="cidade.control" error="required"
    text="Informe a cidade"></app-message>*/
    /* Além disso, como a variável control pode estar indefinida em algumas situações, é
     interessante adaptar o código do componente de mensagem para esse caso  */
  @Input() error: string = '';
  @Input() control?: FormControl;
  @Input() text: string = '';

  /*Aqui abaixo é colocado this.error pois não sabemos se o erro é required
  ou minlenght por exemplo */
 temErro(): boolean {
  return this.control ? this.control.hasError(this.error) && this.control.dirty : true ;
 }


}
