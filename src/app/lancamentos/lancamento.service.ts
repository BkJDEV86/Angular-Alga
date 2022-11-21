import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Lancamento } from '../core/model';
import { firstValueFrom } from 'rxjs';


/* Aqui é definido um contrato, ao invés de colocar any podemos colocar
filtro: LancamentoFiltro por exemplo */
/* O Typescript exige que as variáveis sejam declaradas e inicializadas. Para variáveis de
 tipo string utilizar a string vazia resolve o problema. Entretanto, para datas não é
 possível inicializar com valor null, pois o tipo Date não permite isso. Sendo assim, é
  necessário declarar a variável como opcionais, da seguinte forma. */
 /* Com classe conseguimos definir uma prropriedade e colocar um valor para ela
 com interface não... por isso mudamos */
  export class LancamentoFiltro {
    descricao?: string;
    dataVencimentoInicio?: Date;
    dataVencimentoFim?: Date;
    pagina = 0;
    itensPorPagina = 5;
  }

@Injectable({
  providedIn: 'root'
})



export class LancamentoService {



  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient,
    private datePipe: DatePipe) { }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {






   /* HttpParams é um componente imutável, o que significa que toda alteração feita em um
   objeto deste tipo, irá resultar em um novo objeto e não irá alterar a instância atual.
    Portanto, toda vez que chamarmos um método desta classe que deve alterar o seu estado,
     precisamos fazer uma nova atribuição: */

  /* Precisamos atribuir o resultado do método "set" novamente à variável "params" */
    let params = new HttpParams()
      .set('page', filtro.pagina)
      .set('size', filtro.itensPorPagina);

    /* Aqui estamos adicionando um parâmetro que depois vamos colocar no parâmetro de busca */
    if (filtro.descricao) {
      params = params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.set('dataVencimentoDe', this.datePipe.transform(filtro.dataVencimentoInicio, 'yyyy-MM-dd')!);
    }

    if (filtro.dataVencimentoFim) {
      params = params.set('dataVencimentoAte', this.datePipe.transform(filtro.dataVencimentoFim, 'yyyy-MM-dd')!);
    }


    return this.http.get(`${this.lancamentosUrl}?resumo`, { params })
    .toPromise()
    .then((response: any) => {
      const lancamentos = response['content'];

      const resultado = {
        /*Aqui abaixo temos lançamento: lancamentos . Abaixo é a abreviação
         o primeiro lancamentos da igualdade é uma propriedade e o segundo é o da
        const lancamentos = response['content']; */
        lancamentos,
        total: response['totalElements']
      };

      return resultado;
    });
}

   excluir(codigo: number): Promise<void> {


  return this.http.delete<void>(`${this.lancamentosUrl}/${codigo}`)
    .toPromise();
}

adicionar(lancamento: Lancamento): Promise<Lancamento> {


  return firstValueFrom(this.http.post<Lancamento>(this.lancamentosUrl, lancamento))

}
/* Nessa versão do rxjs, o "toPromisse" foi depreciado, e o retorno dele foi alterado, agora
 é preciso utilizar a função "firstValueFrom" para gerar um promisse a partir de um
 observable.*/

 atualizar(lancamento: Lancamento): Promise<Lancamento> {


  return firstValueFrom(this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento, ))
    .then((response: any) => {
    this.converterStringsParaDatas([response]);

    return response;
  });
}

buscarPorCodigo(codigo: number): Promise<Lancamento> {


  return this.http.get(`${this.lancamentosUrl}/${codigo}`)
    .toPromise()
    .then((response: any) => {
      this.converterStringsParaDatas([response]);

      return response;
    });
}

private converterStringsParaDatas(lancamentos: Lancamento[]) {
  for (const lancamento of lancamentos) {
    let offset = new Date().getTimezoneOffset() * 60000;

    lancamento.dataVencimento = new Date(new Date(lancamento.dataVencimento!).getTime() + offset);

    if (lancamento.dataPagamento) {
      lancamento.dataPagamento = new Date(new Date(lancamento.dataPagamento).getTime() + offset);
    }
  }
}

}

/* Outra mudança a ser realizada é a localização do método. Como no modelo de
Observables a requisição na classe de serviço fica mais resumida, sem o then
 presente no modelo de Promises, é necessário transferir o método para o componente
  de cadastro de lançamentos (lancamento-cadastro.component), onde será utilizado
  quando for realizado o subscribe da requisição. */
