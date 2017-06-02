/*
 * Verbos da frase
 */

package frases.DomainObjects;

import frases.Core.DomainObjects.IVerbo;
import frases.Core.DomainObjects.TipoVerbete;
import frases.Core.DomainObjects.TipoVerbo;

/**
 * Representa a classe dos vervos da frase
 * @author Chalk
 */
public class Verbo extends Verbete implements IVerbo{

    private TipoVerbo _tipoVerbal;
    private String _plural;
    private String _singular;
    
    /**
     * Construtor do verbo
     * @param intransitivo
     * @param singular
     * @param plural
     * @param tipoVerbo
     */
    public Verbo(String intransitivo, String singular, String plural,
            TipoVerbo tipoVerbo) {
        this._palavra = intransitivo;
        this._singular = singular;
        this._plural = plural;
        this._tipo = TipoVerbete.VERBO;
        this._tipoVerbal = tipoVerbo;
    }

    public TipoVerbo tipoVerbal() {
        return _tipoVerbal;
    }

    public String toTerceiraPessoaPlural() {
        return _plural;
    }

    public String toTerceiraPessoaSingular() {
        return _singular;
    }

}
