package receitas.LivroReceitas;

import java.awt.*;
import java.awt.event.*;
import java.util.*;
import javax.swing.*;
import javax.swing.border.LineBorder;
import receitas.DomainObjects.*;

/**
 * @author Charles.Fortes
 */
public class CadastroReceita extends JFrame {
    private JLabel lblIngrs;
    private JLabel lblNome;
    private JTextField txtNome;
    private JButton btnSalvar;
    private JButton btnCancelar;
    private JPanel buttonsPane;
    private CadReceitasModalListener parent;
    private JPanel topPane;
    private JPanel bottomPane;
    private JPanel centerPane;
    private JPanel leftPane; //apenas para dar um espaço na lateral
    private JPanel rightPane; //apenas para dar um espaço na lateral
    private java.util.List<Ingrediente> ingredientes = new ArrayList<Ingrediente>();
    private java.util.List<Ingrediente> ingrsSalvos = new ArrayList<Ingrediente>();
    private java.util.List<Tarefa> tarefas = new ArrayList<Tarefa>();
    private JPanel ingredientesPane;
    private JPanel cTarefasPane;
    private JPanel tarefasPane;
    private JFrame self;
    
    public CadastroReceita(CadReceitasModalListener parent, java.util.List<Ingrediente> ingrs) {
        super("Cadastro de receitas");
        this.parent = parent;
        this.ingredientes = ingrs;
        intialize();        
    }

    private void intialize()
    {
        this.getContentPane().setLayout(new BorderLayout(5, 5));

        lblNome = new JLabel("Nome da Receita");
        txtNome = new JTextField();
        btnSalvar = new JButton("Salvar");
        btnCancelar = new JButton("Cancelar");
        buttonsPane = new JPanel(new GridLayout(1, 2, 5, 5));
        topPane = new JPanel(new GridLayout(3, 1, 10,10));
        bottomPane = new JPanel(new GridLayout(1, 1, 10, 10));
        centerPane = new JPanel(new GridLayout(1, 2, 10, 10));
        rightPane = new JPanel();
        leftPane = new JPanel();
        lblIngrs = new JLabel("Ingredientes");
        ingredientesPane = new JPanel(new FlowLayout());
        cTarefasPane = new JPanel(new FlowLayout());
        tarefasPane = new JPanel();
        BoxLayout b = new BoxLayout(tarefasPane, BoxLayout.Y_AXIS);
        tarefasPane.setLayout(b);

        // btnSalvar
        btnSalvar.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                btnSalvar_action(e);
            }});
        // ---

        // btnCancelar
        btnCancelar.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                btnCancelar_action(e);
            }});
        // ---
        buttonsPane.add(btnSalvar);
        buttonsPane.add(btnCancelar);

       // INgredientPane        
        for (Ingrediente ingr : ingredientes)
            ingredientesPane.add(new ingrPane(ingr));
        // ---
                
        topPane.add(lblNome);
        topPane.add(txtNome);
        topPane.add(lblIngrs);


        // TarefasPane
        tarefasPane.setBorder(new LineBorder(Color.BLACK));
        cTarefasPane.setPreferredSize(new Dimension(200, 330));
        cTarefasPane.add(new cadTarefaPane());
        cTarefasPane.add(tarefasPane);
        // ---

        centerPane.add(ingredientesPane);
        centerPane.add(new JScrollPane(cTarefasPane));
        
        bottomPane.add(buttonsPane);
        

        this.getContentPane().add(topPane, BorderLayout.NORTH);
        this.getContentPane().add(centerPane, BorderLayout.CENTER);
        this.getContentPane().add(bottomPane, BorderLayout.SOUTH);

        this.getContentPane().add(rightPane, BorderLayout.EAST);
        this.getContentPane().add(leftPane, BorderLayout.WEST);

        this.setSize(700, 600);
        this.setAlwaysOnTop(true);
        
        self = this;

        for (Component c: ingredientesPane.getComponents())
        {
            ingrPane i = (ingrPane)c;
            ingrsSalvos.add(i.save());
        }
        
    }

    /**
     * Action listener do bortão de salvar
     * @param e
     */
    private void btnSalvar_action(ActionEvent e)
    {
        if (txtNome.getText().isEmpty()){
            JOptionPane.showMessageDialog(self, "Favor informar um nome");
            return;
        }

        for (Component c: ingredientesPane.getComponents())
        {
            ingrPane i = (ingrPane)c;
            i.update();
        }

        for (Component c: tarefasPane.getComponents())
        {
            tarefaPane<Tarefa>  t = (tarefaPane<Tarefa>)c;
            if (t.lblDesc != null){
                Tarefa tr = t.save();
                tarefas.add(tr);
            }
        }
        
        parent.modalResult(new Receita(txtNome.getText(), ingrsSalvos, tarefas));
        btnCancelar.doClick();
    }

    /**
     * Action listener do botão de cancelar
     * @param e
     */
    private void btnCancelar_action(ActionEvent e)
    {
        this.setVisible(false);
        this.dispose();
    }

    /**
     * reptresenta o painel de ingredientes para o usuário digitar a quantidade
     */
    private class ingrPane extends JPanel
    {
        private Ingrediente _ingr;
        private JLabel lblIngr;
        private JTextField txtQtd;
        private JLabel lblQuantidade;
        
        private ingrPane(Ingrediente ingr) {
            _ingr = ingr;
            initialize();
        }

        private void initialize() {
            this.setLayout(new GridLayout(2,2,10,10));
            lblIngr = new JLabel(_ingr.nome());
            lblQuantidade = new JLabel("Quantidade");
            txtQtd = new JTextField(((Float)_ingr.quantidade()).toString());

            this.add(lblIngr);
            this.add(new JPanel());
            this.add(lblQuantidade);
            this.add(txtQtd);
            this.setBorder(new javax.swing.border.LineBorder(Color.BLACK));
        }

        public Ingrediente save()
        {
            Ingrediente ingr = null;
            try {
                ingr = new Ingrediente(_ingr.nome(), Float.parseFloat(txtQtd.getText()), _ingr.tipo());
                _ingr = ingr;
            } catch (IngredienteException ex) {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } catch (Exception ex)
            {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            } finally {
                return ingr;
            }
        }

        public void update()
        {
            ingrsSalvos.remove(_ingr);
            ingrsSalvos.add(save());
        }
    }

    /**
     * representa o painel de tarefas incluídas no sistema
     * @param <T>: Tipo da tarefa
     */
    private class tarefaPane<T extends Tarefa> extends JPanel
    {
        private Tarefa _tarefa;
        private JLabel lblDesc;

        tarefaPane(T tarefa) {            
            _tarefa = tarefa;
            initialize();    
        }

        private void initialize() {
            this.setLayout(new GridLayout(2,2,0,0));
            try {
                _tarefa.executar(Tarefa.getIngredientesTarefa(_tarefa, ingrsSalvos));
                ingrsSalvos.add(_tarefa.resultado());
                lblDesc = new JLabel(
                        _tarefa.descrever(Tarefa.getIngredientesTarefa(_tarefa, ingrsSalvos))
                        + "(res: " + _tarefa.resultado().nome() +")");
            } catch (TarefaException ex) {
                JOptionPane.showMessageDialog(self, ex.getMessage());
                return;
            } catch (IngredienteException ex) {
                JOptionPane.showMessageDialog(self, ex.getMessage());
                return;
            }

            this.add(lblDesc);
            this.setBorder(new javax.swing.border.LineBorder(Color.BLACK));
            this.setPreferredSize(new Dimension(300, 25));
        }

        public T save()
        {
            return (T)_tarefa;
        }

    }

    /**
     * representa o painel de cadastro de novas tarefas
     */
    private class cadTarefaPane extends JPanel
    {
        private JLabel lblNomeTarefa;
        private JComboBox cboTarefas;
        private JTextField txtNomeIngrediente;
        private JLabel lblNomeIngrediente;
        private JButton btnAddTarefa;

        private cadTarefaPane() {
            initialize();
        }

        private void initialize() {
            this.setLayout(new GridLayout(3,2, 0,0));
            lblNomeIngrediente = new JLabel("Ingredinete");
            lblNomeTarefa = new JLabel("Tarefa");
            txtNomeIngrediente = new JTextField();

            cboTarefas = new JComboBox(new String[]{"Bater", "Congelar",
                                   "Descascar", "Fatiar", "Misturar", "Picar"});
            cboTarefas.addItemListener(new ItemListenerImpl())
                    ;
            btnAddTarefa = new JButton("+");
            
            this.add(lblNomeTarefa);
            this.add(cboTarefas);

            this.add(lblNomeIngrediente);
            this.add(txtNomeIngrediente);

            this.add(new JPanel());
            btnAddTarefa.addActionListener(new ActionListenerImpl());
            this.add(btnAddTarefa);
        }

        private class ItemListenerImpl implements ItemListener {
            public void itemStateChanged(ItemEvent e) {
                if (e.getItem().toString().equals("Misturar") &&
                        e.getStateChange() == ItemEvent.SELECTED)
                {
                    txtNomeIngrediente.setText("");
                    txtNomeIngrediente.setVisible(false);
                    lblNomeIngrediente.setVisible(false);
                }
                else{
                    txtNomeIngrediente.setVisible(true);
                    lblNomeIngrediente.setVisible(true);
                }
            }
        }

        private class ActionListenerImpl implements ActionListener {

            public void actionPerformed(ActionEvent e) {
                switch (cboTarefas.getSelectedIndex()) {
                    case 0:
                        tarefasPane.add(new tarefaPane<Bater>(new Bater(
                                new String[]{txtNomeIngrediente.getText()})));
                        break;
                    case 1:
                        tarefasPane.add(new tarefaPane<Congelar>(new Congelar(
                                new String[]{txtNomeIngrediente.getText()})));
                        break;
                    case 2:
                        tarefasPane.add(new tarefaPane<Descascar>(new Descascar(
                                new String[]{txtNomeIngrediente.getText()})));
                        break;
                    case 3:
                        tarefasPane.add(new tarefaPane<Fatiar>(new Fatiar(
                                new String[]{txtNomeIngrediente.getText()})));
                        break;
                    case 4:
                        tarefasPane.add(new tarefaPane<Misturar>(new Misturar(
                                new String[]{
                            JOptionPane.showInputDialog(self, "Informe o primeiro ingrediente"),
                            JOptionPane.showInputDialog(self, "Informe o segundo ingrediente"),
                        })));
                        break;
                    case 5:
                        tarefasPane.add(new tarefaPane<Picar>(new Picar
                                (new String[]{txtNomeIngrediente.getText()})));
                        break;
                }
                self.setVisible(true); //Força a atualização visual da janela
            }
        }

    }
}
