/*
 * Frases formadas pelo sistema
 */

package frases.DomainObjects;

import frases.Core.DomainObjects.*;

/**
 * Classe que representa as classes do sistema
 * @author Charles Fortes
 */
public class Frase implements IFrase{

    private ISubstantivo _sujeito;
    private IVerbo _verbo;
    private ISubstantivo _objeto;

    /**
     * Construtor de frases
     * @param sujeito da frase
     * @param verbo da frase
     * @param objeto da frase
     */
    public Frase(ISubstantivo sujeito, IVerbo verbo, ISubstantivo objeto) {
        _sujeito = sujeito;
        _verbo = verbo;
        _objeto = objeto;
    }

    // <editor-fold defaultstate="collapsed" desc="Public Methods">
    public ISubstantivo sujeito() {
        return _sujeito;
    }

    public IVerbo verbo() {
        return _verbo;
    }

    public ISubstantivo objeto() {
        return _objeto;
    }

    @Override
    public String toString() {
        return getArtigo(_sujeito) + " " + _sujeito.palavra() + " "
             + this.conjugar() + " " + getArtigo(_objeto).toLowerCase() + " "
             + ((_objeto == null) ? "" : _objeto.palavra());
    }// </editor-fold>Ö

    // <editor-fold defaultstate="collapsed" desc="Private Methods">
    private String getArtigo(ISubstantivo substantivo)
    {
        if (substantivo == null)
            return "";
        
       return ((substantivo.genero() == GeneroSubstantivo.FEMININO) ? "A" : "O")
            + ((substantivo.numero() == NumeroSubstantivo.PLURAL) ? "s" : "");
    }

    private String conjugar() {
        return (this._sujeito.numero() == NumeroSubstantivo.PLURAL)
                ? _verbo.toTerceiraPessoaPlural()
                : _verbo.toTerceiraPessoaSingular();
    }// </editor-fold>
}
