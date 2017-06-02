package receitas.LivroReceitas;

import java.util.*;
import receitas.DomainObjects.*;


/**
 *
 * @author Charles.Fortes
 */
public class AppTeste2 {
    public static void main(String[] args) throws IngredienteException, TarefaException {
        //ingredientes
        Ingrediente cremeDeLeite = new Ingrediente("Creme de Leite", 200, Ingrediente.TIPO_LIQUIDO);
        Ingrediente leiteCondencado = new Ingrediente("Leite Condensado", 300, Ingrediente.TIPO_LIQUIDO);
        Ingrediente sucoMaracuja = new Ingrediente("Suco de Maracujá", 1, Ingrediente.TIPO_PO);
        //------

        Tarefa t1 = new Bater(new String[]{cremeDeLeite.nome(), leiteCondencado.nome()});
        t1.executar(new Ingrediente[]{cremeDeLeite, leiteCondencado});
        Ingrediente r1 = t1.resultado();

        Tarefa t2 = new Misturar(new String[]{sucoMaracuja.nome(), r1.nome()});
        t2.executar(new Ingrediente[]{r1, sucoMaracuja});
        Ingrediente r2 = t2.resultado();

        Tarefa t3 = new Bater(new String[]{r2.nome()});
        t3.executar(new Ingrediente[]{r2});
        Ingrediente r3 = t3.resultado();

        Tarefa t4 = new Congelar(new String[]{r3.nome()});
        t4.executar(new Ingrediente[]{r3});
        Ingrediente r4 = t4.resultado();


        List<Ingrediente> ingrs = new ArrayList<Ingrediente>();
        ingrs.addAll(Arrays.asList(new Ingrediente[]
                            { cremeDeLeite, leiteCondencado, sucoMaracuja,
                              r1, r2, r3, r4 } ));

        List<Tarefa> tarefas = new ArrayList<Tarefa>();
        tarefas.addAll(Arrays.asList( new Tarefa[] { t1, t2, t3, t4 } ));

        Receita receita = new Receita("Mousse de Maracujá", ingrs, tarefas);

        System.out.println(receita.descrever());
    }
}
