/*
 * Assinaturas para as classes de serviço de dicionário
 */

package frases.Core.Services;

import frases.Core.DomainObjects.*;

/**
 * Interface de assinaturas para as classes de serviço do sistema
 * @author Charles Fortes
 */
public interface IDicionarioService {
    /**
     * Caminho do arquivo contendo os verbetes do dicionário
     */
    String CAMINHO_ARQUIVO = "mini-dicionário.txt";
    /**
     * Dicionário contendo as definições de Verbos e Substantivos suportados
     * @return Instância do Dicionário
     */
    IDicionario dicionario();
    /**
     * Localiza um verbete no dicionário baseado na palavra do verbete
     * @param palavra -> palavra a ser localizada no dicionário
     * @return Verbete localizado
     */
    IVerbete localizar(String palavra);
    
}
