/*
 * Assinaturas para as classes de Dicionário
 */

package frases.Core.DomainObjects;

/**
 * Interface com assinaturas para as classes de Dicionário
 * @author Charles Fortes
 */
public interface IDicionario {

    /**
     * Capacidade padrão de verbetes do dicionário
     */
    int CAPACIDADE_PADRAO = 20;
    /**
     * Verbetes do dicionário
     * @return arranjo de verbetes do dicionário
     */
    IVerbete[] verbetes();
    /**
     * Quantidade Atual de itens do dicionário
     * @return quantidade de verbetes
     */
    int quantidade();
    /**
     * capacidade máxima atual do dicionário
     * @return número de elementos que o dicionário pode ter
     */
    int capacidade();
    /**
     * Adiciona um verbete ao dicionário para consulta
     * @param verbete: verbete a ser incluído no dicionário
     */
    void adicionar(IVerbete verbete);
}
