/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package tp2;

import TP.UTIL.LoadData;

/**
 *
 * @author Charles.Fortes
 */
public class DBCadastro {
    private String[][] data;
    private Node[] hashTableNome;
    private Node[] hashTableCpf;
    private static final int numIndexes = 13;

    public DBCadastro()
    {
        CadastroLoader loader = new CadastroLoader();
        try {
            data = loader.load();
        } catch (Exception ex) {
            System.out.println("Erro ao carregar dados:\n" + ex.getMessage());
        }

        hashTableNome  = new Node[numIndexes];
        hashTableCpf = new Node[numIndexes];

        loadHashTableData();
    }

    private void loadHashTableData()
    {
        for (int i = 0; i < data.length; i++)
        {
            hashTableNome[hash.getHash(data[i][0], numIndexes)] =
                new Node(data[i][0],
                            i,
                            hashTableNome[hash.getHash(data[i][0], numIndexes)]);

            hashTableCpf[hash.getHash(data[i][1], numIndexes)] =
                new Node(data[i][1],
                            i,
                            hashTableCpf[hash.getHash(data[i][1], numIndexes)]);
        }
    }

    public void PrintHashTableForTest()
    {
        System.out.println("\n--- Dados na HashTable Nome ------------------------");
        for (Node d : hashTableNome){
            if (d != null)
                System.out.println("\t" + d);
            else
                System.out.println("\t" + "Posição Nula");
        }

        System.out.println("\n\n--- Dados na HashTable CPF ------------------------");
        for (Node d : hashTableCpf){
            if (d != null)
                System.out.println("\t" + d);
            else
                System.out.println("\t" + "Posição Nula");
        }
    }

    public void FindByName(String name)
    {
        Node n = hashTableNome[hash.getHash(name, numIndexes)];
        while (n !=null)
        {
            if (n.Key.equals(name)){                
                System.out.println(
                        "Nome = \"" + data[n.Index][0] + "\" || " +
                        "Cpf = \"" + data[n.Index][1] + "\" || " +
                        "Idade = \"" + data[n.Index][2] + "\" || " +
                        "Sexo = \"" + data[n.Index][3] + "\" || " +
                        "Endereço = \"" + data[n.Index][4] + "\"");
            }
            n = n.Next;
        }
    }

    public void FindByCpf(String cpf)
    {
        Node n = hashTableCpf[hash.getHash(cpf, numIndexes)];
        while (n !=null)
        {
            if (n.Key.equals(cpf)){
                System.out.println(
                        "Nome = \"" + data[n.Index][0] + "\" || " +
                        "Cpf = \"" + data[n.Index][1] + "\" || " +
                        "Idade = \"" + data[n.Index][2] + "\" || " +
                        "Sexo = \"" + data[n.Index][3] + "\" || " +
                        "Endereço = \"" + data[n.Index][4] + "\"");
            }
            n = n.Next;
        }
    }

    public void RemoveByCpf(String cpf)
    {
        int NodeIndex = hash.getHash(cpf, numIndexes);
        Node n = hashTableCpf[NodeIndex];
        Node prev = null;
        while (n !=null)
        {
            if (n.Key.equals(cpf)){
                if (prev == null)
                    hashTableCpf[NodeIndex] = n.Next;
                else
                    prev.Next = n.Next;
                
                RemoveByNameAndInxex(data[n.Index][0], n.Index);
                
                data[n.Index] = null;

                n.Next = null;
                n = null;
            }
            prev = n;
            n = (n == null) ? null : n.Next;
        }
    }

    private void RemoveByNameAndInxex(String name, int Index)
    {
        int NodeIndex = hash.getHash(name, numIndexes);
        Node n = hashTableNome[NodeIndex];
        Node prev = null;
        while (n !=null)
        {
            if (n.Key.equals(name) && n.Index == Index){
                if (prev == null)
                    hashTableCpf[NodeIndex] = n.Next;
                else
                    prev.Next = n.Next;

                n.Next = null;
                n = null;
            }
            prev = n;
            n = (n == null) ? null : n.Next;
        }
    }

    private class CadastroLoader extends LoadData{
        String[][] data = new String[40][];
        private int lastPosition = 0;
        @Override
        protected String getCaminhoArquivo() { return "nomes.txt"; }

        @Override
        protected void adicionar(String linha) {
            data[lastPosition++] = linha.split(";");
        }

        @Override
        protected String[][] getData(){ return data; }
    }

    private static class hash
    {
        public static int getHash(String key, int seed)
        {
            int sum = 0;
            for (char c : key.toCharArray())
            {
                sum +=c;
            }
            return sum % seed;
        }
    }

    private class Node{
        public Node Next = null;
        public String Key = null;
        public int Index = -1;
        
        public Node (String key, int index, Node next)
        { Key = key; Index = index; Next = next; }

        @Override
        public String toString()
        {
            return "NodeData: Key = \"" + Key + "\" <-> ItemIndex = \"" + Index
                    + "\" <-> NextNode =>> "
                    + (Next == null ?  "Nulo" : Next.toString());
        }
    }
}
