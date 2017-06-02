/*
 * Substantivos das frases
 */

package frases.DomainObjects;

import frases.Core.DomainObjects.*;

/**
 * Representa as classes dos substantivos das frases
 * @author Chalk
 */
public class Substantivo extends Verbete implements ISubstantivo {

    private NumeroSubstantivo _numero;
    private GeneroSubstantivo _genero;

    /**
     * Construtor de substantivo
     * @param palavra
     * @param genero
     * @param numero
     */

    public Substantivo(String palavra, GeneroSubstantivo genero,
                                        NumeroSubstantivo numero) {
        this._palavra = palavra;
        this._tipo = TipoVerbete.SUBSTANTIVO;
        _numero = numero;
        _genero = genero;
    }

    public NumeroSubstantivo numero() {
        return _numero;
    }

    public GeneroSubstantivo genero() {
        return _genero;
    }

}
