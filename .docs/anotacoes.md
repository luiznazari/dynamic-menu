
## Pontos gerais
- Menu com aninhamento infinito
- API para cadastro por item

## Tecnologias
- NodeJS
- MongoDB (mongoose)

## Backend
1. Deverá conter um endpoint para cadastro de um item de Menu:
   - Path: Post -> /api/v1/menu
   - Corpo da requisição (JSON):
     - name (string, único, não pode ser vazio ou nulo)
     - realatedId (numeric, relação com outro item, pode ser nulo, deve apontar se o item possui relação com algum outro item (caso sim, deverá ser um id válido))
   - Corpo da resposta (JSON)
     - id (numeric, Código do Menu)

2. Deverá conter um endpoint para exclusão de um item de Menu:
   - Path: Delete -> /api/v1/menu/{id}

3. Deverá conter um endpoint para obter o menu formatado, conforme exemplo acima:
   - Path: Get -> /api/v1/menu
   - Corpo da resposta (JSON)
     - Array
       - id (numeric)
       - name (string)
       - submenus (Array)
         - id
         - name



---------

id 1
pid -

id 2
pid 1 -> 5 -> error

id 3
pid -

id 4
pid 2

id 5
pid 4