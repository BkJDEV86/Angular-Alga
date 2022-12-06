import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

/* Como estamos utilizando o módulo HttpClient, temos uma maior flexibilidade para realizar determinadas tarefas, e uma dessas é a interceptação.
Podemos, ao invés de criar um Wrapper das chamadas, e fornecer uma nova instância do objeto http, podemos simplesmente criar uma classe que é um interceptador.
Para isso, precisaremos, criar um arquivo que podemos chamar de money-http-interceptor.ts, dentro do módulo segurança.
Vamos precisar injetar nosso AuthService.*/

/*A partir da versão 2.2 no typescript não podemos mais herdar de erro, logo teremos
que exportar a classe NotAuthenticatedError */
export class NotAuthenticatedError { }


@Injectable()
export class MoneyHttpInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('/oauth/token') && this.auth.isAccessTokenInvalido()) {
      return from(this.auth.obterNovoAccessToken())
        .pipe(
          mergeMap(() => { /*Buscando um acesstoken mesmo ele sendo inválido eu vou buscar
          um novo acess token , senão encontrar lançaremos um erro. */
            if (this.auth.isAccessTokenInvalido()) {
              throw new NotAuthenticatedError();
            }
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });

            return next.handle(req);
          })
        );
    }

    return next.handle(req);
  }
}

/*Primeiramente fazemos duas validações, uma pra saber se não estamos nos referindo ao
path "/oauth/token" e outra para sabermos se o nosso token está inválido.

Se o path for /oauth/tokenNeste caso, estamos fazendo uma busca por um token válido, o que
 significa que nosso token atual já foi invalidado. Se não validarmos o request para este
path, entraremos em um loop infinito.

Se o token está inválido Aqui checamos se nosso token está inválido, e se estiver,
precisamos obter um novo, através do "/oauth/token" Se essas duas validações passarem,
 precisamos obter um novo access token antes de realizarmos a chamada ao nosso backend.

Utilizamos o operador "from" para que possamos transformar nossa Promise
 (retornada pelo método "obterNovoAccessToken") em um Observable, que é o tipo de retorno
  esperado pelo intercept.

Utilizamos o método "pipe" do Observable que irá nos ajudar a encadear outras operações
 neste mesmo Observable.

Dentro do método "pipe", usamos um outro operador chamadao "mergeMap", ele fará a
"junção" dos dois Observable, o primeiro é o método "obterNovoAccessToken" e o segundo
 será o nosso retorno, que vem de "handle.next(req)"

Com isso, aguardamos o retorno do método "obterNovoAccessToken" e podemos adicionar o
Header Authorization, obtendo-o do localStorage. E por fim, chamamos a requisição original.

Caso o token esteja válido ou se estivermos de fato fazendo uma requisição para
s/oauth/token, apenas redirecionamos para a requisição original. */
