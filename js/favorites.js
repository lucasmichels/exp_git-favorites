import { GithubUser  } from "./githubuser.js"

//lógica dos dados e como serão estruturados
export class Favorites {
    constructor(root) { //root -> app
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:'))  || [] 
        //parse transforma string em objeto{} ou array[]
        //pega os itens que estão salvos no localStorage @github-favorites
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries)) 
        //transforma objeto do javascript para um objeto do tipo texto em string
    }

    async add(username) { //async faz com que esperece pela promessa para prosseguir
        try {

            const userExists = this.entries.find(entry => entry.login === username)
            //verifica se o user já existe nos entries

            if(userExists) {
                throw new Error('Usuário já cadatrado!')
            }

            const user = await GithubUser.search(username)
            //faz a pesquisa no github com o usernama enviado

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries] //adiciona o novo usuário encima, cria um novo array (... -> spread operator)
            this.update()
            this.save()

        }   catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries
            .filter(entry => entry.login !== user.login) //se falso vai eliminar
            //checando se o entry e user são diferentes

        this.entries = filteredEntries //para fazer um novo array somente com os não deletados
        this.update() //atualizando a página para deletar o desejado
        this.save()
    }
}

//cria a visualização e eventos do HTML
export class FavoritesView extends Favorites {
    constructor(root) {
        super(root) //criando o link entre as classes

        this.tbody = this.root.querySelector('table tbody')
        //criando variavel para tbody que será usado depois diversas vezes

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button') //cria o button no javascript
        addButton.onclick = () => { //quando for clicado o botão
            const { value } = this.root.querySelector('.search input') //desestruturando o input para pegar somente o value
            this.add(value) //joga o value para função add descrita no Favorites
        }
    }

    update() {
        this.removeAllTr()
        this.createRow()

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png` //adicionando item em seu devido lugar
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row) //adicionar itens ao row
        })

        let tableLines = document.querySelector('table').rows.length
        const emptyTable = document.querySelector('.empty')

        if(tableLines > 1) {
            emptyTable.classList.add('hidden')
            this.tbody.classList.remove('hidden')
        } else {
            emptyTable.classList.remove('hidden')
            this.tbody.classList.add('hidden')
        }
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = ` 
        <td>
            <div class="user">
                <img src="" alt="" >
                <div class = "username'">
                    <p></p>
                    <a href="" target="_blank">
                        <span></span>
                    </a>
                </div>
            </div>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9589
        </td>
        <td>
            <button class="remove">Remover</button>
        </td>
        ` //estrutura do HTML para conseguir adicionar os dados corretos

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}