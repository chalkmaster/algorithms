/*
 * Dicionário de verbos e substantivos do suportados pelo sistema.
 */

package frases.DomainObjects;

import frases.Core.DomainObjects.IDicionario;
import frases.Core.DomainObjects.IVerbete;

/**
 * Dicionário do sistema
 * @author Charles Fortes
 */
public class Dicionario implements IDicionario {

    private IVerbete[] _verbetes;
    private int _quantidade;

    // <editor-fold defaultstate="collapsed" desc="Constructors">
    /**
     * Construtor padrão
     */
    public Dicionario()
    {
        this(CAPACIDADE_PADRAO);
    }

    /**
     * Construtor para iniciar o dicionário com uma determinada capacidade
     * @param capacidade que o dicionário terá
     */
    public Dicionario(int capacidade)
    {
        _verbetes = new IVerbete[capacidade];
    }
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Methods">
    public IVerbete[] verbetes()
    {
        return _verbetes;
    }

    public int quantidade()
    {
        return _quantidade;
    }

    public int capacidade()
    {
        return _verbetes.length;
    }

    public void adicionar(IVerbete verbete)
    {
        if (_quantidade == this.capacidade())
            this.aumentaCapacidade();

        verbetes()[_quantidade] = verbete;
        _quantidade++;
    }

    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc="Private Methods">
    private void aumentaCapacidade() {
        IVerbete[] verbetesTmp = new IVerbete[this.capacidade() + CAPACIDADE_PADRAO];
        for (int i = 0; i < this.capacidade(); i++) {
            verbetesTmp[i] = _verbetes[i];
        }
        this._verbetes = verbetesTmp;
    }// </editor-fold>

}
