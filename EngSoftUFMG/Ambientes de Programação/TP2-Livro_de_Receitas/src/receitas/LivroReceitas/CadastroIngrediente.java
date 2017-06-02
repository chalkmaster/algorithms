package receitas.LivroReceitas;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import receitas.DomainObjects.*;

/**
 * @author Charles.Fortes
 */
public class CadastroIngrediente extends JFrame {
    private JLabel lblTipo;
    private JLabel lblNome;
    private JTextField txtNome;
    private JComboBox cboTipo;
    private JButton btnSalvar;
    private JButton btnCancelar;
    private JPanel buttonsPane;
    private CadIngredienteModalListener parent;
    
    public CadastroIngrediente(CadIngredienteModalListener parent) {
        super("Cadastro de ingrediente");
        this.parent = parent;
        intialize();
    }

    private void intialize() {
        this.getContentPane().setLayout(new GridLayout(5, 1, 5, 5));

        lblNome = new JLabel("Nome do ingrediente");
        lblTipo = new JLabel("Tipo do ingrediente");
        txtNome = new JTextField();
        cboTipo = new JComboBox(new String[]{"Líquido", "Sólido", "Em Pó", "Misto"});
        btnSalvar = new JButton("Salvar");
        btnCancelar = new JButton("Cancelar");
        buttonsPane = new JPanel(new GridLayout(1, 2, 5, 5));

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

        this.getContentPane().add(lblNome);
        this.getContentPane().add(txtNome);
        this.getContentPane().add(lblTipo);
        this.getContentPane().add(cboTipo);        
        this.getContentPane().add(buttonsPane);

        this.setSize(320, 240);
        this.setAlwaysOnTop(true);
    }

    private void btnSalvar_action(ActionEvent e)
    {
        try{
            parent.modalResult(new Ingrediente(txtNome.getText(), 1, cboTipo.getSelectedIndex()));
        } catch (IngredienteException ex)
        {
            JOptionPane.showMessageDialog(null, "Falha ao criar novo ingrediente\n\n" + ex.getMessage());
        } finally
        {
            btnCancelar.doClick();
        }
    }
    
    private void btnCancelar_action(ActionEvent e)
    {
        this.setVisible(false);
        this.dispose();
    }
}
