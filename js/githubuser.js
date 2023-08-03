export class GithubUser {
    static search(username) {//pesquisa estática pelo usernam
        const endpoint = `https://api.github.com/users/${username}` //pesquisa o username na api

    return fetch(endpoint) //pega data from endpoint(api)
        .then(data => data.json()) //pega os dados da api e transorma em json para poder adicionar ao local storage
        .then( //desestruturando os dados e pegando oq vai ser necessário utilizar
            ({login, name, public_repos, followers}) => ({
                login,
                name,
                public_repos,
                followers
            })
        )
    }
}