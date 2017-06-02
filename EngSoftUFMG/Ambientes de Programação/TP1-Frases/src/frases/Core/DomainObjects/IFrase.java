/*
 * Assinaturas para as classes de Frase
 */

package frases.Core.DomainObjects;

/**
 * Interface com as assinaturas dos métodos para as classes de frase
 * @author Charles Fortes
 */
public interface IFrase {
    /**
     * Substantivo que representa o sujeito da frase
     * @return sujeito da frase
     */
    ISubstantivo sujeito();
    /**
     * Ação executada pelo sujeito
     * @return Verbo da frase
     */
    IVerbo verbo();
    /**
     * Objeto direto da ação do sujeito
     * @return objeto da frase
     */
    ISubstantivo objeto();
}
