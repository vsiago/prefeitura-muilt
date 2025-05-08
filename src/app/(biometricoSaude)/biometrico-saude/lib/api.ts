// Base URL para todas as requisições
const BASE_URL = "https://biometrico.itaguai.rj.gov.br"

// Tipos de dados
export interface Unidade {
  id: string
  nome: string
  localizacao: string
  created_at?: string
  updated_at?: string
  foto?: string
  slug?: string
}

export interface Funcionario {
  id: string
  nome: string
  cpf?: string
  cargo: string
  unidade_id: string
  unidade?: string
  data_admissao?: string
  id_biometrico?: string
  matricula?: number
  email?: string
  telefone?: string
  tipo_escala?: string
}

export interface RegistroPonto {
  id?: string
  funcionario_id: string
  funcionario_nome?: string
  unidade_id: string
  unidade_nome?: string
  data_hora?: string
  data?: string
  hora_entrada?: string
  hora_saida?: string
  id_biometrico?: string
  status?: "Presente" | "Atrasado" | "Ausente" | "Folga"
}

export interface Usuario {
  id: number
  nome: string
  email: string
  senha?: string
  papel: "admin" | "gestor" | "funcionario"
}

// Funções de API para Unidades
export const unidadeAPI = {
  // Obter todas as unidades
  getAll: async (): Promise<Unidade[]> => {
    try {
      // Buscar diretamente da API, sem verificar o localStorage
      const response = await fetch(`${BASE_URL}/unid/unidades`)
      if (!response.ok) throw new Error("Falha ao buscar unidades")

      const data = await response.json()

      // Adiciona slug para cada unidade e formata a URL da foto
      const unidadesComSlug = data.map((unidade: Unidade) => ({
        ...unidade,
        slug: unidade.nome
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
        foto: unidade.foto ? `${BASE_URL}/uploads/${unidade.foto}` : "/hospital-placeholder.jpg", // URL completa da foto
      }))

      console.log(unidadesComSlug)

      return unidadesComSlug
    } catch (error) {
      console.error("Erro ao buscar unidades:", error)
      return []
    }
  },

  // Obter unidade por ID
  getById: async (id: string): Promise<Unidade | null> => {
    try {
      // Buscar diretamente da API
      const response = await fetch(`${BASE_URL}/unid/unidade/${id}`)
      if (!response.ok) throw new Error("Falha ao buscar unidade")

      const unidade = await response.json()

      // Adiciona slug e formata a URL da foto
      unidade.slug = unidade.nome
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      unidade.foto = unidade.foto ? `${BASE_URL}/uploads/${unidade.foto}` : "/hospital-placeholder.jpg"

      return unidade
    } catch (error) {
      console.error(`Erro ao buscar unidade ${id}:`, error)
      return null
    }
  },

  // Obter unidade por slug
  getBySlug: async (slug: string): Promise<Unidade | null> => {
    try {
      // Busca todas as unidades diretamente da API
      const unidades = await unidadeAPI.getAll()

      // Encontra a unidade pelo slug
      const unidade = unidades.find(
        (u: Unidade) =>
          u.slug === slug ||
          u.nome
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "-") === slug,
      )

      return unidade || null
    } catch (error) {
      console.error(`Erro ao buscar unidade pelo slug ${slug}:`, error)
      return null
    }
  },

  // Criar unidade
  create: async (unidade: Omit<Unidade, "id" | "created_at" | "updated_at">): Promise<Unidade | null> => {
    try {
      // Preparar os dados para envio
      const formData = new FormData()
      formData.append("nome", unidade.nome)
      console.log("API - Criando unidade com nome:", unidade.nome)

      if (unidade.localizacao) {
        formData.append("localizacao", unidade.localizacao)
        console.log("API - Localizacao:", unidade.localizacao)
      }

      if (unidade.foto && unidade.foto !== "/placeholder.svg" && unidade.foto !== "/hospital-placeholder.jpg") {
        // Se a foto for uma URL de arquivo (não um blob URL), enviar como string
        if (!unidade.foto.startsWith("blob:")) {
          formData.append("foto", unidade.foto)
          console.log("API - Anexando foto:", typeof unidade.foto === "object" ? "Arquivo de imagem" : unidade.foto)
        }
      }

      // Tentar diferentes endpoints
      let endpoint = `${BASE_URL}/unid/unidades`
      console.log("API - Tentando criar unidade no endpoint:", endpoint)

      let response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      console.log("API - Resposta do servidor (criação 1):", {
        status: response.status,
        statusText: response.statusText,
      })

      // Se o primeiro endpoint falhar, tentar o segundo
      if (response.status === 404) {
        endpoint = `${BASE_URL}/unid/unidade`
        console.log("API - Primeiro endpoint falhou. Tentando criar unidade no endpoint alternativo:", endpoint)

        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        })

        console.log("API - Resposta do servidor (criação 2):", {
          status: response.status,
          statusText: response.statusText,
        })
      }

      if (!response.ok) {
        // Tentar obter detalhes do erro
        try {
          const errorText = await response.text()
          console.error("API - Detalhes do erro:", errorText)
        } catch (e) {
          console.error("API - Não foi possível obter detalhes do erro")
        }

        throw new Error(`Falha ao criar unidade: ${response.status} ${response.statusText}`)
      }

      const novaUnidade = await response.json()
      console.log("API - Unidade criada com sucesso:", novaUnidade)

      // Adiciona slug e formata a URL da foto
      novaUnidade.slug = novaUnidade.nome
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      novaUnidade.foto = novaUnidade.foto ? `${BASE_URL}/uploads/${novaUnidade.foto}` : "/hospital-placeholder.jpg"

      return novaUnidade
    } catch (error) {
      console.error("API - Erro ao criar unidade:", error)
      throw error
    }
  },

  // Atualizar unidade
  update: async (id: string, unidade: Partial<Unidade>): Promise<Unidade | null> => {
    try {
      // Preparar os dados para envio
      const formData = new FormData()

      if (unidade.nome) {
        formData.append("nome", unidade.nome)
      }

      if (unidade.localizacao) {
        formData.append("localizacao", unidade.localizacao)
      }

      if (unidade.foto && unidade.foto !== "/placeholder.svg" && unidade.foto !== "/hospital-placeholder.jpg") {
        // Se a foto for uma URL de arquivo (não um blob URL), enviar como string
        if (!unidade.foto.startsWith("blob:") && !unidade.foto.includes(`${BASE_URL}/unid/foto/`)) {
          formData.append("foto", unidade.foto)
        }
      }

      // Atualizar na API
      const response = await fetch(`${BASE_URL}/unid/unidade/${id}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) throw new Error("Falha ao atualizar unidade")

      const unidadeAtualizada = await response.json()

      // Adiciona slug e formata a URL da foto
      unidadeAtualizada.slug = unidadeAtualizada.nome
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-")
      unidadeAtualizada.foto = unidadeAtualizada.foto
        ? `${BASE_URL}/uploads/${unidadeAtualizada.foto}`
        : "/hospital-placeholder.jpg"

      return unidadeAtualizada
    } catch (error) {
      console.error(`Erro ao atualizar unidade ${id}:`, error)
      throw error
    }
  },

  // Deletar unidade
  delete: async (id: string): Promise<boolean> => {
    try {
      // Deletar na API
      const response = await fetch(`${BASE_URL}/unid/unidade/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Falha ao deletar unidade")

      return true
    } catch (error) {
      console.error(`Erro ao deletar unidade ${id}:`, error)
      throw error
    }
  },
}

// Funções de API para Funcionários
export const funcionarioAPI = {
  // Obter todos os funcionários
  getAll: async (): Promise<Funcionario[]> => {
    try {
      // Primeiro tenta buscar do localStorage
      const cachedData = localStorage.getItem("funcionarios")
      if (cachedData) {
        return JSON.parse(cachedData)
      }

      // Se não existir no localStorage, busca da API
      const response = await fetch(`${BASE_URL}/funci/funcionarios`)
      if (!response.ok) throw new Error("Falha ao buscar funcionários")

      const data = await response.json()

      // Salva no localStorage
      localStorage.setItem("funcionarios", JSON.stringify(data))

      return data
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error)
      return []
    }
  },

  // Obter funcionários por unidade
  getByUnidade: async (unidadeId: string): Promise<Funcionario[]> => {
    try {
      // Verificar se o ID da unidade é válido
      if (!unidadeId) {
        console.error("ID da unidade inválido ou não fornecido")
        return []
      }

      // Sempre buscar da API, sem verificar o localStorage primeiro
      console.log(`Buscando funcionários da unidade ${unidadeId} da API...`)
      const response = await fetch(`${BASE_URL}/funci/unidade/${unidadeId}/funcionarios?limit=1000&offset=0`)

      // Se a resposta não for ok, lance um erro com mais detalhes
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Erro desconhecido")
        throw new Error(
          `Falha ao buscar funcionários da unidade: ${response.status} ${response.statusText} - ${errorText}`,
        )
      }

      const data = await response.json()
      console.log(`Recebidos ${data.length} funcionários da API para a unidade ${unidadeId}`)
      return data
    } catch (error) {
      console.error(`Erro ao buscar funcionários da unidade ${unidadeId}:`, error)
      throw error // Propagar o erro para ser tratado pelo componente
    }
  },

  // Criar funcionário
  create: async (funcionario: Omit<Funcionario, "id">): Promise<Funcionario | null> => {
    try {
      // Prepare the request payload with all required fields
      const payload = {
        nome: funcionario.nome,
        cpf: funcionario.cpf || "",
        cargo: funcionario.cargo,
        unidade_id: funcionario.unidade_id,
        data_admissao: funcionario.data_admissao || "Não tem data",
        id_biometrico: funcionario.id_biometrico || "",
        matricula: funcionario.matricula || 0,
        email: funcionario.email || "",
        telefone: funcionario.telefone || "",
        tipo_escala: funcionario.tipo_escala || "",
      }

      console.log("[API] Criando funcionário - Payload completo:", JSON.stringify(payload, null, 2))

      // Send request to the API
      const response = await fetch(`${BASE_URL}/funci/funcionario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      // Check for response status
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error")
        console.error(`[API] Erro (${response.status}): ${errorText}`)
        throw new Error(`Failed to create employee: ${response.status} ${response.statusText}`)
      }

      // Parse the response
      const novoFuncionario = await response.json()
      console.log("[API] Funcionário criado com sucesso - Resposta:", JSON.stringify(novoFuncionario, null, 2))
      return novoFuncionario
    } catch (error) {
      console.error("[API] Erro ao criar funcionário:", error)

      throw error // Propagate the error to be handled by the component
    }
  },

  // Atualizar funcionário
  update: async (id: string, funcionario: Partial<Funcionario>): Promise<Funcionario | null> => {
    try {
      const payload = {
        nome: funcionario.nome,
        cpf: funcionario.cpf || "",
        cargo: funcionario.cargo,
        unidade_id: funcionario.unidade_id,
        data_admissao: funcionario.data_admissao || "Não tem data",
        id_biometrico: funcionario.id_biometrico || "",
        matricula: funcionario.matricula || 0,
        email: funcionario.email || "",
        telefone: funcionario.telefone || "",
        tipo_escala: funcionario.tipo_escala || "",
      };

      console.log("[API] Atualizando funcionário:", id)
      console.log("[API] Payload completo:", JSON.stringify(payload, null, 2))

      // Sempre atualizar na API
      const response = await fetch(`${BASE_URL}/funci/funcionario/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error")
        console.error(`[API] Erro de atualização (${response.status}): ${errorText}`)
        throw new Error("Falha ao atualizar funcionário")
      }

      const funcionarioAtualizado = await response.json()
      console.log(
        "[API] Funcionário atualizado com sucesso - Resposta:",
        JSON.stringify(funcionarioAtualizado, null, 2),
      )
      return funcionarioAtualizado
    } catch (error) {
      console.error(`[API] Erro ao atualizar funcionário ${id}:`, error)

      // Se a API falhar, retornar um funcionário simulado para testes
      if (process.env.NODE_ENV === "development") {
        console.warn("[API] Usando funcionário atualizado simulado para desenvolvimento")
        return {
          id,
          ...funcionario,
        } as Funcionario
      }

      throw error // Propagar o erro para ser tratado pelo componente
    }
  },

  // Deletar funcionário
  delete: async (id: string): Promise<boolean> => {
    try {
      // Sempre deletar na API
      const response = await fetch(`${BASE_URL}/funci/funcionario/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Falha ao deletar funcionário")
      return true
    } catch (error) {
      console.error(`Erro ao deletar funcionário ${id}:`, error)
      throw error // Propagar o erro para ser tratado pelo componente
    }
  },
}

// Funções de API para Registros de Ponto
export const registroPontoAPI = {
  // Obter todos os registros
  getAll: async (): Promise<RegistroPonto[]> => {
    try {
      // Primeiro tenta buscar do localStorage
      const cachedData = localStorage.getItem("registros_ponto")
      if (cachedData) {
        return JSON.parse(cachedData)
      }

      // Se não existir no localStorage, busca da API
      const response = await fetch(`${BASE_URL}/reg/registros-ponto`)
      if (!response.ok) throw new Error("Falha ao buscar registros de ponto")

      const data = await response.json()

      // Salva no localStorage
      localStorage.setItem("registros_ponto", JSON.stringify(data))

      return data
    } catch (error) {
      console.error("Erro ao buscar registros de ponto:", error)
      return []
    }
  },

  // Obter registros de ponto por funcionário e mês
  getByFuncionarioEMes: async (funcionarioId: string, mes: number, ano: number): Promise<RegistroPonto[]> => {
    try {
      // Tenta buscar da API
      const response = await fetch(`${BASE_URL}/reg/pontos?funcionario_id=${funcionarioId}&mes=${mes}&ano=${ano}`)
      if (!response.ok) throw new Error("Falha ao buscar registros de ponto do funcionário")

      const data = await response.json()

      // Atualiza o cache local para este funcionário/mês
      const cacheKey = `registros_ponto_${funcionarioId}_${mes}_${ano}`
      localStorage.setItem(cacheKey, JSON.stringify(data))

      return data
    } catch (error) {
      console.error(`Erro ao buscar registros de ponto do funcionário ${funcionarioId}:`, error)

      // Tenta buscar do cache local
      const cacheKey = `registros_ponto_${funcionarioId}_${mes}_${ano}`
      const cachedData = localStorage.getItem(cacheKey)
      if (cachedData) {
        return JSON.parse(cachedData)
      }

      // Fallback para dados simulados
      return []
    }
  },

  // Obter horas trabalhadas por funcionário e mês
  getHorasTrabalhadas: async (funcionarioId: string, mes: number, ano: number): Promise<any> => {
    try {
      // Tenta buscar da API
      const response = await fetch(
        `${BASE_URL}/reg/levantamento-horas?funcionario_id=${funcionarioId}&ano=${ano}&mes=${mes.toString().padStart(2, "0")}`,
      )
      if (!response.ok) throw new Error("Falha ao buscar horas trabalhadas")

      const data = await response.json()

      // Atualiza o cache local
      const cacheKey = `horas_trabalhadas_${funcionarioId}_${mes}_${ano}`
      localStorage.setItem(cacheKey, JSON.stringify(data))

      return data
    } catch (error) {
      console.error(`Erro ao buscar horas trabalhadas do funcionário ${funcionarioId}:`, error)

      // Tenta buscar do cache local
      const cacheKey = `horas_trabalhadas_${funcionarioId}_${mes}_${ano}`
      const cachedData = localStorage.getItem(cacheKey)
      if (cachedData) {
        return JSON.parse(cachedData)
      }

      // Fallback para dados simulados
      return {
        funcionario: "Funcionário",
        mes: `${ano}-${mes.toString().padStart(2, "0")}`,
        horas_normais: "0.00",
        horas_extras: "0.00",
      }
    }
  },

  // Criar registro de ponto
  create: async (registro: Omit<RegistroPonto, "id">): Promise<RegistroPonto | null> => {
    try {
      // Tenta criar na API
      const response = await fetch(`${BASE_URL}/reg/registros-ponto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registro),
      })

      if (!response.ok) throw new Error("Falha ao criar registro de ponto")

      const novoRegistro = await response.json()

      // Atualiza o localStorage
      const cachedData = localStorage.getItem("registros_ponto")
      if (cachedData) {
        const registros = JSON.parse(cachedData)
        registros.push(novoRegistro)
        localStorage.setItem("registros_ponto", JSON.stringify(registros))
      } else {
        localStorage.setItem("registros_ponto", JSON.stringify([novoRegistro]))
      }

      return novoRegistro
    } catch (error) {
      console.error("Erro ao criar registro de ponto:", error)

      // Fallback para criar apenas no localStorage se a API falhar
      const cachedData = localStorage.getItem("registros_ponto")
      const registros = cachedData ? JSON.parse(cachedData) : []

      const novoRegistro = {
        ...registro,
        id: `local-${Date.now()}`,
        data_hora: new Date().toISOString(),
      }

      registros.push(novoRegistro)
      localStorage.setItem("registros_ponto", JSON.stringify(registros))

      return novoRegistro
    }
  },

  // Atualizar registro de ponto
  update: async (id: string, registro: Partial<RegistroPonto>): Promise<RegistroPonto | null> => {
    try {
      // Tenta atualizar na API
      const response = await fetch(`${BASE_URL}/reg/registros-ponto/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registro),
      })

      if (!response.ok) throw new Error("Falha ao atualizar registro de ponto")

      const registroAtualizado = await response.json()

      // Atualiza o localStorage
      const cachedData = localStorage.getItem("registros_ponto")
      if (cachedData) {
        let registros = JSON.parse(cachedData)
        registros = registros.map((r: RegistroPonto) => (r.id === id ? { ...r, ...registroAtualizado } : r))
        localStorage.setItem("registros_ponto", JSON.stringify(registros))
      }

      return registroAtualizado
    } catch (error) {
      console.error(`Erro ao atualizar registro de ponto ${id}:`, error)

      // Fallback para atualizar apenas no localStorage se a API falhar
      const cachedData = localStorage.getItem("registros_ponto")
      if (cachedData) {
        let registros = JSON.parse(cachedData)
        registros = registros.map((r: RegistroPonto) => (r.id === id ? { ...r, ...registro } : r))
        localStorage.setItem("registros_ponto", JSON.stringify(registros))
        return registros.find((r: RegistroPonto) => r.id === id) || null
      }

      return null
    }
  },

  // Deletar registro de ponto
  delete: async (id: string, data: string, funcionarioId: string, unidadeId: string): Promise<boolean> => {
    try {
      // Tenta deletar na API
      const response = await fetch(`${BASE_URL}/reg/registros-ponto/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
          funcionario_id: funcionarioId,
          unidade_id: unidadeId,
        }),
      })

      if (!response.ok) throw new Error("Falha ao deletar registro de ponto")

      // Atualiza o localStorage
      const cachedData = localStorage.getItem("registros_ponto")
      if (cachedData) {
        let registros = JSON.parse(cachedData)
        registros = registros.filter((r: RegistroPonto) => r.id !== id)
        localStorage.setItem("registros_ponto", JSON.stringify(registros))
      }

      return true
    } catch (error) {
      console.error(`Erro ao deletar registro de ponto ${id}:`, error)

      // Fallback para deletar apenas no localStorage se a API falhar
      const cachedData = localStorage.getItem("registros_ponto")
      if (cachedData) {
        let registros = JSON.parse(cachedData)
        registros = registros.filter((r: RegistroPonto) => r.id !== id)
        localStorage.setItem("registros_ponto", JSON.stringify(registros))
      }

      return true
    }
  },
}

// Funções de API para Usuários
export const usuarioAPI = {
  // Obter todos os usuários
  getAll: async (): Promise<Usuario[]> => {
    try {
      // Primeiro tenta buscar do localStorage
      const cachedData = localStorage.getItem("usuarios")
      if (cachedData) {
        return JSON.parse(cachedData)
      }

      // Se não existir no localStorage, busca da API
      const response = await fetch(`${BASE_URL}/auth/usuarios`)
      if (!response.ok) throw new Error("Falha ao buscar usuários")

      const data = await response.json()

      // Salva no localStorage
      localStorage.setItem("usuarios", JSON.stringify(data))

      return data
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      return []
    }
  },

  // Criar usuário
  create: async (usuario: Omit<Usuario, "id">): Promise<Usuario | null> => {
    try {
      // Tenta criar na API
      const response = await fetch(`${BASE_URL}/auth/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      })

      if (!response.ok) throw new Error("Falha ao criar usuário")

      const data = await response.json()
      const novoUsuario = data.usuario

      // Atualiza o localStorage
      const cachedUsuarios = localStorage.getItem("usuarios")
      if (cachedUsuarios) {
        const usuarios = JSON.parse(cachedUsuarios)
        usuarios.push(novoUsuario)
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
      } else {
        localStorage.setItem("usuarios", JSON.stringify([novoUsuario]))
      }

      return novoUsuario
    } catch (error) {
      console.error("Erro ao criar usuário:", error)

      // Fallback para criar apenas no localStorage se a API falhar
      const cachedData = localStorage.getItem("usuarios")
      const usuarios = cachedData ? JSON.parse(cachedData) : []

      const novoUsuario = {
        ...usuario,
        id: usuarios.length > 0 ? Math.max(...usuarios.map((u: Usuario) => u.id)) + 1 : 1,
      }

      usuarios.push(novoUsuario)
      localStorage.setItem("usuarios", JSON.stringify(usuarios))

      return novoUsuario
    }
  },

  // Atualizar usuário
  update: async (id: number, usuario: Partial<Usuario>): Promise<Usuario | null> => {
    try {
      // Tenta atualizar na API
      const response = await fetch(`${BASE_URL}/auth/atualizar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      })

      if (!response.ok) throw new Error("Falha ao atualizar usuário")

      const usuarioAtualizado = await response.json()

      // Atualiza o localStorage
      const cachedData = localStorage.getItem("usuarios")
      if (cachedData) {
        let usuarios = JSON.parse(cachedData)
        usuarios = usuarios.map((u: Usuario) => (u.id === id ? { ...u, ...usuarioAtualizado } : u))
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
      }

      return usuarioAtualizado
    } catch (error) {
      console.error(`Erro ao atualizar usuário ${id}:`, error)

      // Fallback para atualizar apenas no localStorage se a API falhar
      const cachedData = localStorage.getItem("usuarios")
      if (cachedData) {
        let usuarios = JSON.parse(cachedData)
        usuarios = usuarios.map((u: Usuario) => (u.id === id ? { ...u, ...usuario } : u))
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
        return usuarios.find((u: Usuario) => u.id === id) || null
      }

      return null
    }
  },

  // Deletar usuário
  delete: async (id: number): Promise<boolean> => {
    try {
      // Tenta deletar na API
      const response = await fetch(`${BASE_URL}/auth/deletar/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Falha ao deletar usuário")

      // Atualiza o localStorage
      const cachedData = localStorage.getItem("usuarios")
      if (cachedData) {
        let usuarios = JSON.parse(cachedData)
        usuarios = usuarios.filter((u: Usuario) => u.id !== id)
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
      }

      return true
    } catch (error) {
      console.error(`Erro ao deletar usuário ${id}:`, error)

      // Fallback para deletar apenas no localStorage se a API falhar
      const cachedData = localStorage.getItem("usuarios")
      if (cachedData) {
        let usuarios = JSON.parse(cachedData)
        usuarios = usuarios.filter((u: Usuario) => u.id !== id)
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
      }

      return true
    }
  },
}

