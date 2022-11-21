import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  /* Payload é um json com várias propriedades */
  jwtPayload: any;

  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService
    ) { }

   /* Foi adicionado no then do método login() do AuthService o
   armezamento do token, através do método armazenarToken(response['
   access_token']), porém, é possível que seja lançado um erro
   acusando que a variável response é um tipo Object e que por
    isso, não é possível acessar a chave ['access_token']. Para
     resolver, basta que no response recebido pelo then() você
     acrescente a tipagem para any. O método login() Ficará assim */

 /*O response, do tipo any, foi alterado e agora se fizer o log() do que é retornado na response dentro
  do catch, o response.error retorna o seguinte objeto

  {error: 'invalid_grant', error_description: 'Usuário inexistente ou senha inválida'}

  Sendo assim, para que a lógica mostrada na aula funcione, será necessário tratar a resposta colocando
   mais um "error" no response.error, acessando assim corretamente o atributo do objeto que contém a
    string "invalid_grant".

  */

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body, { headers })
      .toPromise()
      .then((response: any) => {

        this.armazenarToken(response['access_token']);
      })
      .catch(response => {
        if (response.status === 400) {
          if (response.error.error === 'invalid_grant') {
            return Promise.reject('Usuário ou senha inválida!');
          }
        }

        return Promise.reject(response);
      });
  }

  public armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    console.log(this.jwtPayload);

    localStorage.setItem('token', token);
  }

  public carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

}

