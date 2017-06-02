/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package tp2;

/**
 *
 * @author Charles.Fortes
 */
public class Main {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws Exception {
        System.out.println("--- Testes do Programa TP2 ----\n\n");
        DBCadastro db = new DBCadastro();
        System.out.println("------ Dados carregados nas HashTables:" +
                "\" Nomes incomuns registrados em cartório\" -------");
        db.PrintHashTableForTest();
        System.out.println("\n\n------ FIM DOS DADOS \n\n");
        
        System.out.println("\n\n------ LOCALIZANDO POR NOME: Manoel de Hora Pontual \n\n");
        db.FindByName("Manoel de Hora Pontual");

        System.out.println("\n\n------ LOCALIZANDO POR NOME DUPLICADO: ENEAS \n\n");
        db.FindByName("Eneas");

        System.out.println("\n\n------ LOCALIZANDO POR CPF: 2750250251 \n\n");
        db.FindByCpf("2750250251");

        System.out.println("\n\n------ REMOVENDO POR CPF: 2310210211 \n\n");
        db.RemoveByCpf("2310210211");

        System.out.println("\n\n------ HashTables após remoção \n\n");
        db.PrintHashTableForTest();
    }

}
