package receitas.LivroReceitas;

import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
import receitas.DomainObjects.*;

/**
 *
 * @author Charles.Fortes
 */
public class LivroDeReceitas extends JFrame implements CadIngredienteModalListener, CadReceitasModalListener {
    private JList lstIngredientes;
    private JList lstReceitas;
    private JLabel lblIngrs;
    private JLabel lblReceitas;
    private JButton btnCadIngrs;
    private JButton btnCadRec;
    private JPanel topPane;
    private JPanel bottomPane;
    private JPanel centerPane;
    private JPanel leftPane; //apenas para dar um espaço na lateral
    private JPanel rightPane; //apenas para dar um espaço na lateral
    private java.util.List<Ingrediente> ingredientes = new ArrayList<Ingrediente>();
    private java.util.List<Receita> receitas = new ArrayList<Receita>();

    public LivroDeReceitas()
    {
        super("Livro de Receitas");
        initialize();
    }

    private void initialize()
    {
        LayoutManager layout = new BorderLayout(10, 10);
        this.getContentPane().setLayout(layout);
        
        lstIngredientes = new JList();
        lstReceitas = new JList();
        lblIngrs = new JLabel("Ingredientes");
        lblReceitas = new JLabel("Receitas");
        btnCadIngrs = new JButton("Cadastrar Ingrediente");
        btnCadRec = new JButton("Cadastrar Receita");
        topPane = new JPanel(new GridLayout(1, 2, 10,10));
        bottomPane = new JPanel(new GridLayout(1, 2, 10, 10));
        centerPane = new JPanel(new GridLayout(1, 2, 10, 10));
        rightPane = new JPanel();
        leftPane = new JPanel();

        //lstINgredientes
        lstIngredientes.setSelectionMode(ListSelectionModel.MULTIPLE_INTERVAL_SELECTION);
        lstIngredientes.setLayoutOrientation(JList.VERTICAL);
        lstIngredientes.setCellRenderer(new ingrCellRender());        
        //---

        //lstReceitas
        lstReceitas.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        lstReceitas.setLayoutOrientation(JList.VERTICAL);
        lstReceitas.setCellRenderer(new recCellRender());
        lstReceitas.addMouseListener(new MouseAdapter() {
            @Override
           public void mouseClicked(MouseEvent e)
           {
                if (e.getClickCount() == 2)
                    JOptionPane.showMessageDialog(null, ((Receita)lstReceitas.getSelectedValue()).descrever());
           }
        });
        // ---

        //btnCadIngrs
        btnCadIngrs.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                btnCadIngrs_action(e);
            }});
        // ---

        //btnCadRec
        btnCadRec.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                btnCadRec_action(e);
            }});
        // ---

        topPane.add(lblIngrs);
        topPane.add(lblReceitas);

        centerPane.add(new JScrollPane(lstIngredientes));
        centerPane.add(new JScrollPane(lstReceitas));

        bottomPane.add(btnCadIngrs);
        bottomPane.add(btnCadRec);

        this.getContentPane().add(topPane, BorderLayout.NORTH);
        this.getContentPane().add(centerPane, BorderLayout.CENTER);
        this.getContentPane().add(bottomPane, BorderLayout.SOUTH);

        this.getContentPane().add(rightPane, BorderLayout.EAST);
        this.getContentPane().add(leftPane, BorderLayout.WEST);
        
        this.setSize(600, 600);        
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    private void btnCadIngrs_action(ActionEvent e)
    {
        JFrame cadIng = new CadastroIngrediente(this);
        cadIng. setVisible(true);
    }

    private void btnCadRec_action(ActionEvent e)
    {
        if (lstIngredientes.getSelectedValues().length <= 0)
        {
            JOptionPane.showMessageDialog(null, "É necessário selecionar pelo menos "
                    + "um ingrediente da lista");
            return;
        }
        
        java.util.List<Ingrediente> ingrs = new ArrayList<Ingrediente>();
        for (Object o : lstIngredientes.getSelectedValues())
            ingrs.add((Ingrediente)o);
        
        JFrame cadRec = new CadastroReceita(this, ingrs);
        cadRec.setVisible(true);
    }

    public void modalResult(Ingrediente result)
    {
        ingredientes.add(result);
        lstIngredientes.setListData(ingredientes.toArray());
        repaint();
    }

    public void modalResult(Receita result)
    {
        receitas.add(result);
        lstReceitas.setListData(receitas.toArray());
        repaint();
    }

    private class ingrCellRender extends JLabel implements ListCellRenderer
    {
        ingrCellRender()
        {
            setOpaque(true);
        }
        
        public Component getListCellRendererComponent(JList list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
            Ingrediente _ingr = (Ingrediente)value;
            setText(_ingr.nome());
            if (isSelected) {
                setBackground(list.getSelectionBackground());
                setForeground(list.getSelectionForeground());
            } else {
                setBackground(list.getBackground());
                setForeground(list.getForeground());
            }

            return this;
        }   
    }

    private class recCellRender extends JLabel implements ListCellRenderer
    {
        recCellRender() {
            setOpaque(true);
        }

        public Component getListCellRendererComponent(JList list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
            Receita _rec = (Receita)value;
            setText(_rec.nome());
            if (isSelected) {
                setBackground(list.getSelectionBackground());
                setForeground(list.getSelectionForeground());
            } else
            {
                setBackground(list.getBackground());
                setForeground(list.getForeground());
            }
            return this;
        }

    }
}
