using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MainUi
{
    public partial class Form1 : Form
    {
        private BlocklyLua lua_control;
        private OutputConsole con;

        public Form1()
        {
            InitializeComponent();
            string appDir = Path.GetDirectoryName(Application.ExecutablePath);
            outputBrowser.Navigate(Path.Combine(appDir, "emptyOutput.html"));
            lua_control = new BlocklyLua(codeBrowser);
        }

        private void connectButton_Click(object sender, EventArgs e)
        {
            var nodes = NodeMCU.find_node(con);
            foreach (var node in nodes)
            {
                toolStripNodes.Items.Add(node.ToString());
            }
        }

        private void runButton_ButtonClick(object sender, EventArgs e)
        {
            var code = lua_control.GetCode();
            con.WriteLine(code);
        }

        private void outputBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            if(outputBrowser.Url.ToString().Contains("emptyOutput.html")) { 
                con = new HtmlOutputWrapper(outputBrowser.Document);
            }
        }

        private void codeBrowser_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {

        }
    }
}
