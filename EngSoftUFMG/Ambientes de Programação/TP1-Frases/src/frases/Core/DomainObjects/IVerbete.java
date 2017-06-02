/*
 * Assinatura para as classes de verbetes
 */

package frases.Core.DomainObjects;

/**
 * Interface de assinaturas para os métodos das classes do tipo verbete
 * @author Charles Fortes
 */
public interface IVerbete {
    /**
     * Tipo do Verbete
     * @return Tipo do Verbete
     */
    TipoVerbete tipo();
    /**
     * Palavra principal do verbete
     * @return Palavra do verbete
     */
    String palavra();
}
