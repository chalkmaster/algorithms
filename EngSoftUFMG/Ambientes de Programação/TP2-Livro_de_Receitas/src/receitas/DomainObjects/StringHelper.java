package receitas.DomainObjects;

import java.util.List;

/**
 * @author Charles.Fortes
 */
public class StringHelper {
    public static String join(List<String> lst, CharSequence s)
    {
        StringBuilder msg = new StringBuilder();
        for (String item : lst)
            msg.append(item).append(s);

        return msg.toString();
    }

    public static String join(String[] lst, CharSequence s) {
        StringBuilder msg = new StringBuilder();
        for (String item : lst)
            msg.append(item).append(s);

        return msg.toString();
    }
}
