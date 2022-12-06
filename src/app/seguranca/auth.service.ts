import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokensRevokeUrl = environment.apiUrl + '/tokens/revoke';
  oauthTokenUrl = environment.apiUrl + '/oauth/token'
  /* Payload é um json com várias propriedades */
  jwtPayload: any;

  constructor(private http: HttpClient,
    private jwtHelper: JwtHelperService
    ) {
      this.carregarToken();
     }

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

    /* A requisição crosside(de portas diferentes) não armazena o cookie somente se colocarmos  withCredentials: true
    no login e no obter novo acesso token */
    return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
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

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAbmd1bEByMA==');

    const body = 'grant_type=refresh_token';

    return this.http.post<any>(this.oauthTokenUrl, body,
      { headers, withCredentials: true })
      .toPromise()
      .then((response: any) => {
        this.armazenarToken(response['access_token']);

        console.log('Novo access token criado!');

        return Promise.resolve();
      })
      .catch(response => {
        console.error('Erro ao renovar token.', response);
        return Promise.resolve();
      });
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles: any) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
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

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  /* O logout nada mais é do que não ter o acesstoken e nem o refresh token */
  /* Por termos criado um interceptador genérico para nossas requisições, podemos fazer a implementação do método
  logout no nosso componente auth.service, sem a necessidade de criar um novo componente para isso.
A razão para que possamos realizar esse procedimento dessa forma é que a única URL que não será interceptada pelo
 nosso método é /oauth/token, logo qualquer outra URL terá um token válido.*/
 /* O revoke faz com que o refreshtoken seja anulado. */
  logout() {
    return this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
      .toPromise()
      .then(() => {
        this.limparAccessToken();
      });
  }

}





