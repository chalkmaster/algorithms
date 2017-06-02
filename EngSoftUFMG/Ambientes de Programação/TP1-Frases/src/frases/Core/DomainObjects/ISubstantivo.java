/*
 * Assinaturas para as classes de Substantivos
 */

package frases.Core.DomainObjects;

/**
 * interface de assinaturas de métodos para as classes de substantivos
 * @author Charles Fortes
 */
public interface ISubstantivo extends IVerbete {
    /**
     * Número do substantivo
     * @return Número do substantivo
     */
    NumeroSubstantivo numero();
    /**
     * Genero do substantivo
     * @return Genero do substantivo
     */
    GeneroSubstantivo genero();
}
