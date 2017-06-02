/*
 * Represente um verbete do dicionário
 */

package frases.DomainObjects;

import frases.Core.DomainObjects.IVerbete;
import frases.Core.DomainObjects.TipoVerbete;

/**
 * Verbetes do dicionário
 * @author Charles Fortes
 */
public abstract class Verbete implements IVerbete
{
    /**
     * Tipo do verbete
     */
    protected TipoVerbete _tipo;
    /**
     * Palavra do verbete
     */
    protected String _palavra;

    public TipoVerbete tipo()
    {
        return this._tipo;
    }

    public String palavra()
    {
        return this._palavra;
    }
}
