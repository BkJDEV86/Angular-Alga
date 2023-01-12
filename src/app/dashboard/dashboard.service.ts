import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Buscando os dados do dashboard
  lancamentosUrl: string;

  constructor(private http: HttpClient) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  lancamentosPorCategoria(): Promise<Array<any>> {
    let params = new HttpParams();
    params = params.set('mesReferencia', '2022-06-01');

    return this.http.get(`${this.lancamentosUrl}/estatisticas/por-categoria`, { params })
      .toPromise()
      .then((resposta: any) => {
        console.log(resposta);
        return resposta;
      });
  }

  lancamentosPorDia(): Promise<Array<any>> {
    return this.http.get(`${this.lancamentosUrl}/estatisticas/por-dia`)
      .toPromise()
      .then((response: any) => {
        const dados = response;
        this.converterStringsParaDatas(dados);

        return dados;
      });
  }

  //Esse mesmo código será responsável tanto por converter o string para Date, como
  // também para tratar o erro de datas em relação ao UTC, onde, se não for aplicado
  //o offset, a data será sempre exibida 1 dia antes do que foi persistido no banco
  //de dados.

  private converterStringsParaDatas(dados: Array<any>) {
    for (const dado of dados) {
      let offset = new Date().getTimezoneOffset() * 60000;

      dado.dia = new Date(dado.dia);
      dado.dia = new Date(new Date(dado.dia).getTime() + offset);
    }
  }
}
