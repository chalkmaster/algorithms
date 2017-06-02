package receitas.DomainObjects;

/**
 *
 * @author Charles.Fortes
 */
public class Congelado extends Ingrediente implements IResultado {
    Ingrediente ingrOriginal;

    Congelado(Ingrediente ingr) throws IngredienteException {
        super(ingr.nome() + " congelado", ingr.quantidade(), TIPO_SOLIDO);
        ingrOriginal = ingr;
    }
}
