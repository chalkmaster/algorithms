/*
 * Assinatura dos métodos de Verbo
 */

package frases.Core.DomainObjects;

/**
 * Interface de assinatura dos métodos das classes de verbo
 * @author Charles Fortes
 */
public interface IVerbo extends IVerbete {
    /**
     * Tipo do Verbo
     * @return Tipo do Verbo
     */
    TipoVerbo tipoVerbal();
    /**
     * Verbo conjulgado na terceita pessoal do plural
     * @return verbo conjulgado
     */
    String toTerceiraPessoaPlural();
    /**
     * Verbo conjulgado na terceira pessoa do singular
     * @return verbo conjulgado
     */
    String toTerceiraPessoaSingular();
}
