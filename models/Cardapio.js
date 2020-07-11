class Cardapio{
    constructor(nome,descricao,img,preco){
        this.nome = nome;
        this.descricao = descricao;
        this.img = img;
        this.preco = preco;
    }
    alterarProduto(novoNome=this.nome,novaDescricao=this.descricao,novaImg=this.img,novoPreco=this.preco){
        this.nome = novoNome;
        this.descricao = novaDescricao;
        this.img = novaImg;
        this.preco = novoPreco;
    }
    
}