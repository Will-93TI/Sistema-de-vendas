# Sistema de Vendas (Web)

Protótipo web para gestão de:

- Materiais
- Faturamento de itens materiais e serviços
- Cadastro de clientes
- Cadastro de fornecedores
- Configuração de integração PIX
- Conciliação bancária

## Como executar

Como o projeto é front-end puro (HTML/CSS/JS), você pode abrir `index.html` diretamente no navegador.

Ou, se preferir um servidor local:

```bash
python3 -m http.server 8000
```

Acesse: `http://localhost:8000`

## Observações

- Os dados são persistidos no `localStorage` do navegador.
- Este projeto é um MVP de interface e regras básicas de cadastro/faturamento.