package receitas.DomainObjects;

/**
 *
 * @author Charles.Fortes
 */
public class Fatiado extends Ingrediente implements IResultado {
    Ingrediente ingrOriginal;

    Fatiado(Ingrediente ingr) throws IngredienteException {
        super(ingr.nome() + " fatiado", ingr.quantidade(), TIPO_SOLIDO);
        ingrOriginal = ingr;
    }
}
