package receitas.DomainObjects;

/**
 *
 * @author Charles.Fortes
 */
public class Batido extends Ingrediente implements IResultado {
    Ingrediente ingrOriginal;

    Batido(Ingrediente ingr) throws IngredienteException {
        super(ingr.nome() + " batido", ingr.quantidade(), TIPO_LIQUIDO);
        ingrOriginal = ingr;
    }
}
