local listaParaBonificacoes = []

function bonificar(user, bonus, tolerante)
    if not tolerante then
        await axios.post("http://fidelity:3004/bonus", { user, bonus });
        return
    end
    try {
        await axios.post("http://fidelity:3004/bonus", { user, bonus }, { timeout: 3000 });
        print("bonus de "..toString(bonus).." foi enviado para o usuario "..toString(user))
    }
    catch {
        print("ainda não foi possivel bonificar "..toString(user))
        table.insert(listaParaBonificacoes, user)
    }
end

while true do
    local listaAtualParaBonificar = table.clone(listaParaBonificacoes)
    for indice, user in pairs(listaAtualParaBonificar) do
        task.spawn(
            function()
                local sucess = pcall(function()
                    await axios.post("http://fidelity:3004/bonus", { user, bonus }, { timeout: 3000 });
                    print("bonus de "..toString(bonus).." foi enviado para o usuario "..toString(user))
                )

                if sucess and table.find(listaParaBonificacoes, user) then
                    table.remove(listaParaBonificacoes, table.find(listaParaBonificacoes, user))
                end
            end)
    end
   wait(5)
end