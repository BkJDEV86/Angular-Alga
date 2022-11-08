import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl!: 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient) { }


  pesquisar(): Promise<any> {

    /*Como tem uma camada de segurança basic na aplicação é necessário passar
    a autorização abaixo */
    const headers = new HttpHeaders()

      .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');



    return this.http.get(`${this.lancamentosUrl}?resumo`, { headers })

      .toPromise()

      .then((response : any) => response['content']);

  }




}
