import { Component, OnInit, NgModule } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InputMask } from 'primeng/inputmask';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  NgModule(){
  InputMask
  }

  salvar(form: NgForm) {
    console.log(form);

  }

  constructor() { }

  ngOnInit(): void {
  }

}
