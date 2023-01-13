import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {

  lancamentosUrl: string;

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }
  // Como já mencionado anteriormente, não utilizamos mais o AuthHttp, e
  //sim o HttpClient. Por este motivo precisamos fazer alguns ajustes com
  // relação a requisição.

  // Primeiro, a forma como enviamos os parâmetros. Não utilizaremos mais
  // a classe UrlSearchParams. O nome da propriedade também mudou. Ao
  //invés de "search" usamos agora "params". Para este fim, iremos usar
  //a classe HttpParams, do pacote '@angular/common/http'.

  // Também não vamos mais utilizar a classe "ResponseContentType", iremos
  // especificar o valor 'blob' como string.

  // Outra mudança será em função do não uso do momemnt.js, motivo pelo
  // qual trataremos a transformação do date para string da mesma forma que fizemos em LancamentoService.

  // Mais uma vez, como o objeto response já é a representação do objeto
  // de resposta em si, não precisamos utilizar o método "blob()"

  // O blob (Binary Large Object - grande objeto binário) é um campo
  //criado para o armazenamento de qualquer tipo de informações em formato
  // binário, dentro de uma tabela de um banco de dados


  relatorioLancamentosPorPessoa(inicio: Date, fim: Date) {
    const params = new HttpParams()
      .set('inicio', this.datePipe.transform(inicio, 'yyyy-MM-dd')!)
      .set('fim', this.datePipe.transform(fim, 'yyyy-MM-dd')!);

    return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa`,
      { params, responseType: 'blob' })
      .toPromise();
  }
}
