package receitas.DomainObjects;

/**
 *
 * @author Charles.Fortes
 */
public class Descascado extends Ingrediente implements IResultado {
    Ingrediente ingrOriginal;

    Descascado(Ingrediente ingr) throws IngredienteException {
        super(ingr.nome() + " descascado", ingr.quantidade(), TIPO_SOLIDO);
        ingrOriginal = ingr;
    }
}
