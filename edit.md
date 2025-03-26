
//POST
//Criar funcionario
https://biometrico.itaguai.rj.gov.br/funci/funcionario
{
  "nome": "Marcelo Pastor",
  "cpf": "123.456.789-00",
  "cargo": "Programador senior Java",
  "unidade_id": "6",
  "data_admissao": "2025-01-20",
  "id_biometrico": "aseiouhnvaçwoeniuhwaj",
  "matricula": 42341
}



PUT
//Atualizar funcionario
https://biometrico.itaguai.rj.gov.br/funci/funcionario/:id
Exemplo de URL: https://biometrico.itaguai.rj.gov.br/funci/funcionario/098237dd-f20e-403f-9868-abaa57fd83ba
EXEMPLO DE BODY:
{
  "nome": "Rony Mao de Latex",
  "matricula": 15,
  "cargo": "Desenvolvedor Fullstack",
  "unidade": "CLINICA DA FAMILIA IBIRAPITANGA"
}
EXEMPLO DE RESPOSTA:
{
  "id": "098237dd-f20e-403f-9868-abaa57fd83ba",
  "nome": "Rony Mao de Latex",
  "matricula": 15,
  "cargo": "Desenvolvedor Fullstack",
  "unidade_id": "3b062732-73f3-4c5b-a48c-2a891c857eae"
}

GET
//Ler funcionario por id da unidade
https://biometrico.itaguai.rj.gov.br/funci/unidade/:id/funcionarios
EXEMPLO RESPOSTA:
{
    "id": "121262b8-bcd6-4de7-aae4-d24ebc1c15e3",
    "nome": "Carlos Silva",
    "cpf": "123.456.789-10",
    "cargo": "Analista",
    "data_admissao": "2023-01-15T00:00:00.000Z",
    "id_biometrico": "BIO123456",
    "matricula": 6
}



GET
// Ler todos os funcionarios
https://biometrico.itaguai.rj.gov.br/funci/funcionarios
EXEMPLO RESPOSTA:
{
    "funcionario_id": "c859a802-c5c9-4d77-8970-0dbbc9e1bb98",
    "nome": "Carlos Souza",
    "cargo": "Gerente de Vendas",
    "unidade": "UNIDADE BASICA DE SAUDE DR ALFREDO DE CARVALHO MAIO (VILA GENY)"
  }



DELETE
//Deletar funcionario 
https://biometrico.itaguai.rj.gov.br/funci/funcionario/:id
Exemplo de URL: https://biometrico.itaguai.rj.gov.br/funci/funcionario/bb51e62d-c67f-4cfb-9e0a-78e37a373709
{
  "message": "Funcionário excluído com sucesso"
}


------------------------------------------------------------------------------------------------



POSTi
//Criar unidade
https://biometrico.itaguai.rj.gov.br/unid/unidade

EXEMPLO:
{
  "nome": "CLINICA DA FAMILIA IBIRAPITANGA",
  "localizacao": "Av. Visc. de Mauá, S/N - Vila Ibirapitanga, Itaguaí - RJ,"
}



PUT
//Atualizar unidade
https://biometrico.itaguai.rj.gov.br/unid/unidade/:id

EXEMPLO:
{
  "nome": "UNIDADE BASICA DE SAUDE DR ALFREDO DE CARVALHO MAIO (VILA GENY)"
}



GET
//Ler todas as unidades
https://biometrico.itaguai.rj.gov.br/unid/unidades

EXEMPLO RESPOSTA:
 {
    "id": "3b062732-73f3-4c5b-a48c-2a891c857eae",
    "nome": "CLINICA DA FAMILIA IBIRAPITANGA",
    "localizacao": "Av. Visc. de Mauá, S/N - Vila Ibirapitanga, Itaguaí - RJ,",
    "created_at": "2025-01-20T12:31:54.771Z",
    "updated_at": "2025-01-20T12:31:54.771Z"
  },




GET
//Ler unidade por id
https://biometrico.itaguai.rj.gov.br/unid/unidade/:id
Exemplo Id: 3b062732-73f3-4c5b-a48c-2a891c857eae
EXEMPLO RESPOSTA:
{
  "id": "3b062732-73f3-4c5b-a48c-2a891c857eae",
  "nome": "CLINICA DA FAMILIA IBIRAPITANGA",
  "localizacao": "Av. Visc. de Mauá, S/N - Vila Ibirapitanga, Itaguaí - RJ,",
  "created_at": "2025-01-20T12:31:54.771Z",
  "updated_at": "2025-01-20T12:31:54.771Z"
}


DELETE
//Deletar unidade 
https://biometrico.itaguai.rj.gov.br/unid/unidade/:id

EXEMPLO RESPOSTA:
{
  "message": "Unidade deletada com sucesso."
}

------------------------------------------------------------------------------------------------






POST
//Criar Registro
https://biometrico.itaguai.rj.gov.br/reg/registros-ponto
EXEMPLO DE ENTRADA:
{
  "funcionario_id": "a6bfd322-8770-4c11-933a-3040a62cc1bd",
  "unidade_id": "91b075c9-d86d-4ece-9591-64e8920114d1",
  "hora_entrada": "08:00:00",
  "hora_saida": "17:00:00",
  "id_biometrico": "AQAAABQAAAAEAQAAAQASAAEAZAAAAAAAAAEAAHL3J4Zn2E0PREJIwtuQnNvyiIE6hU11EXa/W4taaDLQivhYXCWNIv0*8f666JuzaA4LFGhI7DyPlVCJgehaSa*M0Jt9hD08fEdUeQkgJYNzjPxKf5PCdaO36KbsYRv9L1/chcqgglB*5Fvf/2eFwZLCzH8bePpI/bNOHueu/KoPBw1WZOgUPB2Kz7tsO/Ne9rO/VW7vaPFHw*trho9k4skoVJTq8XluLFg5tpJIUz3UZoNiQuMPAZ6sGToen/1pitXu7nUcaU8Ygq52GqiIl*oU0/widxL12HpWTkxe*SEtfiO*daWkWgpRSDgMndKGqq2KL6dWPhN7g6t3lEKKrO0"
}

EXEMPLO DE RESPOSTA:
{
  "id": "af11f4e5-52d5-44dc-9820-5cfd8b041137",
  "funcionario_id": "098237dd-f20e-403f-9868-abaa57fd83ba",
  "unidade_id": "3b062732-73f3-4c5b-a48c-2a891c857eae",
  "data_hora": "2025-01-20T15:18:32.446Z",
  "created_at": "2025-01-20T15:18:32.446Z",
  "updated_at": "2025-01-20T15:18:32.446Z",
  "hora_entrada": "08:00:00",
  "hora_saida": "17:00:00",
  "id_biometrico": "biometrico123456"
}




GET
//Ler todos os Registros de ponto
https://biometrico.itaguai.rj.gov.br/reg/registros-ponto
EXEMPLO DE RESPOSTA:
{
    "id": "230e30df-66be-4302-80be-32a2b4c5ce01",
    "funcionario": "Carlos Silva",
    "unidade": "Unidade Central",
    "data_hora": "2025-01-16T08:00:00.000Z",
    "hora_entrada": null,
    "hora_saida": null,
    "id_biometrico": "BIOM12345"
  }



GET
//Ler horas trabalhadas de um funcionario por mes
https://biometrico.itaguai.rj.gov.br/reg/levantamento-horas?funcionario_id=:id&ano=2025&mes=01
EXEMPLO DE URL:
https://biometrico.itaguai.rj.gov.br:3001/reg/levantamento-horas?funcionario_id=a6bfd322-8770-4c11-933a-3040a62cc1bd&ano=2025&mes=01
EXEMPLO DE RESPOSTA
{
  "funcionario": "Rony Mao de Latex",
  "mes": "2025-01",
  "horas_trabalhadas": 16
}



GET
// Ler registros de ponto de um funcionario específico em um mês específico 
https://biometrico.itaguai.rj.gov.br/reg/pontos?funcionario_id=:id&mes=2&ano=2025
EXEMPLO DE URL:
https://biometrico.itaguai.rj.gov.br/reg/pontos?funcionario_id=098237dd-f20e-403f-9868-abaa57fd83ba&mes=2&ano=2025
EXEMPLO DE RESPOSTA
[
  {
    "data": "2025-02-01T00:00:00.000Z",
    "hora_entrada": "08:00:00",
    "hora_saida": "17:00:00",
    "funcionario_nome": "Rony Mao de Latex",
    "unidade_nome": "CLINICA DA FAMILIA IBIRAPITANGA"
  },
  {
    "data": "2025-02-02T00:00:00.000Z",
    "hora_entrada": "08:00:00",
    "hora_saida": "17:00:00",
    "funcionario_nome": "Rony Mao de Latex",
    "unidade_nome": "CLINICA DA FAMILIA IBIRAPITANGA"
  },
  {
    "data": "2025-02-03T00:00:00.000Z",
    "hora_entrada": "08:00:00",
    "hora_saida": "17:00:00",
    "funcionario_nome": "Rony Mao de Latex",
    "unidade_nome": "CLINICA DA FAMILIA IBIRAPITANGA"
  }
]


GET
// Levantar o total de horas trabalhadas por um funcionário em um determinado mês e ano
https://biometrico.itaguai.rj.gov.br/reg/levantamento-horas?funcionario_id=:id&ano=2025&mes=01
EXEMPLO DE URL
https://biometrico.itaguai.rj.gov.br/reg/levantamento-horas?funcionario_id=098237dd-f20e-403f-9868-abaa57fd83ba&ano=2025&mes=01
EXEMPLO DE RESPOSTA
{
  "funcionario": "Rony Mao de Latex",
  "mes": "2025-01",
  "horas_normais": "8.00",
  "horas_extras": "3.00"
}



PUT
//Atualizar Registro
https://biometrico.itaguai.rj.gov.br/reg/registros-ponto/:id
EXEMPLO DE URL
//https://biometrico.itaguai.rj.gov.br/reg/registros-ponto/098237dd-f20e-403f-9868-abaa57fd83ba
EXEMPLO 
{
   "funcionario_id": "098237dd-f20e-403f-9868-abaa57fd83ba",
  "unidade_id": "3b062732-73f3-4c5b-a48c-2a891c857eae",
    "data": "2025-01-23",
    "hora_entrada": "08:00:00",
    "hora_saida": "19:59:59"
}

EXEMPLO DE RESPOSTA:
{
  "id": "d23d9aff-b0e0-4a91-92f5-ad284473ed99",
  "funcionario_id": "098237dd-f20e-403f-9868-abaa57fd83ba",
  "unidade_id": "3b062732-73f3-4c5b-a48c-2a891c857eae",
  "data_hora": "2025-01-23T00:00:00.000Z",
  "created_at": "2025-01-20T17:52:41.773Z",
  "updated_at": "2025-01-20T19:17:16.438Z",
  "hora_entrada": "08:00:00",
  "hora_saida": "19:59:59",
  "id_biometrico": "biometrico123456"
}



DELETE
//Deletar Registro 
EXEMPLO DE URL
https://biometrico.itaguai.rj.gov.br/reg/registros-ponto/:id
EXEMPLO
https://biometrico.itaguai.rj.gov.br/reg/registros-ponto/098237dd-f20e-403f-9868-abaa57fd83ba

{  "data": "2025-01-23",
   
     "funcionario_id": "098237dd-f20e-403f-9868-abaa57fd83ba",
     "unidade_id": "3b062732-73f3-4c5b-a48c-2a891c857eae"
}
EXEMPLO DE RESPOSTA:

{
  "message": "Registros de ponto excluídos com sucesso"
}


------------------------------------------------------------------------------------------------

POST
//Criar usuarios
EXEMPLO DE URL
https://biometrico.itaguai.rj.gov.br/auth/cadastro

EXEMPLO 
{
  "nome": "Ronelson Jacinto Pinto",
  "email": "RjacintoPinto@gmail.com",
  "senha": "senho",
  "papel": "admin"
}
EXEMPLO DE RESPOSTA
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwicGFwZWwiOiJhZG1pbiIsImlhdCI6MTczNzU1OTAxNywiZXhwIjoxNzM4NTU5MDE2fQ.tdh4S4wfa_vJWg01zvJK5UI9aaX2ERbU3kEBpwNCmEM",
  "usuario": {
    "id": 9,
    "nome": "Ronelson Jacinto Pinto",
    "email": "RjacintoPinto@gmail.com",
    "papel": "admin"
  }
}



PUT
//Atualizar usuarios
EXEMPLO DE URL
https://biometrico.itaguai.rj.gov.br/auth/atualizar/:id

{
  "nome": "Iago jacinto Rony",
  "email": "IagojR@example.com",
  "senha": "senho",
  "papel": "gestor"
}



GET
//Ler usuarios
EXEMPLO DE URL
https://biometrico.itaguai.rj.gov.br/auth/usuarios

RESPOSTA 
[
  {
    "id": 1,
    "nome": "Admin",
    "email": "admin@example.com",
    "papel": "admin"
  },
  {
    "id": 2,
    "nome": "Gestor 1",
    "email": "gestor1@example.com",
    "papel": "gestor"
  },
  {
    "id": 5,
    "nome": "João Silva",
    "email": "joao.silva@example.com",
    "papel": "admin"
  },
  {
    "id": 6,
    "nome": "Iago Rony",
    "email": "iago.rony@gmail.com",
    "papel": "admin"
  }
  
]


DELETE
//Deletar usuarios
EXEMPLO DE URL 
https://biometrico.itaguai.rj.gov.br/auth/deletar/:id

{
  "message": "Usuário deletado com sucesso"
}




------------------------------------------------------------------------------------------------



