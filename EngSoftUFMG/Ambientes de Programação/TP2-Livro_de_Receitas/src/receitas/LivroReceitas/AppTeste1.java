/*
 * Testes: Molho a campanha (Vinagrete)
 */

package receitas.LivroReceitas;

import java.util.*;
import receitas.DomainObjects.*;
/**
 *
 * @author Charles.Fortes
 */
public class AppTeste1 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IngredienteException, TarefaException {

        
        //ingredientes
        Ingrediente tomate = new Ingrediente("Tomate", 2, Ingrediente.TIPO_SOLIDO);
        Ingrediente cebola = new Ingrediente("Cebola", 1, Ingrediente.TIPO_SOLIDO);
        Ingrediente pimentao = new Ingrediente("Pimentão", 0.5f, Ingrediente.TIPO_SOLIDO);
        Ingrediente vinagreBranco = new Ingrediente("Vinagre branco", 40, Ingrediente.TIPO_LIQUIDO);
        Ingrediente azeite = new Ingrediente("Azeite", 20, Ingrediente.TIPO_LIQUIDO);
        //------

        Tarefa t1 = new Picar(new String[]{tomate.nome()});
        t1.executar(new Ingrediente[]{tomate});
        Ingrediente r1 = t1.resultado();

        Tarefa t2 = new Descascar(new String[]{cebola.nome()});
        t2.executar(new Ingrediente[]{cebola});
        Ingrediente r2 = t2.resultado();

        Tarefa t3 = new Picar(new String[]{r2.nome()});
        t3.executar(new Ingrediente[]{r2});
        Ingrediente r3 = t3.resultado();

        Tarefa t4 = new Picar(new String[]{pimentao.nome()});
        t4.executar(new Ingrediente[]{pimentao});
        Ingrediente r4 = t4.resultado();

        Tarefa t5 = new Misturar(new String[]{r3.nome(), r4.nome(),
                    r1.nome()});
        t5.executar(new Ingrediente[]{r3, r4, r1});
        Ingrediente r5 = t5.resultado();

        Tarefa t6 = new Misturar(new String[]{vinagreBranco.nome(), r5.nome()});
        t6.executar(new Ingrediente[]{vinagreBranco, r5});
        Ingrediente r6 = t6.resultado();

        Tarefa t7 = new Misturar(new String[]{azeite.nome(), r6.nome()});
        t7.executar(new Ingrediente[]{azeite, r6});
        Ingrediente r7 = t7.resultado();

        List<Ingrediente> ingrs = new ArrayList<Ingrediente>();
        ingrs.addAll(Arrays.asList(new Ingrediente[]
                            { tomate, cebola, pimentao, vinagreBranco, azeite,
                              r1, r2, r3, r4, r5, r6, r7 } ));

        List<Tarefa> tarefas = new ArrayList<Tarefa>();
        tarefas.addAll(Arrays.asList( new Tarefa[] { t1, t2, t3, t4, t5, t6, t7 } ));

        Receita receita = new Receita("Molho a campanha (Vinagrete)", ingrs, tarefas);

        System.out.println(receita.descrever());
    }

}
