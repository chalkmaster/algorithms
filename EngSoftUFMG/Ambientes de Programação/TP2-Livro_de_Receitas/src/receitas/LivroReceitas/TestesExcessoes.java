package receitas.LivroReceitas;

import receitas.DomainObjects.Bater;
import receitas.DomainObjects.Ingrediente;
import receitas.DomainObjects.IngredienteException;
import receitas.DomainObjects.Picar;
import receitas.DomainObjects.Tarefa;
import receitas.DomainObjects.TarefaException;

/**
 *
 * @author Charles.Fortes
 */
public class TestesExcessoes {
    public static void main(String[] args) {
        //Quantidade Negativa
        try {
            Ingrediente tomate = new Ingrediente("Tomate", -1f, Ingrediente.TIPO_SOLIDO);
        }
        catch (IngredienteException ex)
        {
            System.out.println("Teste executado com sucesso: Erro objtido: " + ex.getMessage());
        }

        //Tipo incompatível
        try {
            Ingrediente leite = new Ingrediente("leite", 2f, Ingrediente.TIPO_LIQUIDO);
            Tarefa picar = new Picar(new String[]{"leite"});
            picar.executar(new Ingrediente[]{leite});
            System.out.println("resultado da tarega: " + picar.resultado().descrever());
            System.out.println("descrição: " + picar.descrever(new Ingrediente[]{leite}));
        }
        catch (IngredienteException ex)
        {
            System.out.println("Erro inesperado objtido: " + ex.getMessage());
        }
        catch (TarefaException ex)
        {
            System.out.println("Teste executado com sucesso: Erro objtido: " + ex.getMessage());
        }
    }
}
