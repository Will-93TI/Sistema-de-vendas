# Sistema de Gestão Administrativa (Web)

Protótipo web para gestão de:

- Materiais
- Faturamento de itens materiais e serviços
- Cadastro de clientes
- Cadastro de fornecedores
- Configuração de integração PIX
- Conciliação bancária

## Como rodar o sistema

### Opção 1 (recomendada)

```bash
./start.sh
```

Depois, abra:

- `http://localhost:8000`

Você também pode informar outra porta:

```bash
./start.sh 8080
```

### Opção 2 (direto com Python)

```bash
python3 -m http.server 8000
```

## Observações

- Os dados são persistidos no `localStorage` do navegador.
- Este projeto é um MVP de interface e regras básicas de cadastro/faturamento.
- Se você estiver vendo título antigo no navegador, faça um hard refresh (`Ctrl+F5`) para limpar cache.
