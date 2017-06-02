/*
 * Trabalho prático 1 - Ambientes de Programação
 * -----------------------------------------------------------------------------
 * Programa para montar frases simples em Português.
 * --
 * As frases montadas pelo programa se restrigem a afirmativas com um sujeito na
 * terceira pessoa e um verbo podendo este ser intransitivo ou transitivo direto
 */

package frases;

import frases.Core.DomainObjects.*;
import frases.Core.Services.IDicionarioService;
import frases.DomainObjects.Frase;
import frases.Services.DicionarioService;
import javax.swing.JOptionPane;

/**
 *
 * @author Charles Wellington Fortes
 */
public class Frases {

    /**
     * Método de iniciação do programa
     * @param args argumentos de execução do sistema
     */
    public static void main(String[] args)
    {
        IDicionarioService dicionario;
        try {
            dicionario = new DicionarioService();
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(null, "Falha ao carregar bando de "
                    + "dados de verbetes.\n\n" + ex.getMessage(), "Erro ao "
                    + "Carregar dicionário", JOptionPane.ERROR_MESSAGE);
            return;
        }

        ISubstantivo sujeito = solicitarSujeito(dicionario);
        IVerbo verbo = solicitarVerbo(dicionario);

        ISubstantivo objeto = null;
        if (verbo.tipoVerbal() == TipoVerbo.TRANSITIVO_DIRETO)
            objeto = solicitarObjeto(dicionario);

        IFrase frase = new Frase(sujeito, verbo, objeto);
        
        JOptionPane.showMessageDialog(null, frase.toString());
    }
    private static IVerbo solicitarVerbo(IDicionarioService dicionario)
    {
        IVerbete verbo = null;
        String v = null;
        
        do {
            v = JOptionPane.showInputDialog(null, "Informe o verbo da frase "
                    + "ou ! para encerrar o programa");

            if (v.equals("!"))
                break;
            
            verbo = dicionario.localizar(v);
            if(verbo == null)
                JOptionPane.showMessageDialog(null, "Verbo não encontrado no "
                        + "dicionário do sistema. Tente novamente.");

            if (verbo != null && verbo.tipo() != TipoVerbete.VERBO)
                JOptionPane.showMessageDialog(null, "A palavra informada não é "
                        + "um verbo. Tente novamente.");
        } while (verbo == null || verbo.tipo() != TipoVerbete.VERBO);
        
        if (v.equals("!"))
            System.exit(0);

        return (IVerbo)verbo;
    }
    private static ISubstantivo solicitarSujeito(IDicionarioService dicionario)
    {
        IVerbete sujeito = null;
        String s = null;
        do {
            s = JOptionPane.showInputDialog(null, "Informe o sujeito da frase "
                    + "ou ! para encerrar o programa");

            if (s.equals("!"))
                break;

            sujeito = dicionario.localizar(s);
            if(sujeito == null)
                JOptionPane.showMessageDialog(null, "Sujeio não encontrado no "
                        + "dicionário do sistema. Tente novamente.");

            if (sujeito != null && sujeito.tipo() != TipoVerbete.SUBSTANTIVO)
                JOptionPane.showMessageDialog(null, "A palavra informada não é "
                        + "um substantivo. Tente novamente.");
        } while (sujeito == null || sujeito.tipo() != TipoVerbete.SUBSTANTIVO);

        if (s.equals("!"))
            System.exit(0);

        return (ISubstantivo)sujeito;
    }
    private static ISubstantivo solicitarObjeto(IDicionarioService dicionario)
    {
        IVerbete objeto = null;

        String o = null;
        do {
            o = JOptionPane.showInputDialog(null, "Informe o objeto que será "
                    + "conjulgado com o verbo ou ! para encerrar o programa.");

            if (o.equals("!"))
                break;

            objeto = dicionario.localizar(o);
            if(objeto == null)
                JOptionPane.showMessageDialog(null, "Substantivo não encontrado"
                        + " no dicionário do sistema. Tente novamente.");

            if (objeto != null && objeto.tipo() != TipoVerbete.SUBSTANTIVO)
                JOptionPane.showMessageDialog(null, "A palavra informada não é "
                        + "um substantivo. Tente novamente.");
        } while (objeto == null || objeto.tipo() != TipoVerbete.SUBSTANTIVO);

        if (o.equals("!"))
            System.exit(0);

        return (ISubstantivo)objeto;
    }
}
