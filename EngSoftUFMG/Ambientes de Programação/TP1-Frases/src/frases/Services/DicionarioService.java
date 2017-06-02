/*
 * Serviços de acesso ao dicionário
 */

package frases.Services;

import frases.Core.DomainObjects.*;
import frases.Core.Services.IDicionarioService;
import frases.DomainObjects.*;
import java.io.*;

/**
 * Classes com os métodos de acesso ao dicionário
 * @author Charles Fortes
 */
public class DicionarioService implements IDicionarioService{
    private static String ERRO_LINHA_INVALIDA_ARQUIVO_DADOS =
                                  "Falha ao carregar dados do dicionário.\n"
                                + "Entrada inválida no dicionário:\n";

    private IDicionario _dicionario;
    
    // <editor-fold defaultstate="collapsed" desc="Constructor">
    /**
     * Construtor do Serviço
     * @throws Exception
     */
    public DicionarioService() throws Exception {
        this.load();
    }// </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc="Public Methods">
    public IDicionario dicionario() {
        return _dicionario;
    }

    public IVerbete localizar(String palavra) {
        IVerbete palavraLocalizada = null;
        for (IVerbete p : this._dicionario.verbetes()) {
            if (p != null && p.palavra().toUpperCase().intern()
                    == palavra.toUpperCase().intern()) {
                palavraLocalizada = p;
                break;
            }
        }
        return palavraLocalizada;
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Private Methods">

    private void load() throws Exception
    {
        _dicionario = new Dicionario();
        
        InputStream in = new FileInputStream(CAMINHO_ARQUIVO);
        InputStreamReader reader = new InputStreamReader(in);
        BufferedReader data = new BufferedReader(reader);

        while (data.ready())
        {
            _dicionario.adicionar(this.Parse(data.readLine()));
        }
    }
    
    private IVerbete Parse(String dicInputLine) throws Exception
    {
        IVerbete verbete = null;
        if (dicInputLine.charAt(0) == 'V' || dicInputLine.charAt(0) == 'v')
        {
            verbete = this.ParseVerbo(dicInputLine);
        } 
        else if (dicInputLine.charAt(0) == 'S' || dicInputLine.charAt(0) == 's')
        {
            verbete = this.ParseSubstantivo(dicInputLine);
        }
        else
        {
            throw new Exception(ERRO_LINHA_INVALIDA_ARQUIVO_DADOS
                                + "\"" + dicInputLine + "\"");
        }
        return verbete;
    }

    private IVerbete ParseVerbo(String verboString) throws Exception
    {
        String[] dadosLinha = verboString.split("[;]");
        if (dadosLinha.length != 5 || (!dadosLinha[4].equalsIgnoreCase("I") &&
                                       !dadosLinha[4].equalsIgnoreCase("TD") ))
            throw new Exception(ERRO_LINHA_INVALIDA_ARQUIVO_DADOS
                                + "\"" + verboString + "\"");

        TipoVerbo tpVerbo = (dadosLinha[4].equalsIgnoreCase("I")) ?
            TipoVerbo.INTRANSITIVO : TipoVerbo.TRANSITIVO_DIRETO;

        return new Verbo(dadosLinha[1], dadosLinha[2], dadosLinha[3], tpVerbo);
    }

    private IVerbete ParseSubstantivo(String substantivoString) throws Exception
    {
        String[] dadosLinha = substantivoString.split("[;]");
        
        if (dadosLinha.length != 4 || (!dadosLinha[2].equalsIgnoreCase("M") &&
                                       !dadosLinha[2].equalsIgnoreCase("F") )
                                   || (!dadosLinha[3].equalsIgnoreCase("S") &&
                                       !dadosLinha[3].equalsIgnoreCase("P") ))
            throw new Exception(ERRO_LINHA_INVALIDA_ARQUIVO_DADOS
                                + "\"" + substantivoString + "\"");

        GeneroSubstantivo genero = (dadosLinha[2].equalsIgnoreCase("M")) ?
            GeneroSubstantivo.MASCULINO : GeneroSubstantivo.FEMININO;

        NumeroSubstantivo numero = (dadosLinha[3].equalsIgnoreCase("S")) ?
            NumeroSubstantivo.SINGULAR : NumeroSubstantivo.PLURAL;
        
        return new Substantivo(dadosLinha[1], genero, numero);
    }
    // </editor-fold>

}
