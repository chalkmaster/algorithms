package receitas.DomainObjects;

/**
 *
 * @author Charles.Fortes
 */
public class Picado extends Ingrediente implements IResultado{
    Ingrediente ingrOriginal;

    Picado(Ingrediente ingr) throws IngredienteException {
        super(ingr.nome() + " picado", ingr.quantidade(), TIPO_SOLIDO);
        ingrOriginal = ingr;
    }
}
